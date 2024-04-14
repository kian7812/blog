
# Diff

## 虚拟 DOM 的工作原理

这个问题可能就会让你摸不着头脑，要讲清一个技术的原理，我们只要从三大方面着手就行，是什么、为什么、怎么做。这个问题可能不会问的这么泛，可能会问更细一点，比如：什么是虚拟DOM，他有什么优缺点，如何实现虚拟DOM。
什么是虚拟 DOM

虚拟 DOM 实际上它只是一层对真实 DOM 的抽象，以 JavaScript 对象 (VNode 节点) 作为基础的树，用对象的属性来描述节点，最终可以通过一系列操作使这棵树映射到真实环境上。

虚拟 DOM 优缺点

优点：改善大规模 DOM 操作的性能、规避 XSS 风险、能以较低的成本实现跨平台开发。

缺点：内存占用较高，因为需要模拟整个网页的真实 DOM。高性能应用场景存在难以优化的情况，类似像 Google Earth 一类的高性能前端应用在技术选型上往往不会选择 React。

如何实现虚拟 DOM

1、h 函数，用 JS 对象模拟 DOM 树

2、render 函数，实现渲染，从 Virtual DOM 映射到真实 DOM

3、mount 函数，实现挂载

4、diff 算法:比较两棵虚拟 DOM 树的差异

## 虚拟 DOM✅

https://juejin.cn/post/7338617055149883419

1.VDom是什么？

虚拟 DOM 的概念：

- 轻量级的 JavaScript 对象：虚拟 DOM 是真实 DOM 的一种抽象，它是由普通的 JavaScript 对象组成的树结构。每个 JavaScript 对象都对应着真实 DOM 树中的一个节点。
- 同步与真实 DOM 的变化：在 React 应用中，每当组件的状态变化时，React 会先在虚拟 DOM 上进行相应的更新。这意味着每次状态变化并不会直接引起真实 DOM 的更新。

2.为什么要用虚拟dom？

- 性能提升： 保证性能下限，在不进行手动优化的情况下，提供过得去的性能。操作真实 DOM 是昂贵的（性能开销较大），因为它会导致浏览器的重绘和重排。虚拟 DOM 允许 React 在内存中进行所有的计算，减少了直接操作真实 DOM 的次数，从而提升性能。
- 跨平台： 虚拟 DOM 是平台无关的，这意味着相同的组件可以在不同的环境中渲染，如浏览器、服务器（SSR）或原生应用（React Native）。

3.虚拟 DOM 的引入与直接操作原生 DOM 相比，哪一个效率更高，为什么？

在整个 DOM 操作的演化过程中，其实主要矛盾并不在于性能，而在于开发体验和开发效率。虚拟 DOM 并不一定会带来更好的性能，React 官方也从来没有把虚拟 DOM 作为性能层面的卖点对外输出过。虚拟 DOM 的优越之处在于，它能够在提供更爽、更高效的研发模式的同时，仍然保持一个还不错的性能。 

总结：

- 开发体验与效率：虚拟 DOM 主要提升了开发体验和效率。它允许开发者通过更声明式的编程方式来管理 UI，专注于数据和状态，而不是复杂的 DOM 操作。这种方法简化了代码，提高了可维护性和开发效率，特别是在构建大型和复杂的应用时。
- 性能的平衡和适用性：虚拟 DOM 在性能方面提供了一种平衡。它通过减少不必要的 DOM 操作和优化批量更新，避免了一些性能瓶颈。虽然在某些简单操作中，直接操作原生 DOM 可能更快，但在处理大量数据和复杂的 UI 更新时，虚拟 DOM 可以提供更稳定和预测性更强的性能。虚拟 DOM 的性能优势并非绝对，而是依赖于特定的应用场景和需求。
- React 官方的立场：React 官方从未声称虚拟 DOM 主要是为了性能优化。相反，React卖点强调的是组件化开发和声明式 UI，这提高了开发的灵活性和效率。



