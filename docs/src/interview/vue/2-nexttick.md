

# 

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

## * set: 派发更新
  * Dep.notify()
  * watcher.update()
  * queenWatcher()
  * nextTick
  * flushScheduleQueue
  * watcher.run()
  * updateComponent()


## Vue.nextTick = nextTick
nextTick 和 异步渲染的nextTick 是同一个

import {nextTick} from '../util/index'

## 参考

https://juejin.cn/post/6844903843197616136

- 并没有明确用户的nextTick(callback)，与 nextTick(flushSchedulerQueue) 先后顺序，或者自己没看到，先不找了。
- 是不是user-nextTick会被特定安排呢
- https://juejin.cn/post/6844903843197616136
- https://github.com/vuejs/vue/blob/dev/src/core/observer/scheduler.js
- https://ustbhuangyi.github.io/vue-analysis/v2/reactive/next-tick.html