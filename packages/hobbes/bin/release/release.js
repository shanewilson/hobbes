const execa = require('execa');
const Listr = require('listr');

const tasks = new Listr([
  {
    title: 'Preflight',
    task: () => require('./preflight'),
  },
  {
    title: 'Version',
    task: () => require('./version'),
  },
  {
    title: 'Changelog',
    task: () => require('./changelog'),
  },
  {
    title: 'Publish',
    task: () => require('./publish'),
  },
]);

tasks.run().catch(err => {
  console.error(err.message);
});
