const execa = require('execa');
const Listr = require('listr');
const readPkgUp = require('read-pkg-up');

execa.stdout('git', ['describe', '--abbrev=0', '--tags']).then(tag => {
  console.log(tag);
  return execa.stdout('git', ['log', '--pretty=format:%s (%h)', `HEAD...${tag}`]).then(lines => {
    const log = lines.split('\n').map(l => {
      return l.replace(/(\[.+\])(.+)(\(.+\))/, "[<a href=''>$1</a>] $2 (<a href=''>$3</a>)");
    });
    console.log(log);
  });
});