## React 的 diff 算法

diff 算法是一种对比两个树差异的一种算法，那在 React 里就是对比新旧树的差异了。那么我们可以说 React 中 Diff 算法的本质是：

对比 current Fiber

如果该 DOM 节点已在页面中，current Fiber 代表该 DOM 节点对应的 Fiber 节点。

和 JSX 对象

即 ClassComponent 的 render 方法的返回结果，或 FunctionComponent 的调用结果。JSX 对象中包含描述 DOM 节点的信息。

并且生成 workInProgress Fiber。

如果该 DOM 节点将在本次更新中渲染到页面中，workInProgress Fiber 代表该 DOM 节点对应的 Fiber 节点。

React 对 diff 算法的优化，毕竟要完全对比两棵树的复杂度是很大的，所以 React 的 diff 算法预设了三个限制：

只对同级元素进行 Diff。如果一个 DOM 节点在前后两次更新中跨越了层级，那么 React 不会尝试复用他。

两个不同类型的元素会产生出不同的树。如果元素由 div 变为 p，React 会销毁 div 及其子孙节点，并新建 p 及其子孙节点。

开发者可以通过 key prop 来暗示哪些子元素在不同的渲染下能保持稳定。



## 聊一聊 diff 算法
https://zhuanlan.zhihu.com/p/304213203

传统 diff 算法的时间复杂度是 O(n^3)，这在前端 render 中是不可接受的。为了降低时间复杂度，react 的 diff 算法做了一些妥协，放弃了最优解，最终将时间复杂度降低到了 O(n)。

那么 react diff 算法做了哪些妥协呢？，参考如下：

1、tree diff：只对比同一层的 dom 节点，忽略 dom 节点的跨层级移动

如下图，react 只会对相同颜色方框内的 DOM 节点进行比较，即同一个父节点下的所有子节点。当发现节点不存在时，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。

这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。

这就意味着，如果 dom 节点发生了跨层级移动，react 会删除旧的节点，生成新的节点，而不会复用。

2、component diff：如果不是同一类型的组件，会删除旧的组件，创建新的组件

3、element diff：对于同一层级的一组子节点，需要通过唯一 id 进行来区分

如果没有 id 来进行区分，一旦有插入动作，会导致插入位置之后的列表全部重新渲染。

这也是为什么渲染列表时为什么要使用唯一的 key。


## 详细讲下比较阶段

https://juejin.cn/post/7329780589061095434

在 React 的更新过程中，“比较阶段”（通常被称为协调或 reconciliation 阶段）是一个关键步骤，React 框架会通过该阶段确定哪些部分的 UI 需要根据最新的状态变化来进行更新。这个过程涉及比较之前的渲染结果（旧的虚拟 DOM）与新的渲染结果（新的虚拟 DOM），从而生成一个最小化的更新指令集合来应用至真实 DOM。

**协调的目标**

协调的主要目标是在组件状态或属性（props）发生变化时，高效地更新 UI，同时尽量减少不必要的 DOM 更新，因为 DOM 操作通常是昂贵的。

**协调的步骤**

协调过程包括以下步骤：

1. 创建新的虚拟 DOM 树：当组件的状态或 props 发生变化时，React 会创建一棵新的虚拟 DOM 树。
2. 比较新旧虚拟 DOM 树：React 使用 diff 算法比较新旧虚拟 DOM 树中的元素。这个比较过程是递归的，从根组件开始，一直到所有子孙组件。
3. 确定更新的节点：在比较新旧虚拟 DOM 时，React 会识别哪些元素发生了变化。例如，如果一个组件的类型变了（从`<div>变成<span>`），或者 key 属性不同了，React 会摧毁旧组件并构建新组件。如果组件类型相同，React 会比较这个组件的 props，并确定需要更新哪些属性。
4. 标记需要更新的实际 DOM：React 为每个发生变化的虚拟 DOM 元素生成更新操作，并标记它们在实际 DOM 中对应的节点需要更新。

