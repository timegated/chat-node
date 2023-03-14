// I would like a function here that runs and completes tasks in sequence. We'll be working with a series of asynchronous calls
// Where the next starts after the previous one completes. Could use a Promise Chain

enum TaskSequence {
  'INIT',
  'TASK',
  'FINISHED'
}


const tasks: string[] = ['INIT', 'TASK', 'FINISHED'];


// Simulate async calls to third-party
const prom1 = new Promise((resolve: any) => {
    setTimeout(() => resolve('task finished'), 2000);
});
const prom2 = new Promise((resolve: any) => {
    setTimeout(() => resolve('task finished'), 3000);
});
const prom3 = new Promise((resolve: any) => {
    setTimeout(() => resolve('task finished'), 4000);
});


const taskInSequence = (task: string) => {
  switch(task) {
    case 'INIT':
      return prom1; // return output
    case 'TASK':
      return prom2; // use output from prom1
    case 'FINISHED':
      return prom3; // use output from prom2 -- returns final output
    default:
      return 'default';
  }
};

console.log(taskInSequence(tasks[0]));

export {
  tasks,
  taskInSequence
}