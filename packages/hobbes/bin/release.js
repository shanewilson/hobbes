const semver = require('semver');
const execa = require('execa');
const Listr = require('listr');
const readPkgUp = require('read-pkg-up');

const pkg = readPkgUp.sync().pkg;

const tasks = new Listr([
  // {
  //   title: 'Git Commit Release',
  //   task: () => execa('git', ['commit', '-a', '-m', `:bookmark: ${process.env.NEXT_VERSION}`]),
  // },
  // {
  //   title: 'Git Tag Release',
  //   task: () => execa('git', ['tag', process.env.NEXT_VERSION, '-m', process.env.NEXT_VERSION]),
  // },
  // Publish
  // Push Everything
  // Git Release Notes
]);

tasks.run().catch(err => {
  console.error(err.message);
});
