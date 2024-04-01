# Promise 实现

## promise 实现

用 promise 写的话，实例代码就应该是下面这样：

```js
const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler.add(() => timeout(time).then(() => console.log(order)));
};

addTask(5000, "1");
addTask(3000, "2");
addTask(1000, "3");
addTask(2000, "4");
```

需要注意的是使用 promise 实现的话也是离不开循环 .then 的，所以我们抽出一个函数来实现 then 的链式调用。

需要一个函数来实现 add 记录要执行的 promiseCreator ，还需要一个函数在执行的时候就去第一个就可以了。

要求只有一个 add 函数，所以我们需要在 add 里记录 promiseCreator 以及执行 run 。

run 来触发异步函数的执行，这里的触发有两处，一处为 add 一个 promise 就 run ，另一个是自己执行完一个再 then 里执行 run ，当大于 max 时阻止继续 run 。

这里如果想不明白的话，可以换一个生活里的场景。比如吃火锅，我喜欢吃虾滑，虾滑一个个下锅，煮熟就把它放到碗里，可碗就那么大只能放两个虾滑，吃一个才能从锅里取一个，直到锅里没有虾滑了。相信有了上述的这个场景，你能写出不一样的题解，这是我实现的既符合题意又相对简洁的 promise 实现：

```js
class Scheduler {
  constructor() {
    this.taskList = [];
    this.maxNum = 2;
    this.count = 0;
  }

  add(promiseCreator) {
    this.taskList.push(promiseCreator);
    this.run();
  }

  run() {
    if (this.count >= this.maxNum || this.taskList.length == 0) return;

    this.count++;
    this.taskList
      .shift()()
      .then(() => {
        this.count--;
        this.run();
      });
  }
}
```

## async 实现

最简单地写法还得是 async （这里换了一种写法，你也可以用类实现），然后帮助理解如果没有 start 函数，怎么直接在 add 函数中实现逻辑：

用一个 count 记录并发的数量，用一个 taskList 数组保存任务。
异步函数 add 接受异步任务返回 promise 。
这里没有递归调用， add 一个异步任务，就执行，并用 count 记录并发数量。
关键思想：当并发数超过限制，我们 await 一个不被 resolve 的 promise ，当完成了一个请求有位置了，才 resolve。

```js
function scheduler(maxNum) {
  const taskList = [];
  let count = 0;

  return async function add(promiseCreator) {
    if (count >= maxNum) {
      await new Promise((resolve, reject) => {
        taskList.push(resolve);
      });
    }
    count++;
    const res = await promiseCreator();
    count--;
    if (taskList.length > 0) taskList.shift()();

    return res;
  };
}
```