'use strict';

var semver = require('semver');
var execa = require('execa');
var Listr = require('listr');
var readPkgUp = require('read-pkg-up');

var pkg = readPkgUp.sync().pkg;

var prechecks = new Listr([{
  title: 'Checking NEXT_VERSION is set',
  task: function task() {
    if (!process.env.NEXT_VERSION) {
      throw new Error('Need to pass version as NEXT_VERSION=x.y.z');
    }
  }
}, {
  title: 'Validate version',
  task: function task() {
    if (!semver.valid(process.env.NEXT_VERSION)) {
      throw new Error('Version should be a valid semver version.');
    }

    if (semver.gte(pkg.version, process.env.NEXT_VERSION)) {
      throw new Error('New version `' + process.env.NEXT_VERSION + '` should be higher than current version `' + pkg.version + '`');
    }
  }
}, {
  title: 'Check npm version',
  skip: function skip() {
    return semver.lt(process.version, '6.0.0');
  },
  task: function task() {
    return execa.stdout('npm', ['version', '--json']).then(function (json) {
      var versions = JSON.parse(json);
      if (!semver.satisfies(versions.npm, '>=2.15.8 <3.0.0 || >=3.10.1')) {
        throw new Error('npm@' + versions.npm + ' has known issues publishing when running Node.js 6. Please upgrade npm or downgrade Node and publish again. https://github.com/npm/npm/issues/5082');
      }
    });
  }
}, {
  title: 'Check git tag existence',
  task: function task() {
    return execa('git', ['fetch']).then(function () {
      return execa.stdout('git', ['rev-parse', '--quiet', '--verify', 'refs/tags/v' + process.env.NEXT_VERSION]);
    }).then(function (output) {
      if (output) {
        throw new Error('Git tag `v' + process.env.NEXT_VERSION + '` already exists.');
      }
    }, function (err) {
      // Command fails with code 1 and no output if the tag does not exist, even though `--quiet` is provided
      // https://github.com/sindresorhus/np/pull/73#discussion_r72385685
      if (err.stdout !== '' || err.stderr !== '') {
        throw err;
      }
    });
  }
}]);

var gitchecks = new Listr([{
  title: 'Check current branch',
  skip: function skip() {
    return process.env.ANY_BRANCH === '1';
  },
  task: function task() {
    return execa.stdout('git', ['symbolic-ref', '--short', 'HEAD']).then(function (branch) {
      if (!branch.startsWith('release') && !branch.startsWith('hotfix')) {
        throw new Error('Not on a `release` or `hotfix` branch. Use ANY_BRANCH to publish anyway.');
      }
    });
  }
}, {
  title: 'Check local working tree',
  task: function task() {
    return execa.stdout('git', ['status', '--porcelain']).then(function (status) {
      if (status !== '') {
        throw new Error('Unclean working tree. Commit or stash changes first.');
      }
    });
  }
}, {
  title: 'Check remote history',
  task: function task() {
    return execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(function (result) {
      if (result !== '0') {
        throw new Error('Remote history differ. Please pull changes.');
      }
    });
  }
}]);

var tasks = new Listr([{
  title: 'Prerequisite check',
  task: function task() {
    return new Listr([{
      title: 'Version checks',
      task: function task() {
        return prechecks;
      }
    }, {
      title: 'Git checks',
      task: function task() {
        return gitchecks;
      }
    }]);
  }
}, {
  title: 'Bump Package Version',
  task: function task() {
    return execa('npm', ['--no-git-tag-version', 'version', process.env.NEXT_VERSION, '--force']);
  }
}, {
  title: 'Generating Changelog',
  task: function task() {
    return require('./changelog');
  }
}, {
  title: 'Git Commit Release',
  task: function task() {
    return execa('git', ['commit', '-a', '-m', process.env.NEXT_VERSION]);
  }
}, {
  title: 'Git Tag Release',
  task: function task() {
    return execa('git', ['tag', process.env.NEXT_VERSION, '-m', process.env.NEXT_VERSION]);
  }
}]);

tasks.run().catch(function (err) {
  console.error(err.message);
});