const execa = require('execa');
const Listr = require('listr');

const tasks = new Listr([
  {
    title: 'Publishing packages to NPM',
    task: () => execa('lerna', ['run', 'publish']),
  },
]);

tasks.run().catch(err => {
  console.error(err.message);
});
