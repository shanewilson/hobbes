const semver = require('semver');
const execa = require('execa');
const Listr = require('listr');
const readPkgUp = require('read-pkg-up');

const pkg = readPkgUp.sync().pkg;

const npmChecks = new Listr([
  {
    title: 'Check npm version',
    skip: () => semver.lt(process.version, '6.0.0'),
    task: () => execa.stdout('npm', ['version', '--json']).then(json => {
      const versions = JSON.parse(json);
      if (!semver.satisfies(versions.npm, '>=2.15.8 <3.0.0 || >=3.10.1')) {
        throw new Error(`npm@${versions.npm} has known issues publishing when running Node.js 6. Please upgrade npm or downgrade Node and publish again. https://github.com/npm/npm/issues/5082`);
      }
    }),
  },
  {
    title: 'Checking repository is set',
    task: () => {
      if (!pkg.repository) {
        throw new Error('Need to set `repository` field in package.json');
      }
    },
  },
  {
    title: 'Checking bugs url is set',
    task: () => {
      if (!pkg.bugs) {
        throw new Error('Need to set `bugs` field in package.json');
      }
    },
  },
]);

const versionChecks = new Listr([
  {
    title: 'Checking NEXT_VERSION is set',
    task: () => {
      if (!process.env.NEXT_VERSION) {
        throw new Error('Need to pass version as NEXT_VERSION=x.y.z');
      }
    },
  },
  {
    title: 'Validate version',
    task: () => {
      if (!semver.valid(process.env.NEXT_VERSION)) {
        throw new Error('Version should be a valid semver version.');
      }

      if (semver.gte(pkg.version, process.env.NEXT_VERSION)) {
        throw new Error(`New version \`${process.env.NEXT_VERSION}\` should be higher than current version \`${pkg.version}\``);
      }
    },
  },
]);

const gitChecks = new Listr([
  {
    title: 'Check current branch',
    skip: () => process.env.ANY_BRANCH === '1',
    task: () => execa.stdout('git', ['symbolic-ref', '--short', 'HEAD']).then(branch => {
      if (!branch === 'master' || !branch === 'next') {
        throw new Error('Not on a `master` or `next` branch. Use ANY_BRANCH=1 to publish anyway.');
      }
    }),
  },
  {
    title: 'Check local working tree',
    task: () => execa.stdout('git', ['status', '--porcelain']).then(status => {
      if (status !== '') {
        throw new Error('Unclean working tree. Commit or stash changes first.');
      }
    }),
  },
  {
    title: 'Check git tag existence',
    task: () => execa('git', ['fetch'])
    .then(() => execa.stdout('git', ['rev-parse', '--quiet', '--verify', `refs/tags/${process.env.NEXT_VERSION}`]))
    .then(
      output => {
        if (output) {
          throw new Error(`Git tag \`v${process.env.NEXT_VERSION}\` already exists.`);
        }
      },
      err => {
        // Command fails with code 1 and no output if the tag does not exist,
        // even though `--quiet` is provided
        // https://github.com/sindresorhus/np/pull/73#discussion_r72385685
        if (err.stdout !== '' || err.stderr !== '') {
          throw err;
        }
      }
    ),
  },
  {
    title: 'Check remote history',
    task: () => execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(result => {
      if (result !== '0') {
        throw new Error('Remote history differ. Please pull changes.');
      }
    }),
  },
]);

const tasks = new Listr([
  {
    title: 'NPM checks',
    task: () => npmChecks,
  },
  {
    title: 'Version checks',
    task: () => versionChecks,
  },
  {
    title: 'Git checks',
    task: () => gitChecks,
  },
]);

module.exports = tasks;

if (!process.env.RELEASE) {
  tasks.run().catch(err => {
    console.error(err.message);
  });
}
