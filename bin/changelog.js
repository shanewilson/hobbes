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

let emojiMapping = Object.assign({}, {
  sparkles: 'Features',
  bug: 'Fixes',
  memo: 'Documentation',
}, (pkg.hobbes || {}).emojiMapping || {});

const formatLines = (line, matchedPr) => {
  const ls = [];
  ls.push(`-`);
  if (line.emojis) {
    ls.push(line.emojis);
  }
  if (line.tickets) {
    const tickets = line.tickets.split(',').map(t => `[${t}](${process.env.JIRA_URL}/${t})`);
    ls.push(`[${tickets}]`);
  }
  ls.push(line.title);
  ls.push(`([${line.short}](https://github.com/${process.env.GIT_REPO}/commit/${line.commit}))`);
  if (matchedPr) ls.push(`[#${matchedPr.number}](${matchedPr.url})`);

  return ls.join(' ');
};

const changelog = new Listr([
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
        const match = tickettitle.match(/^(:(.+?):(:.+:)?) (\[(.*)\] )?(.*)$/);
        if (!match || !emojiMapping[match[2]]) return acc;

        const [_1, _2, type, emojis, _3, tickets, title] = match;

        const line = {
          title,
          tickets,
          emojis,
          commit,
          short,
        };

        const matchedPr = PRS.find(pr => pr.mergeCommitSha === line.commit);
        return Object.assign({}, acc, {
          [type]: [...(acc[type] || []), formatLines(line, matchedPr)],
        });
      }, {});

      LOGS = Object.keys(lines).map(key => `### :${key}: ${emojiMapping[key]}\n\n${lines[key].join('\n')}`).join('\n\n');
    },
  },
  {
    title: 'Appending new changes',
    task: () => {
      const CL = `${config.get('path_project')}/CHANGELOG.md`;
      try {
        const data = fs.readFileSync(CL, 'utf-8');

        const title = `[${process.env.NEXT_VERSION}](https://github.com/${process.env.GIT_REPO}/compare/${FROM_TAG}...${process.env.NEXT_VERSION})`;
        const nextChangelog = `## ${title} (${dateFormat(new Date(), 'yyyy-mm-dd', true)})\n\n${LOGS}\n\n${data}`;

        fs.writeFile(CL, nextChangelog, 'utf-8');
      } catch (err) {
        throw err;
      }
    },
  },
]);

module.exports = changelog;
