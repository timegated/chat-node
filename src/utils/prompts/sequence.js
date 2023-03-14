// I would like a function here that runs and completes tasks in sequence. We'll be working with a series of asynchronous calls
// Where the next starts after the previous one completes. Could use a Promise Chain

const tasks = ['INIT', 'TASK', 'FINISHED'];


// Simulate async calls to third-party
// const prom1 = new Promise((resolve) => {
//     setTimeout(() => resolve(console.log('prom1 finished')), 2000);
// });
// const prom2 = new Promise((resolve) => {
//     setTimeout(() => resolve(console.log('prom2 finished')), 5000);
// });
// const prom3 = new Promise((resolve) => {
//     setTimeout(() => resolve(console.log('prom3 finished')), 8000);
// });


const taskInSequence = async (tasks) => {
  for (let taskName of tasks) {
    switch(taskName) {
      case 'INIT':
        return await prom1; // return output
      case 'TASK':
        return await prom2; // use output from prom1
      case 'FINISHED':
        return await prom3; // use output from prom2 -- returns final output
      default:
        return 'all done';
    }
  }
};

// console.log(taskInSequence(tasks));


const classSelector = (promptText) => `that grabs textContent from any class with name ${promptText}`;
const idSelector = (promptText) => `that grabs textContent form any id with name ${promptText}`;
const attrSelector = (promptText) => `that grabs textContent from any attribute with name ${promptText}`;

const callMap = new Map([['id', idSelector], ['class', classSelector], ['attr', attrSelector]]);

const template = (fn) => {
  console.log(fn);
  return `${fn('id name')}`
}

console.log(template(callMap.get('id')));
// export {
//   tasks,
//   taskInSequence
// }