const execa = require('execa');
const Listr = require('listr');
const fs = require('graceful-fs');
const readPkgUp = require('read-pkg-up');
const dateFormat = require('dateformat');

const pkg = readPkgUp.sync().pkg;

let FROM_TAG = process.env.FROM_TAG;
const TO_TAG = process.env.TO_TAG || 'HEAD';
let LINES;
let PRS;
let LOGS;

const formatLines = (line, matchedPr) => {
  const ls = [];
  const tickets = line.tickets.split(',').map(t => `[${t}](${process.env.JIRA_URL}/${t})`);
  ls.push(`- [${tickets}] ${line.title}`);
  ls.push(`([${line.short}](https://github.com/${process.env.GIT_REPO}/commit/${line.commit}))`);
  if (matchedPr) {
    ls.push(`[#${matchedPr.number}](${matchedPr.url})`);
  }
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
      LOGS = LINES.reduce((acc, l) => {
        const [tickettitle, commit, short] = l.split('__SPLIT__');
        const match = tickettitle.match(/^\[(.*)\] (.*)$/);
        if (!match) return acc;
        const [_, tickets, title] = match;
        const line = {
          title,
          tickets,
          commit,
          short,
        };

        const matchedPr = PRS.find(pr => pr.mergeCommitSha === line.commit);
        return [...acc, formatLines(line, matchedPr)];
      }, []).join('\n');
    },
  },
  {
    title: 'Appending new changes',
    task: () => {
      const CL = 'CHANGELOG.md';
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

module.exports = changelog;

changelog.run().catch(err => {
  console.error(err.message);
});
