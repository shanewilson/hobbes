const execa = require('execa');
// const Listr = require('listr');
// const readPkgUp = require('read-pkg-up');

const formatLines = (line, matchedPr) => {
  const ls = [];
  const tickets = line.tickets.split(',').map(t => `<a href="${process.env.JIRA_URL}/${t}">${t}</a>`);
  ls.push(`[${tickets}] ${line.title}`);
  ls.push(`(<a href="https://github.com/${process.env.GIT_REPO}/commit/${line.commit}">${line.short}</a>)`);
  if (matchedPr) {
    ls.push(`<a href="${matchedPr.url}">#${matchedPr.number}</a>`);
  }
  return ls.join(' ');
};

execa.stdout('git', ['describe', '--abbrev=0', '--tags']).then(tag => (
  execa.stdout('git', ['log', '--pretty=format:%s__SPLIT__%H__SPLIT__%h)', `HEAD...${tag}`]).then(ls => {
    const lines = ls.split('\n');
    execa.stdout('curl', [`https://api.github.com/repos/${process.env.GIT_REPO}/pulls?sort=updated&direction=desc&state=closed`]).then(prs => {
      const mergedPrs = JSON.parse(prs).filter(pr => pr.merged_at).map(p => ({
        url: p.url,
        number: p.number,
        mergeCommitSha: p.merge_commit_sha,
      }));

      const log = lines.reduce((acc, l) => {
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

        const matchedPr = mergedPrs.find(pr => pr.mergeCommitSha === line.commit);
        return [...acc, formatLines(line, matchedPr)];
      }, []);

      console.log(log);
    });
  })
));