**优化措施**

在协调过程中，React 采取了一些优化措施：

- Keys：当渲染列表时，给每个列表项分配一个稳定的 key 可以帮助 React 更快地比较列表中的元素。这是因为 key 提供了元素在多次渲染间的持久标识。
- 类型检查：当元素类型（如`<div>、<span>`）发生变化时，React 会立即知道需要替换整个子树，而不需要进一步比较。
- 跳过不必要的比较：如果组件的 props 和 state 没有变化，React 可以跳过这个组件及其子组件的比较过程，这得益于PureComponent、React.memo或shouldComponentUpdate生命周期方法。

**结果应用**

协调结束后，React 会收集所有的更新，并在接下来的“提交阶段”中应用到实际 DOM 上。这个分离的过程允许 React 实现高效的更新，只对那些真正发生变化的部分进行操作，从而提高应用的性能。

协调阶段是 React 内部的实现细节，而作为开发者，我们通常不需要直接与之交互。理解这个过程有助于我们编写更高效的组件，例如，通过合理使用 keys、避免不必要的重渲染等。

### 实现一个简单版本的 diff 算法

React 的 diff 算法是一种高效的算法，用于比较两棵虚拟 DOM 树，找出它们之间的差异，然后将这些差异应用到实际的 DOM 上以更新 UI。React 的 diff 算法基于两个核心假设：不同类型的元素将产生不同的树结构，且开发者可以通过 key prop 来指示哪些子元素在不同的渲染中保持稳定。

下面是一个简化版的 diff 算法示例，它只处理了一些基本情况：

```js
function diff(oldVTree, newVTree) {
  // 存放差异的对象
  const patches = {};

  // 递归遍历树并记录差异
  walk(oldVTree, newVTree, patches, 0);

  return patches;
}

function walk(oldNode, newNode, patches, index) {
  // 单个元素的差异
  let patch = [];

  // 情况1: oldNode不存在
  if (!oldNode) {
    patch.push({ type: "INSERT", newNode });
  }
  // 情况2: 新旧节点类型不同，或者key不同
  else if (
    (newNode && oldNode.type !== newNode.type) ||
    oldNode.key !== newNode.key
  ) {
    patch.push({ type: "REPLACE", newNode });
  }
  // 情况3: 文本内容改变
  else if (
    typeof oldNode === "string" &&
    typeof newNode === "string" &&
    oldNode !== newNode
  ) {
    patch.push({ type: "TEXT", text: newNode });
  }
  // 情况4: 同类型、同key的节点进行属性对比
  else if (oldNode.type === newNode.type) {
    const propsPatches = diffProps(oldNode.props, newNode.props);
    if (propsPatches) {
      patch.push({ type: "PROPS", props: propsPatches });
    }

    // 递归比较子节点
    diffChildren(oldNode.children, newNode.children, patches, index);
  }

  // 如果有差异，则添加到 patches 对象中
  if (patch.length) {
    patches[index] = patch;
  }
}

function diffProps(oldProps, newProps) {
  let propPatches = {};
  let hasDiff = false;

  // 查找不同的属性
  for (let key in oldProps) {
    if (oldProps[key] !== newProps[key]) {
      propPatches[key] = newProps[key];
      hasDiff = true;
    }
  }

  // 查找新添加的属性
  for (let key in newProps) {
    if (!oldProps.hasOwnProperty(key)) {
      propPatches[key] = newProps[key];
      hasDiff = true;
    }
  }

  return hasDiff ? propPatches : null;
}

function diffChildren(oldChildren, newChildren, patches, index) {
  // 比较子节点时，应该保持对每个子节点的索引
  let currentIndex = index;
  for (let i = 0; i < oldChildren.length || i < newChildren.length; i++) {
    currentIndex +=
      (oldChildren[i] && oldChildren[i].children
        ? oldChildren[i].children.length
        : 0) + 1;
    walk(oldChildren[i], newChildren[i], patches, currentIndex);
  }
}

```

