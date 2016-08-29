'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var execa = require('execa');
var Listr = require('listr');
var fs = require('graceful-fs');
var readPkgUp = require('read-pkg-up');
var dateFormat = require('dateformat');

var pkg = readPkgUp.sync().pkg;

var FROM_TAG = process.env.FROM_TAG;
var TO_TAG = process.env.TO_TAG || 'HEAD';
var LINES = void 0;
var PRS = void 0;
var LOGS = void 0;

var formatLines = function formatLines(line, matchedPr) {
  var ls = [];
  var tickets = line.tickets.split(',').map(function (t) {
    return '[' + t + '](' + process.env.JIRA_URL + '/' + t + ')';
  });
  ls.push('- [' + tickets + '] ' + line.title);
  ls.push('([' + line.short + '](https://github.com/' + process.env.GIT_REPO + '/commit/' + line.commit + '))');
  if (matchedPr) {
    ls.push('[#' + matchedPr.number + '](' + matchedPr.url + ')');
  }
  return ls.join(' ');
};

var changelog = new Listr([{
  title: 'Gathering required info',
  task: function task() {
    return new Listr([{
      title: 'Finding local changes',
      task: function task() {
        return new Listr([{
          title: 'Finding latest tag',
          skip: function skip() {
            return FROM_TAG;
          },
          task: function task() {
            return execa.stdout('git', ['describe', '--abbrev=0', '--tags']).then(function (tag) {
              FROM_TAG = tag;
            });
          }
        }, {
          title: 'Finding commits',
          task: function task() {
            return execa.stdout('git', ['log', '--pretty=format:%s__SPLIT__%H__SPLIT__%h', TO_TAG + '...' + FROM_TAG]).then(function (ls) {
              LINES = ls.split('\n');
            });
          }
        }]);
      }
    }, {
      title: 'Fetching Pull Requests',
      task: function task() {
        return execa.stdout('curl', ['https://api.github.com/repos/' + process.env.GIT_REPO + '/pulls?sort=updated&direction=desc&state=closed']).then(function (prs) {
          PRS = JSON.parse(prs).filter(function (pr) {
            return pr.merged_at;
          }).map(function (p) {
            return {
              url: p.html_url,
              number: p.number,
              mergeCommitSha: p.merge_commit_sha
            };
          });
        });
      }
    }], { concurrent: true });
  }
}, {
  title: 'Generating commit log',
  task: function task() {
    LOGS = LINES.reduce(function (acc, l) {
      var _l$split = l.split('__SPLIT__');

      var _l$split2 = _slicedToArray(_l$split, 3);

      var tickettitle = _l$split2[0];
      var commit = _l$split2[1];
      var short = _l$split2[2];

      var match = tickettitle.match(/^\[(.*)\] (.*)$/);
      if (!match) return acc;

      var _match = _slicedToArray(match, 3);

      var _ = _match[0];
      var tickets = _match[1];
      var title = _match[2];

      var line = {
        title: title,
        tickets: tickets,
        commit: commit,
        short: short
      };

      var matchedPr = PRS.find(function (pr) {
        return pr.mergeCommitSha === line.commit;
      });
      return [].concat(_toConsumableArray(acc), [formatLines(line, matchedPr)]);
    }, []).join('\n');
  }
}, {
  title: 'Appending new changes',
  task: function task() {
    var CL = 'CHANGELOG.md';
    fs.readFile(CL, function (err, data) {
      if (err) throw err;
      var nextChangelog = '## ' + pkg.version + ' (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n' + LOGS + '\n\n' + data;

      fs.writeFile(CL, nextChangelog, function (e) {
        if (e) throw e;
      });
    });
  }
}]);

module.exports = changelog;