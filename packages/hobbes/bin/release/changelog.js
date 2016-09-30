const execa = require('execa');
const Listr = require('listr');
const fs = require('graceful-fs');
const readPkgUp = require('read-pkg-up');
const dateFormat = require('dateformat');
const config = require('@shanewilson/hobbes-config');

const pkg = readPkgUp.sync().pkg;

const REPO_URL = pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, '')
let FROM_TAG = process.env.FROM_TAG;
const TO_TAG = process.env.TO_TAG || 'HEAD';
let LINES = [];
let LOGS;

const emojiMapping = Object.assign({}, {
  sparkles: 'Features',
  bug: 'Fixes',
  books: 'Documentation',
  racehorse: 'Performance',
  package: 'Refactor',
}, (pkg.hobbes || {}).emojiMapping || {});

const formatLines = (line, pr) => {
  const ls = [];
  ls.push('-');
  if (line.emojis) {
    ls.push(line.emojis);
  }
  if (line.tickets) {
    const tickets = line.tickets.split(',').map(t => `[${t}](${pkg.bugs.url}/${t})`);
    ls.push(`[${tickets}]`);
  }
  ls.push(line.title);
  if (pr) ls.push(`([#${pr}](${REPO_URL}/pull/${pr}))`);
  else ls.push(`([${line.short}](${REPO_URL}/commit/${line.commit}))`);

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
            }).catch(err => execa.stdout('git', ['rev-list', '--max-parents=0', 'HEAD']).then(commit => {
              FROM_TAG = commit;
            })),
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
    ], { concurrent: true }),
  },
  {
    title: 'Generating commit log',
    task: () => {
      const lines = LINES.reduce((acc, l) => {
        const [tickettitle, commit, short] = l.split('__SPLIT__');
        const match = tickettitle.match(/^(:(.+?):(:.+:)?) (\[(.*)\] )?(.*?)( \(#(.*)\))?$/);

        if (!match || !emojiMapping[match[2]]) return acc;

        const [_0, _1, type, emojis, _4, tickets, title, _7, pr] = match;

        const line = {
          title,
          tickets,
          emojis,
          commit,
          short,
        };

        return Object.assign({}, acc, {
          [type]: [...(acc[type] || []), formatLines(line, pr)],
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

        const title = `[${process.env.NEXT_VERSION}](${REPO_URL}}/compare/${FROM_TAG}...${process.env.NEXT_VERSION})`;
        const nextChangelog = `## ${title} (${dateFormat(new Date(), 'yyyy-mm-dd', true)})\n\n${LOGS}\n\n${data}`;

        fs.writeFile(CL, nextChangelog, 'utf-8');
      } catch (err) {
        throw err;
      }
    },
  },
]);

module.exports = tasks;

if (!process.env.RELEASE) {
  tasks.run().catch(err => {
    console.error(err.message);
  });
}
