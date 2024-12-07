# nextTick(2/3)

*Vue3其实也差不多这个思路*。

tick代表一个任务，task，从浏览器角度performance里就能理解，下个任务包含：都是callbacks，又包括watcher执行：组件re-render、计算属性、用户watcher计算等（看👇🏻派发更新）

## * 派发更新（👍🏻）
  1. **Dep.notify()**
  2. **watcher.update()**
  3. **queenWatcher()**
  4. **nextTick**（这之后的在同一个tick里执行即nextTick方法里）
  5. **flushScheduleQueue**
  6. **watcher.run()**
  7. **updateComponent()**


## 为什么Vue采用异步渲染？
我们先来想一个问题：如果Vue不采用异步更新，那么每次数据更新时是不是都会对当前组件进行重写渲染呢？
答案是肯定的，为了性能考虑，会在本轮数据更新后，再去异步更新视图。

## 异步批量渲染/更新DOM
分为两步：
1、批量渲染（收集和执行渲染），通过scheduler.js完成。
2、派发异步任务，通过nextTick完成（Watcher.run）。

## 异步渲染、批量渲染超级简单过程：
1、update执行queueWatcher，收集watchers到队列queue，之后通过flushSchedulerQueue执行收集的队列watcher-queue，就是批量执行watcher.run()进行批量渲染。// scheduler.js
2、通过nextTick派发这个批量flushSchedulerQueue任务。 // next-tick.js


## 异步更新队列（综合描述）
https://cn.vuejs.org/v2/guide/reactivity.html

Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。
然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。

## Vue异步更新的流程：（源码+描述）
第一步调用dep.notify()通知watcher进行更新操作。
第二步其实就是在第一步的notify方法中，遍历subs，执行subs[i].update()方法，也就是依次调用watcher的update方法。
第三步是执行update函数中的queueWatcher方法。
第四步就是执行nextTick(flushSchedulerQueue)方法，在下一个tick中刷新watcher队列。

补充1：下一个tick中刷新watcher队列 的意思：
一个tick，可以理解为事件任务timerFunc。
执行nextTick()，如果没有任务在队列中等待执行，就直接派发渲染任务。
如果有任务在等待执行，就得在下一个tick(任务)中执行回调渲染方法。

## Vue 的 nextTick 主要是用来：批量派发异步任务的，
异步任务包括：批量渲染任务（flushSchedulerQueue）；和用户Vue.nextTick()




## Vue.nextTick = nextTick
nextTick 和 异步渲染的nextTick 是同一个

import {nextTick} from '../util/index'

##  nextTick

nextTick 中的回调是在下次 DOM 更新循环结束之后执行的延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。主要思路就是采用微任务优先的方式调用异步方法去执行 nextTick 包装的方法

```js

let callbacks = [];
let pending = false;
function flushCallbacks() {
  pending = false; //把标志还原为false
  // 依次执行回调
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]();
  }
}
let timerFunc; //定义异步方法  采用优雅降级
if (typeof Promise !== "undefined") {
  // 如果支持promise
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
  };
} else if (typeof MutationObserver !== "undefined") {
  // MutationObserver 主要是监听dom变化 也是一个异步方法
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== "undefined") {
  // 如果前面都不支持 判断setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // 最后降级采用setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

export function nextTick(cb) {
  // 除了渲染watcher  还有用户自己手动调用的nextTick 一起被收集到数组
  callbacks.push(cb);
  if (!pending) {
    // 如果多次调用nextTick  只会执行一次异步 等异步队列清空之后再把标志变为false
    pending = true;
    timerFunc();
  }
}

```

## nextTick是做什么⽤的，其原理是什么?（👍🏻）

能回答清楚这道问题的前提，是清楚 EventLoop 过程。

作用* 在下次 DOM 更新循环结束后执⾏延迟回调，在修改数据之后⽴即使⽤ nextTick 来获取更新后的DOM。

原理* nextTick 对于 micro task 的实现，会先检测是否⽀持 Promise ，不⽀持的话，直接指向 macrotask，⽽ macro task 的实现，优先检测是否⽀持 setImmediate （⾼版本IE和Etage⽀持），不⽀持的再去检测是否⽀持 MessageChannel，如果仍不⽀持，最终降级为 setTimeout 0；
* 默认的情况，会先以 micro task ⽅式执⾏，因为 micro task 可以在⼀次 tick 中全部执⾏完毕，在⼀些有重绘和动画的场景有更好的性能。
* 但是由于 micro task 优先级较⾼，在某些情况下，可能会在事件冒泡过程中触发，导致⼀些问题，所以有些地⽅会强制使⽤ macro task （如 v-on ）。

注意：之所以将 nextTick 的回调函数放⼊到数组中⼀次性执⾏，⽽不是直接在 nextTick 中执⾏回调函数，是为了保证在同⼀个tick内多次执⾏了 nextTcik ，不会开启多个异步任务，⽽是把这些异步任务都压成⼀个同步任务，在下⼀个tick内执⾏完毕。

注意：
- dom更新和nextTick执行(如果是micro-task实现)，是在同一个tick中进行的。
- 下一次的意思，数据变化后，re-render是异步的，re-render是下一次任务重进行的。
- DOM 渲染既然在微任务之后，为什么在微任务中，可以拿到渲染后的 DOM 呢，
  - **微任务中获得的dom对象已经是更新过后的，只是还没渲染**。

## 参考

https://juejin.cn/post/6844903843197616136

- 并没有明确用户的nextTick(callback)，与 nextTick(flushSchedulerQueue) 先后顺序，或者自己没看到，先不找了。
- 是不是user-nextTick会被特定安排呢
- https://juejin.cn/post/6844903843197616136
- https://github.com/vuejs/vue/blob/dev/src/core/observer/scheduler.js
- https://ustbhuangyi.github.io/vue-analysis/v2/reactive/next-tick.html