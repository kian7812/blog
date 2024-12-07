# Vue2批量异步更新与nextTick原理*

SHERlocked93：https://juejin.cn/post/6844903640910544903

（以下是部分内容，重点解释user-nextTick、watcher-nextTick执行顺序）
（当然其它，传统nextTick内容也非常棒，有时间挪上来）

## 一个例子

```html
<div id="app">
  <span id='name' ref='name'>{{ name }}</span>
  <button @click='change'>change name</button>
  <div id='content'></div>
</div>
<script>
  new Vue({
    el: '#app',
    data() {
      return {
        name: 'SHERlocked93'
      }
    },
    methods: {
      change() {
        const $name = this.$refs.name
        this.$nextTick(() => console.log('setter前：' + $name.innerHTML))
        this.name = ' name改喽 '
        console.log('同步方式：' + this.$refs.name.innerHTML)
        setTimeout(() => this.console("setTimeout方式：" + this.$refs.name.innerHTML))
        this.$nextTick(() => console.log('setter后：' + $name.innerHTML))
        this.$nextTick().then(() => console.log('Promise方式：' + $name.innerHTML))
      }
    }
  })
</script>
```
执行结果：
```
同步方式：SHERlocked93 
setter前：SHERlocked93 
setter后：name改喽 
Promise方式：name改喽 
setTimeout方式：name改喽
```

为什么是这样的结果呢，解释一下：

1. 同步方式： 当把data中的name修改之后，此时会触发name的 setter 中的 dep.notify 通知依赖本data的render watcher去 update，update 会把 flushSchedulerQueue 函数传递给 nextTick，render watcher在 flushSchedulerQueue 函数运行时 watcher.run 再走 diff -> patch 那一套重渲染 re-render 视图，这个过程中会重新依赖收集，这个过程是异步的；所以当我们直接修改了name之后打印，这时异步的改动还没有被 patch 到视图上，所以获取视图上的DOM元素还是原来的内容。
2. setter前： setter前为什么还打印原来的是原来内容呢，是因为 nextTick 在被调用的时候把回调挨个push进callbacks数组，之后执行的时候也是 for 循环出来挨个执行，所以是类似于队列这样一个概念，先入先出；在修改name之后，触发把render watcher填入 schedulerQueue 队列并把他的执行函数 flushSchedulerQueue 传递给 nextTick ，此时callbacks队列中已经有了 setter前函数 了，`因为这个 cb 是在 setter前函数 之后被push进callbacks队列的，那么先入先出的执行callbacks中回调的时候先执行 setter前函数，这时并未执行render watcher的 watcher.run，所以打印DOM元素仍然是原来的内容`。
3. setter后： setter后这时已经执行完 flushSchedulerQueue，这时render watcher已经把改动 patch 到视图上，所以此时获取DOM是改过之后的内容。
Promise方式： 相当于 Promise.then 的方式执行这个函数，此时DOM已经更改。
setTimeout方式： 最后执行macro task的任务，此时DOM已经更改。

注意，在执行 setter前函数 这个异步任务之前，`同步的代码已经执行完毕，异步的任务都还未执行`，所有的 $nextTick 函数也执行完毕，所有回调都被push进了callbacks队列中等待执行，所以在setter前函数 执行的时候，`此时callbacks队列是这样的：[setter前函数，flushSchedulerQueue，setter后函数，Promise方式函数]，它是一个micro task队列`，执行完毕之后执行macro task setTimeout，所以打印出上面的结果。

另外，如果浏览器的宏任务队列里面有setImmediate、MessageChannel、setTimeout/setInterval 各种类型的任务，那么会按照上面的顺序挨个按照添加进event loop中的顺序执行，所以如果浏览器支持MessageChannel， nextTick 执行的是 macroTimerFunc，那么如果 macrotask queue 中同时有 nextTick 添加的任务和用户自己添加的 setTimeout 类型的任务，会优先执行 nextTick 中的任务，因为MessageChannel 的优先级比 setTimeout的高，setImmediate 同理。

## 备注：

- `this.name = 'name改喽'` 触发的Vue的setter等等都是同步的，包括nextTick(flushSchedulerQueue)等等推入到nextTick的callbacks队列。直到异步任务执行flushCallbacks。
- flushCallbacks里包含里异步渲染，渲染watcher.run()等等。
- 所以$nextTick(cb)能否获取到想要的dom，要看这个cb在nextTick(flushSchedulerQueue)前还是后，正常如果在`this.name = `后的$nextTick(cb)获取更新后的dom是可以拿到的。
- 当然user-nextTick、watcher-nextTick是在同一个callbacks队列里的。


## 参考

- 直接看文章里的参考就行