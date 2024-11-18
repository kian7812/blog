# Fiber 架构

## 每次setSate的任务开始都是从root遍历
https://x.com/dan_abramov2/status/1793652205859594543

to give another example, whenever you setState in React, it still traverses from the root (“skipping over” the parents above the setState). but imo it would be ridiculous to argue that this means they “execute”. nah, it’s just an implementation detail of how the code gets skipped
再举个例子，每当你在 React 中 setState 时，它​​仍然从根开始遍历（“跳过”setState 之上的父级）。但在我看来，认为这意味着他们“执行”是荒谬的。不，这只是代码如何被跳过的实现细节


## 为什么react每次改变一个节点的值都要重新生成一个完整的虚拟dom树？

https://segmentfault.com/q/1010000041065111

从触发setState节点开始，先往上找到root最顶层根元素，然后往下根据已存在属性拷贝一份新的fiber，直到触发setState节点，再往下遍历调用子元素render，中间可以根据shouldComponentUpdate等方法跳过。

多了一个往上找直到root开始遍历（因为是fiber链表结构没有层级概念，依然用树的那一套就会导致渲染重复），并且父、祖父元素都拷贝一份新fiber的步骤

React自从16.8开始使用了 fiber 架构

fiber使用了链表结构串联来虚拟dom树，主要的三个参数：child（子）、sibling（下一个兄弟）、return（父）

![fiber1](/assets/images/fiber1.webp)

fiber遍历过程就是找第一个元素一直找到底，然后找兄弟，没兄弟了往上

这个阶段分为两块，往下的过程是一些调用render或者克隆一个fiber节点的操作，往上的过程是生成effect和updateQueue更新内容的操作

假如在Text2内触发setState：

![fiber2](/assets/images/fiber2.webp)

给Text2标记更新字段lanes: 1，并一直往上找，找到root，并给沿途所以父节点设置childLanes: 1，然后从root根节点开始遍历

- 当遍历到 lanes: 0 的时候：
  - childLanes: 0 **表示子孙元素没有变动直接跳过**，也等于跳过了diff
  - childLanes: 1 就只是从之前的fiber克隆一个新的fiber节点
- 当遍历到 lanes: 1的时候
  - 如果shouldComponentUpdate或类似的操作不更新，则走到上面lanes: 0的流程
  - 调用render生成新的fiber

当到达最底部没有子元素的时候，开始compile生成updateQueue节点然后重复上面步骤（叶子节点为没有子元素的节点）叶子节点->兄弟->父->子->叶子，最终回到root结束

![fiber3](/assets/images/fiber3.webp)

然后commit阶段，这时候有个Effect链表（Effect链表只有变动的节点），遍历Effect拿到节点的updateQueue更新了哪些内容，将updateQueue渲染到dom上

### Lishion

最近也在看 react fiber 相关的代码，我从一开始也有这个疑问。
实际上 react 的做法如 @李十三 所说，大概是:

1. 从 setState 往上回溯直到 root，目的是把当前的优先级标准到父节点上
2. 从 root 往下遍历，判断：
    - properties 发生改变，需要更新，继续遍历
    - properties 未发生改变，优先级满足，说明 state 发生改变，需要更新(还要考虑 shouldUpdate 方法，如果返回 false 也不需要遍历)，继续遍历
    - properties 未发生改变，当前节点优先级不满足，但是子节点优先级满足，需要更新子节点，继续遍历
    - 不符合以上几种情况，不需要往下遍历

为什么不直接从 setState 节点开始更新，是因为 react 存放任务优先级的机制。每次 set 之后会生成一个新任务。react 会根据当前任务情况（未完成的任务，上次被打断的任务等）计算一个更新优先级，如果当然任务的优先级等于这个更新优先级，就不会新启动一个任务，而是复用之前的任务。也就是说一个任务中，存的更新可能不只是当前组件的 setState 引起的，还可能包括其他组件。因此不能直接从某个 setState 的组件开始更新，而是要从 root 开始遍历。

### tk123

最近在看 react 18.1 的源码 也有类似的问题，我认为可能是这样的
虽然触发的是fiber tree 的内部的某个 component 的 state hook，但是 react 会回溯到顶层root，但是会向上冒泡 childLines ，同时设置当前触发了 state hook 的fiber lane = 1，
在下一次更新任务的时候，就是从root 开始的。这里有一个比较重要的比较点，react 会比较 props 和memoProps 是否相等如果是相同的 会执行 bailout 操作，只会单纯的clone current fiber 的数据，这里的操作其实并不多，对于这种bailout的fiber 他的 所有child 都会做bailout操作，如果不是在 触发了 state hook 的那个分支的 tree上面。这应该是基于 react 双缓存的先决条件来做的，保证work的fiber 和 current 的fiber 数据的独立性。

但是，还是有一个问题，如果到达了触发 state 的 fiber那里，这个fiber 的子集child 就不能到bailout这个逻辑了，因为这个时候 clone children的时候会从 element.props 设置fiber 的props，导致 在和 memoProps 比较的时候 永远不会相等，这里感觉react 执行了很多的无用代码，导致整个子 tree 都需要走一遍 component （组件）的逻辑。而上面的遍历因为有bailout的操作其实用不了多久时间，但是走 component的逻辑就很花时间。


## 

小知识块：https://juejin.cn/post/7168257213738254344