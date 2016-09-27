const execa = require('execa');
const Listr = require('listr');
const fs = require('graceful-fs');
const readPkgUp = require('read-pkg-up');
const dateFormat = require('dateformat');
const config = require('../config');

const pkg = readPkgUp.sync().pkg;

let FROM_TAG = process.env.FROM_TAG;
const TO_TAG = process.env.TO_TAG || 'HEAD';
let LINES = [];
let PRS = [];
let LOGS;

const formatLines = (line, matchedPr) => {
  const ls = [];
  ls.push(`- ${line.emojis}`);
  if (line.tickets) {
    const tickets = line.tickets.split(',').map(t => `[${t}](${process.env.JIRA_URL}/${t})`);
    ls.push(`[${tickets}]`);
  }
  ls.push(line.title);
  ls.push(`([${line.short}](https://github.com/${process.env.GIT_REPO}/commit/${line.commit}))`);
  if (matchedPr) ls.push(`[#${matchedPr.number}](${matchedPr.url})`);

  return ls.join(' ');
};

const tasks = new Listr([
  {
    title: 'Gathering required info',
    task: () => new Listr([
      {
        title: 'Finding local changes',
        task: () => new Listr([
          {
            title: 'Finding latest tag',
            skip: () => FROM_TAG,
            task: () => execa.stdout('git', ['describe', '--abbrev=0', '--tags']).then(tag => {
              FROM_TAG = tag;
            }),
          },
          {
            title: 'Finding commits',
            task: () => (
              execa.stdout('git', ['log', '--pretty=format:%s__SPLIT__%H__SPLIT__%h', `${TO_TAG}...${FROM_TAG}`]).then(ls => {
                LINES = ls.split('\n');
              })
            ),
          },
        ]),
      },
      {
        title: 'Fetching Pull Requests',
        skip: () => !process.env.GIT_REPO,
        task: () => (
          execa.stdout('curl', [`https://api.github.com/repos/${process.env.GIT_REPO}/pulls?sort=updated&direction=desc&state=closed`]).then(prs => {
            PRS = JSON.parse(prs).filter(pr => pr.merged_at).map(p => ({
              url: p.html_url,
              number: p.number,
              mergeCommitSha: p.merge_commit_sha,
            }));
          })
        ),
      },
    ], { concurrent: true }),
  },
  {
    title: 'Generating commit log',
    task: () => {
      const lines = LINES.reduce((acc, l) => {
        const [tickettitle, commit, short] = l.split('__SPLIT__');
        console.log(tickettitle);
        const match = tickettitle.match(/^(:(.+?):(:.+:)?) (\[(.*)\] )?(.*)$/);
        console.log(match);
        if (!match) return acc;
        const [_1, emojis, type, _2, _3, tickets, title] = match;

        const line = {
          title,
          tickets,
          emojis,
          commit,
          short,
        };
        console.log(line);
        const matchedPr = PRS.find(pr => pr.mergeCommitSha === line.commit);
        return Object.assign({}, acc, {
          [type]: [...(acc[type] || []), formatLines(line, matchedPr)],
        });
      }, {});

      LOGS = Object.keys(lines).map(key => lines[key].join('\n')).join('\n');
    },
  },
  {
    title: 'Appending new changes',
    task: () => {
      const CL = `${config.get('path_project')}/CHANGELOG.md`;
      fs.readFile(CL, (err, data) => {
        if (err) throw err;
        const nextChangelog = `## ${pkg.version} (${dateFormat(new Date(), 'yyyy-mm-dd', true)})\n\n${LOGS}\n\n${data}`;

        fs.writeFile(CL, nextChangelog, e => {
          if (e) throw e;
        });
      });
    },
  },
]);

module.exports = tasks;

if (process.env.STANDALONE) {
  tasks.run().catch(err => {
    console.error(err.message);
  });
}
