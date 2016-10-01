const execa = require('execa');
const Listr = require('listr');

const tasks = new Listr([
  {
    title: 'Git Commit Release',
    task: () => execa('git', ['commit', '-a', '-m', `v${process.env.NEXT_VERSION}`]),
  },
  {
    title: 'Git Tag Release',
    task: () => execa('git', ['tag', process.env.NEXT_VERSION, '-sm', process.env.NEXT_VERSION]),
  },
  {
    title: 'Pushing tags',
    task: () => execa('git', ['push', '--follow-tags']),
  },
]);

module.exports = tasks;

if (!process.env.RELEASE) {
  tasks.run().catch(err => {
    console.error(err.message);
  });
}
