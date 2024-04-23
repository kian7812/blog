# 性能分析

## Long Task 长任务（性能分析切入口）

简单翻译一下上文的内容。我们知道，主线程一次只能处理一个任务（任务按照队列执行）。当任务超过某个确定的点时，准确的说是50毫秒，就会被称为长任务(Long Task)。当长任务在执行时，如果用户想要尝试与页面交互或者一个重要的渲染更新需要重新发生，那么浏览器会等到Long Task执行完之后，才会处理它们。结果就会导致交互和渲染的延迟

从以上信息可以得知，如果存在Long Task，那么对于我们Load（加载时）和Runtime（运行时）的性能都有影响

所以我们需要避免Long Task

但是在写代码的时候，我们会不经意的写出了Long Task的代码

一般情况下我们都会保证函数的「单一职责」原则。就是一个函数只做一件事情，这样是最好的

比如说下面这个代码

```js
function a() {
  for (let i = 1; i < 1000000000; i++) {}
  console.log('a');
}

function b() {
  for (let i = 1; i < 1000000; i++) {}
  console.log('b');
}

function c() {
  for (let i = 1; i < 100000000; i++) {}
  console.log('c');
}

function init() {
  a();
  b();
  c();
}

init();
```

但是，函数确实「单一职责」了，但是一不小心会引起了另外一个问题， Long Task

那假如我们做个优化把一个Long Task划分成多个Task后，是怎样的呢

那就意味着，Long Task被分解了，一些高优先级的任务可以得到响应----包括我们的用户交互行为

那解决Long Task的方式有如下几种：
* 使用setTimeout分割任务
* 封装一个函数setZeroTimeout，与setTimeout不同的是，该函数的执行时机不会被延迟
* 使用web worker，处理逻辑复杂的计算
* 使用async/await分割任务
* 使用requestIdleCallback分割任务，但是注意。如果主线程长期拥塞，那么回调函数将无法执行
* 避免强制同步布局
* 避免非必要逻辑的渲染