这个简单版本的 diff 算法实现了基本的比较逻辑，包括节点插入、替换和文本内容改变等操作。diffProps 函数用来对比节点属性的差异，而 diffChildren 函数用来递归对比子节点。

需要注意的是，这个简化版本的 diff 算法并不包含 React 实际使用的所有优化和特性。例如，它没有处理列表中元素排序和移动的情况，也没有实现复杂的 keys 处理逻辑，这些都是 React diff 算法的重要组成部分。此外，实际的算法还需要考虑各种边缘情况和性能优化策略。


## Diff 算法 ✅

https://juejin.cn/post/7338617055149883419

**1.Dom Diff是什么？**

React 在执行 render 过程中会产生新的虚拟 DOM, 在浏览器平台下, 为了尽量减少 DOM 的创建, React 会对新旧虚拟 DOM 进行 diff 算法找到它们之间的差异, 尽量复用 DOM 从而提高性能; 所以 diff 算法主要就是用于查找新旧虚拟 DOM 之间的差异。

**2.大致流程：**

对新旧两棵树做深度优先遍历，避免对两棵树做完全比较，因此算法复杂度可以达到 O(n)。然后给每个节点生成一个唯一的标志。 在遍历的过程中，每遍历到一个节点，就将新旧两棵树作比较，并且只对同一级别的元素进行比较：

- 只进行同一层级的比较，如果跨层级的移动则视为创建和删除操作。
- 如果是不同类型的元素，则认为是创建了新的元素，而不会递归比较他们的孩子。
- 如果是列表元素等比较相似的内容，可以通过key来唯一确定是移动还是创建或删除操作。

**3.React diff 算法具体策略：**

1. tree diff：同级元素比较：

react 会对 fiber 树进行分层比较，只比较同级元素，当出现节点跨层级移动时，并不会出现想象中的移动操作，而是将旧节点删除，然后重新创建新节点。

![0](/assets/images/react0.webp)

2. component diff：组件之间的比较

- 对同种类型组件对比，按照层级比较继续比较虚拟DOM树即可，但有种特殊的情况，当组件A如果变化为组件B的时候，有可能虚拟DOM并没有任何变化，所以用户可以通过shouldComponentUpdate() 来判断是否需要更新，判断是否计算。
- 对于不同组件来说，React会直接判定该组件为Dirty component（脏组件），无论结构是否相似，只要判断为脏组件就会直接替换整个组件的所有节点。
- 更新过程： 先在新节点下面创建新的元素，创建完成后，删除老节点下面的变动元素。

![1](/assets/images/react1.webp)

3. element diff：节点比较：

element 同一层级的节点的比较规则, 根据每个节点在对应层级的唯一 key 作为标识, 并且对于同一层级的节点操作只有 3 种, 分别为 INSERT_MARKUP(插入)MOVE_EXISTING(移动)REMOVE_NODE(删除)

- 插入（INSERT_MARKUP）: 如果是全新的节点，需要对新节点执行插入操作。
- 移动（MOVE_EXISTING）: 新节点某个类型组件或元素节点存在旧节点里，通过key来进行直接移动复用。
- 删除（REMOVE_NODE）: 旧节点中某个组件或节点类型在新节点中也有，但对应的 element 不同则不能直接复用和- 更新，需要执行删除操作，或者旧组件或节点不在新节点里的，也需要执行删除操作。

![2](/assets/images/react2.webp)

注意事项：

- key 的值必须保证 唯一 且 稳定, 有了 key 属性后, 就可以与组件建立了一种对应关系, react 根据 key 来决定是销毁还是重新创建组件, 是更新还是移动组件。
- index 的使用存在的问题: 大部分情况下可能没有啥问题, 但是如果涉及到数据变更(更新、新增、删除), 这时 index 作为 key 会导致展示错误的数据, 其实归根结底, 使用 index 的问题在于两次渲染的index 是相同的, 所以组件并不会重新销毁创建, 而是直接进行更新。
