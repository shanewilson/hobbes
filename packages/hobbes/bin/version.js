const semver = require('semver');
const execa = require('execa');
const Listr = require('listr');
const readPkgUp = require('read-pkg-up');

const pkg = readPkgUp.sync().pkg;

const tasks = new Listr([
  {
    title: 'Bump Package Version',
    task: () => execa('npm', ['--no-git-tag-version', 'version', process.env.NEXT_VERSION, '--force']),
  },
  {
    title: 'Lerna Cross Package Updates',
    task: () => execa('lerna', ['publish', '--repo-version', process.env.NEXT_VERSION, '--skip-git', '--skip-npm', '--yes']),
  },
]);

tasks.run().catch(err => {
  console.error(err.message);
});
