# React性能优化


## *一句话解释了为什么和如何使用useCallback, useMemo、React.memo优化

1. **表格组件render次数确实不止一次，解决办法也很简单，由于是react框架，只需要保证传给表格组件的参数prop不变就可以了，这种问题其实一般出现在prop有参数是引用类型时候，比如函数啊，对象啊之类的。一套useCallback, useMemo、React.memo之类的下来就可以了**。https://juejin.cn/post/7240297635428565050

（React框架，每次渲染引用类型变量都会重新创建，重新赋值就是引起re-render，这种其实是没必要的。）


2. 来自vue文档

在默认情况下，*传递给子组件的事件处理函数会导致子组件进行不必要的更新*。*子组件默认更新，并需要显式的调用 useCallback 作优化*。这个优化同样需要正确的依赖数组，并且几乎在任何时候都需要。忽视这一点会导致默认情况下对应用进行过度渲染，并可能在不知不觉中导致性能问题。https://cn.vuejs.org/guide/extras/composition-api-faq.html

## 导航1

https://www.youtube.com/watch?v=hZr4J42JDoc（流程不错的）

## 深入响应式系统

https://cn.vuejs.org/guide/extras/reactivity-in-depth.html#what-is-reactivity

不可变数据​

如果你正在实现一个撤销/重做的功能，你可能想要对用户编辑时应用的状态进行快照记录。然而，*如果状态树很大的话，Vue 的可变响应性系统没法很好地处理这种情况，因为在每次更新时都序列化整个状态对象对 CPU 和内存开销来说都是非常昂贵的*。

*不可变数据结构*通过永不更改状态对象来`解决这个问题`。与 Vue 不同的是，它会创建一个新对象，保留旧的对象未发生改变的一部分。在 JavaScript 中有多种不同的方式来使用不可变数据，但我们推荐使用 Immer 搭配 Vue，因为它使你可以在保持原有直观、可变的语法的同时，使用不可变数据。

