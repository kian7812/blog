# Fiber架构

## 简述 fiber 架构

https://chodocs.cn/interview/react-summary/

React16 开始的fiber架构可以分为三层，相较于React15，新增了Scheduler（调度器），Reconciler从递归处理虚拟DOM变为可中断的循环过程，：
- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入 Reconciler
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

是什么？
Fiber 是 React 16 中采用的新协调（reconciliation）引擎，主要目标是支持虚拟 DOM 的渐进式渲染。

解决了什么问题？
Fiber 将原有的 Stack Reconciler 替换为 Fiber Reconciler，提高了复杂应用的可响应性和性能。

怎么解决的
对大型复杂任务的分片。
对任务划分优先级，优先调度高优先级的任务。
调度过程中，可以对任务进行挂起、恢复、终止等操作。

## 架构演进

https://www.pipipi.net/43591.html

- React 15 主要分为 Reconciler 协调器 和 Renderer 渲染器 两部分：
  - Reconciler 负责生成虚拟 DOM 并进行 diff，找出变动的虚拟 DOM，
  - 然后 Renderer 负责将变化的组件渲染到不同的宿主环境中。
- React 16 多了一层 Scheduler 调度器，并且 Reconciler 协调器 的部分基于 Fiber 完成了重构。
- React 17 是一个用以稳定 concurrent mode 并行模式 的过渡版本，另外，它使用 Lanes 重构了优先级算法。
  - Lane 用二进制位表示任务的优先级，方便优先级的计算（位运算），不同优先级占用不同位置的“赛道”，而且存在批的概念，优先级越低，“赛道”越多。高优先级打断低优先级，新建的任务需要赋予什么优先级等问题都是 Lane 所要解决的问题。

### 流程

整个 Reconciliation 的流程可以简单地分为两个阶段：
- Render 阶段：当 React 需要进行 re-render 时，会遍历 Fiber 树的节点，根据 diff 算法将变化应用到 workInProgress 树上，这个阶段是随时可中断的。
- Commit 阶段：当 workInProgress 树构建完成之后，将其作为 Current 树，并把 DOM 变动绘制到页面上，这个阶段是不可中断的，必须一气呵成，类似操作系统中「原语」的概念。
- workInProgress tree 代表当前正在执行更新的 Fiber 树
- currentFiber tree 表示上次渲染构建的 Filber 树

### Scheduler

对于大部分浏览器来说，每 1s 会有 60 帧，所以每一帧差不多是 16.6 ms，如果 Reconciliation 的 Render 阶段的更新时间过长，挤占了主线程其它任务的执行时间，就会导致页面卡顿。

**思路：**

- 将 re-render 时的 JS 计算拆分成更小粒度的任务，可以随时暂停、继续和丢弃执行的任务。
- 当 JS 计算的时间达到 16 毫秒之后使其暂停，把主线程让给 UI 绘制，防止出现渲染掉帧的问题。
- 在浏览器空闲的时候继续执行之前没执行完的小任务。

React 给出的解决方案是将整次 Render 阶段的长任务拆分成多个小任务：
- 每个任务执行的时间控制在 5ms。
- 把每一帧 5ms 内未执行的任务分配到后面的帧中。
- 给任务划分优先级，同时进行时优先执行高优任务

**如何把每个任务执行的时间控制在 5ms？**

Scheduler 提供的 shouldYield 方法在 源码 中叫 shouldYieldToHost，它通过综合判断已消耗的时间（是否超过 5ms）、是否有用户输入等高优事件来决定是否需要中断遍历，给浏览器渲染和处理其它任务的时间，防止页面卡顿。

**如何把每一帧 5ms 内未执行的任务分配到后面的帧中？**

时间切片

如果任务的执行因为超过了 5ms 等被中断了，那么 React Scheduler 会借助一种效果接近于 setTimeout 的方式来开启一个宏任务，预定下一次的更新。

React 是在借助 MessageChannel 模拟 setTimeout 的行为，将未完成的任务以宏任务的形式发放给浏览器，被动地让浏览器自行安排执行时间。

而 requestIdleCallback 是主动从浏览器处获取空闲信息并执行任务，个人感觉不太像是一种对 requestIdleCallback 的 polyfill。

**如何给任务划分优先级？**

基于 Lanes 的优先级控制。

不同的 Lanes 可以简单理解为不同的数值，数值越小，表明优先级越高。比如：
- 用户事件比较紧急，那么可以对应比较高的优先级如 SyncLane；
- UI 界面过渡的更新不那么紧急，可以对应比较低的优先级如 TransitionLane；
- 网络加载的更新也不那么紧急，可以对应低优先级 RetryLane。





## fiber架构

https://juejin.cn/post/7182382408807743548

什么是fiber，fiber解决了什么问题
在React16以前，React更新是通过树的深度优先遍历完成的，遍历是不能中断的，当树的层级深就会产生栈的层级过深，页面渲染速度变慢的问题，为了解决这个问题引入了fiber，React fiber就是虚拟DOM，它是一个链表结构，返回了return、children、siblings，分别代表父fiber，子fiber和兄弟fiber，随时可中断
Fiber是纤程，比线程更精细，表示对渲染线程实现更精细的控制
应用目的
实现增量渲染，增量渲染指的是把一个渲染任务分解为多个渲染任务，而后将其分散到多个帧里。增量渲染是为了实现任务的可中断、可恢复，并按优先级处理任务，从而达到更顺滑的用户体验
Fiber的可中断、可恢复怎么实现的
fiber是协程，是比线程更小的单元，可以被人为中断和恢复，当react更新时间超过1帧时，会产生视觉卡顿的效果，因此我们可以通过fiber把浏览器渲染过程分段执行，每执行一会就让出主线程控制权，执行优先级更高的任务
fiber是一个链表结构，它有三个指针，分别记录了当前节点的下一个兄弟节点，子节点，父节点。当遍历中断时，它是可以恢复的，只需要保留当前节点的索引，就能根据索引找到对应的节点
Fiber更新机制
初始化

创建fiberRoot（React根元素）和rootFiber(通过ReactDOM.render或者ReactDOM.createRoot创建出来的)
进入beginWork

workInProgress:正在内存中构建的fiber树叫workInProgress fiber，在第一次更新时，所有的更新都发生在workInProgress树，在第一次更新后，workInProgress树上的状态是最新状态，它会替换current树
current:正在视图层渲染的树叫current fiber树
ini复制代码currentFiber.alternate = workInProgressFiber
workInProgressFiber.alternate = currentFiber

3.  深度调和子节点，渲染视图
在新建的alternate树上，完成整个子节点的遍历，包括fiber的创建，最后会以workInProgress树最为最新的渲染树，fiberRoot的current指针指向workInProgress使其变成current fiber，完成初始化流程
更新

重新创建workInProgress树，复用当前current树上的alternate，作为新的workInProgress

渲染完成后，workInProgress树又变成current树
双缓冲模式
话剧演出中，演员需要切换不同的场景，以一个一小时话剧来说，在舞台中切换场景，时间来不及。一般是准备两个舞台，切换场景从左边舞台到右边舞台演出
在计算机图形领域，通过让图形硬件交替读取两套缓冲数据，可以实现画面的无缝切换，减少视觉的抖动甚至卡顿。
react的current树和workInProgress树使用双缓冲模式，可以减少fiber节点的开销，减少性能损耗
React渲染流程
如图，React用JSX描述页面，JSX经过babel编译为render function，执行后产生VDOM，VDOM不是直接渲染的，会先转换为fiber，再进行渲染。vdom转换为fiber的过程叫reconcile，转换过程会创建DOM，全部转换完成后会一次性commit到DOM，这个过程不是一次性的，而是可打断的，这就是fiber架构的渲染流程

vdom（React Element对象）中只记录了子节点，没有记录兄弟节点，因此渲染不可打断
fiber（fiberNode对象）是一个链表，它记录了父节点、兄弟节点、子节点，因此是可以打断的
vue版本面试题有时间就出，由于本人新冠确诊，需要病好了再写了
原创整理与码字不易，如果这篇文章帮助到了你，欢迎点赞和关注。




## setState
###  setState 是同步还是异步？
react 18 之前：

在Promise的状态更新、js原生事件、setTimeout、setInterval..中是同步的。
在react的合成事件中，是异步的。

react 18 之后：

setState都会表现为异步（即批处理）。

setState 是同步更新还是异步更新？

在源码中，通过 isBatchingUpdates 来判断 setState 是先存进 state 队列还是直接更新，如果值为 true 则执行异步操作，为 false 则直接更新。一般认为，做异步设计是为了性能优化、减少渲染次数。
一般会被追问（也可以自己说）：在什么情况下 isBatchingUpdates 会为 true 呢？

在 React 可以控制的地方，就为 true，比如在 React 生命周期事件和合成事件中，都会走合并操作，延迟更新的策略。

在 React 无法控制的地方，比如原生事件，具体就是在 addEventListener 、setTimeout、setInterval 等事件中，就只能同步更新。

### 调用 setState 之后发生了什么？
https://zhuanlan.zhihu.com/p/304213203

在 setState 的时候，React 会为当前节点创建一个 updateQueue 的更新列队。
然后会触发 reconciliation 过程，在这个过程中，会使用名为 Fiber 的调度算法，开始生成新的 Fiber 树， Fiber 算法的最大特点是可以做到异步可中断的执行。
然后 React Scheduler 会根据优先级高低，先执行优先级高的节点，具体是执行 doWork 方法。
在 doWork 方法中，React 会执行一遍 updateQueue 中的方法，以获得新的节点。然后对比新旧节点，为老节点打上 更新、插入、替换 等 Tag。
当前节点 doWork 完成后，会执行 performUnitOfWork 方法获得新节点，然后再重复上面的过程。
当所有节点都 doWork 完成后，会触发 commitRoot 方法，React 进入 commit 阶段。
在 commit 阶段中，React 会根据前面为各个节点打的 Tag，一次性更新整个 dom 元素。

### setState到底是同步还是异步？✅

https://juejin.cn/post/7338617055149883419

- React 18之前，React采用了一种同步和异步处理的机制，进入React调度流程的操作是异步处理，包括合成事件，而未进入调度流程的原生事件（如setTimeout、setInterval）是同步处理。这种同步处理方式可能会导致性能浪费，因为多次调用setState会重复触发多次渲染，即使只需要渲染最后一次的结果。
- 从React 18开始，通过使用createRoot创建应用，所有事件都会自动进行批量处理，而不再区分同步和异步。这意味着无论是合成事件还是原生事件，都会进入React的调度流程，以实现性能的优化。但如果仍然使用render方法进行渲染，事件处理流程仍然与React 18之前的机制相同，可能会导致不必要的性能问题。react18引入了Automatic Batching(自动批处理机制)。

**setState 调用的原理:**

1. 调用setState入口函数，入口函数类似一个分发器，根据入参不同，将其分发到不同的功能函数中。
2. enqueueSetState 方法将新的 state 放进组件的状态队列里，并调用 enqueueUpdate 来处理将要更新的实例对象；
3. 调用enqueueUpdate函数执行更新。该函数中有个关键对象：batchingStrategy，该对象所具备的isBatchingUpdates 属性直接决定了当下是要走更新流程，还是应该排队等待；如果轮到执行，就调用 batchedUpdates 方法来直接发起更新流程。

**setState的第二个参数作用是什么？**

setState 的第二个参数是一个可选的回调函数。这个回调函数将在组件重新渲染后执行。等价于在 componentDidUpdate 生命周期内执行。



## 什么是 Fiber？诞生背景是什么✅

https://juejin.cn/post/7329780589061095434

在 React 16 之前，React 使用的协调算法有一个主要的限制，即一旦开始渲染，就必须同步完成整个组件树的渲染。这意味着 React 无法中断工作以确保主线程的响应性。对于大型应用或复杂界面更新，这可能导致主线程阻塞，从而影响到动画的流畅度、输入响应等。
为了解决这些问题，React 团队重新设计了协调算法，引入了 Fiber。以下是一些 Fiber 的关键特性：

**关键特性：**

1. 增量渲染（Incremental Rendering）：Fiber 能够将渲染工作分割成多个小任务，而不是像以前那样一次性处理整个组件树。这样 React 可以根据需要在多个帧上分配这些任务。
1. 任务可中断：Fiber 架构允许 React 暂停正在进行的工作，先执行更高优先级的工作，然后再回来完成之前的工作。这使得 React 可以保持应用的响应性，即使在大量更新发生时也是如此。
2. 错误处理：Fiber 引入了一种新的错误边界（error boundaries）概念，这让组件能够捕获子组件树中的 JavaScript 错误，记录这些错误，并显示备用 UI。
3. 更好的优先级管理：Fiber 允许 React 根据任务的重要性给它们分配不同的优先级。例如，动画更新可以被赋予高优先级，而数据抓取则可以是低优先级。
4. 新的生命周期方法：为了适应 Fiber 架构，React 引入了新的生命周期方法（如getDerivedStateFromProps），这些方法适用于新的渲染策略。

**实现细节**

Fiber 实际上是对 React 虚拟 DOM 的每个节点的重新实现。每个 Fiber 节点代表一个工作单元，它对应一个 React 元素、组件实例或 DOM 节点。这个新的结构是个单链表的形式，允许 React 在执行中逐节点遍历和操作。

每个 Fiber 节点都有自己的内部状态和对其他 Fiber 节点的引用（例如，对子节点、父节点、兄弟节点的引用），以及对实际 DOM 节点的引用（如果有的话）。React 可以独立地更新这些 Fiber 节点，这是 Fiber 架构的核心优势，它允许任务分割和中断工作。

总之，Fiber 的引入使得 React 更加强大和高效，特别是在处理大规模应用和复杂更新时。它为未来的 React 特性和优化提供了基础，包括异步渲染和并发模式（Concurrent Mode），这些都是 React 应用未来性能提升的关键方面。

### 任务优先级如何处理的？底层模型是什么

（todo：具体哪些任务可以中断）

React Fiber 的任务优先级处理是通过一个调度器（Scheduler）来实现的，这个调度器负责协调不同优先级的任务。在 React 中，每个更新都有一个与之关联的优先级。React Scheduler 使用这些优先级来决定何时执行哪些更新。

**优先级级别**

React 定义了多个优先级级别，包括（但不限于）：
- Immediate Priority：用于不能等待的工作，比如由用户输入或动画触发的更新。
- User Blocking Priority：用于可能阻塞用户操作的工作。
- Normal Priority：用于正常的数据抓取、DOM 更新等。
- Low Priority：用于不急迫的任务，可以推迟的工作，如日志记录。
- Idle Priority：用于完全不紧急的任务，只有在主线程空闲时才执行，如离屏渲染。

**调度模型**

React Scheduler 的模型基于以下概念：
1. requestIdleCallback：这是浏览器 API 的一部分，允许开发者安排在主线程空闲时运行的低优先级工作。React Scheduler 使用了类似requestIdleCallback的机制，用于在浏览器空闲时执行低优先级工作。
2. requestAnimationFrame：这是另一种浏览器 API，常用于在下次重绘前执行动画或视觉更新。React Scheduler 利用它来确保高优先级的更新能够及时执行。

当 React 需要调度一个更新时，它会根据更新的优先级将其排队。Scheduler 将会决定基于优先级和浏览器的当前忙碌程度来执行哪些任务。高优先级的任务（如用户输入响应）会被提前执行，而低优先级的任务可能会延迟，直到浏览器有足够的空闲时间来处理这些任务。

**中断和恢复**

React Fiber 架构允许中断正在进行的工作，以及根据需要恢复这些工作。如果有一个新的高优先级更新发生（如用户点击），React 可以中断正在进行的低优先级渲染任务，优先执行高优先级更新，以确保良好的用户交互体验。

为了管理这些不同的工作单元（Fibers），React 维护了一个工作队列，其中包含了所有已调度且待处理的工作。Scheduler 会根据优先级来处理这个队列中的任务，使用循环来不断检查是否有更高优先级的任务需要插队执行。

**总结**

React Fiber 的任务优先级处理允许 React 应用更高效地管理和更新状态，避免长时间占用主线程，这样就可以保持应用的流畅性和快速响应用户交互。优先级调度是 Fiber 架构的核心特性之一，使得 React 可以在复杂应用中实现更好的性能和用户体验。

### 这种模型下，如何实现任务中断的？用了什么技术


React Fiber 的任务中断是通过 Fiber 架构的工作循环来实现的。Fiber 架构改变了 React 以前的同步渲染模式，引入了一种可以暂停和恢复的异步渲染方式。以下是实现任务中断的关键技术和概念：

**分包（Chunking）**

Fiber 架构把渲染工作拆分成了多个小块（chunks）。每个 Fiber 节点代表了一个工作单元。React 渲染时，会按顺序遍历 Fiber 树中的节点，执行与每个节点相关的工作。

**任务循环与调度**

React 有一个内部调度系统（React Scheduler），负责管理任务的优先级和执行。在任务循环中，React 会根据优先级检查当前是否有更重要的任务需要处理，随时准备暂停当前的工作。

**时间分片（Time Slicing）**
React 使用浏览器的requestIdleCallback和requestAnimationFrameAPI 来执行时间分片。使用requestIdleCallback可以让 React 在浏览器空闲时执行低优先级的更新，而requestAnimationFrame则用于高优先级的更新，如动画。

**任务中断**
在 React 的工作循环中，开发者可以设置一个时间阈值，告诉调度器当前的时间片段是否还有剩余时间。如果当前时间片段已经没有剩余时间，React 可以将控制权交还给浏览器，使浏览器处理如输入、滚动等其他任务。这样的过程称为任务中断。当浏览器处理完其他任务并再次有空闲时，React 可以恢复之前中断的工作。

**恢复与状态一致性**
由于 React 每次处理的都是一个单独的 Fiber 节点，当工作被中断时，React 标记这个 Fiber 节点的状态，并将其保留在内存中。当恢复工作时，React 可以从上次中断的地方继续执行，确保组件状态的一致性。

**实现细节**
React 并没有直接使用requestIdleCallback，因为这个 API 的兼容性和稳定性问题。相反，React 实现了自己的任务调度策略，模拟了类似的机制，以控制何时执行、中断以及恢复任务。React 的并发模式（Concurrent Mode）依赖于这种任务调度策略，它使得 React 可以在渲染过程中中断，并根据优先级进行任务管理。

**总结**
通过上述的技术和架构，React 的 Fiber 架构能够在保持 UI 响应的同时，进行复杂的渲染任务。这使得 React 应用即使在繁重的计算和大量的组件更新时，也能保持良好的性能表现。任务中断是实现这一目标的关键技术之一。

### 调度示例代码

React 团队开发了自己的调度器（scheduler）来实现任务的时间分片和中断，以便在不同的浏览器和平台上都能有可预测和一致的行为。这个调度器会模拟requestIdleCallback的行为，并加入了一些 React 特定的优化。

React 的调度器使用了一个循环来周期性地检查是否有任务需要执行。这个循环基于requestAnimationFrame和MessageChannel等 API 来实现，以确保即使在不支持requestIdleCallback的环境中也能运行。

以下是一个简化的 JavaScript 示例，演示了 React 可能如何使用requestAnimationFrame和MessageChannel来实现一个简单的任务调度器。这不是 React 实际的调度器代码，但它捕捉了基本的思想：

```js
// 假设的任务队列
let taskQueue = [];

// 调度一个任务
function scheduleTask(task) {
  taskQueue.push(task);
  startTaskLoop();
}

// 使用requestAnimationFrame和MessageChannel模拟实现任务循环
let isTaskLoopRunning = false;
const channel = new MessageChannel();
const { port1, port2 } = channel;

// 监听消息事件来运行任务
port1.onmessage = function () {
  // 检查当前帧是否还有剩余时间
  if (hasIdleTime()) {
    // 如果有剩余时间就执行任务
    performTask();
  } else {
    // 否则延迟到下一帧
    startTaskLoop();
  }
};

// 开始任务循环
function startTaskLoop() {
  if (!isTaskLoopRunning && taskQueue.length > 0) {
    isTaskLoopRunning = true;
    requestAnimationFrame(() => {
      // 发送消息来触发任务运行
      port2.postMessage(null);
    });
  }
}

// 执行任务
function performTask() {
  const task = taskQueue.shift();
  if (task) {
    // 执行任务代码
    task();
  }

  // 如果任务队列不为空，继续任务循环
  isTaskLoopRunning = taskQueue.length > 0;
  if (isTaskLoopRunning) {
    startTaskLoop();
  }
}

// 检查当前帧是否还有剩余时间
function hasIdleTime() {
  // 这里是简化的逻辑
  // 实际React会有更复杂的判断，会考虑执行时间等因素
  return performance.now() % 16 < 10;
}

// 示例任务
function exampleTask() {
  console.log("Task executed at", performance.now());
}

// 调度几个任务
scheduleTask(exampleTask);
scheduleTask(exampleTask);
scheduleTask(exampleTask);

```

在这个示例中，scheduleTask函数用来添加任务到队列。startTaskLoop函数会设置一个循环，使用requestAnimationFrame来确保在每个动画帧开始时检查任务队列。port1.onmessage监听器会在每个动画帧内部被调用，来决定是否执行任务或者等待下一帧。

注意，这只是一个非常简化的示例，仅用于阐释概念。React 的实际调度器要复杂得多，并且考虑了更多的性能优化和边缘情况处理。React 官方的 scheduler 包（@scheduler）中包含了 React 团队用于任务调度的实现细节。

### 使用 MessageChannel 是为了解决什么问题✅

https://mp.weixin.qq.com/s/m86sRBtukxj9b9weNtJpYg

1. 实现异步渲染

React 16 及更高版本引入了异步渲染，它允许 React 将渲染过程分割成多个阶段，并在每个阶段之间暂停执行。这可以提高 React 的性能，因为它可以避免在浏览器空闲时间内进行不必要的渲染。

MessageChannel 用于在 React 的调度器中实现异步渲染。调度器负责管理 React 更新的执行顺序。当调度器决定暂停渲染时，它会使用 MessageChannel 将一个宏任务添加到浏览器的事件循环中。该宏任务将在浏览器完成下一次绘制操作后执行。

2. 提高响应速度

在 React 16 之前，React 使用 setTimeout 来实现异步渲染。但是，setTimeout 有一个缺点，那就是它不能保证回调函数会在浏览器空闲时间内执行。这可能会导致 React 在浏览器繁忙时出现卡顿现象。

MessageChannel 可以保证回调函数会在浏览器空闲时间内执行。这是因为 MessageChannel 是一个宏任务，而宏任务会在浏览器完成下一次绘制操作后执行。

3. 提高可预测性

MessageChannel 可以提高 React 渲染过程的可预测性。这是因为 MessageChannel 的执行顺序是确定的。

总而言之，React 使用 MessageChannel 可以提高 React 的性能、响应速度和可预测性。

**在 React 的 useEffect 钩子中**

useEffect 钩子允许我们在组件挂载和更新时执行副作用。如果副作用需要在浏览器空闲时间内执行，我们可以使用 MessageChannel 将副作用包装在一个宏任务中。

```js
useEffect(() => {
  const messageChannel = new MessageChannel();

  messageChannel.port1.onmessage = (event) => {
    // 执行副作用
  };

  messageChannel.port2.postMessage('start');

  return () => {
    messageChannel.port1.close();
    messageChannel.port2.close();
  };
}, []);
```
**在 React 的 useDeferredValue 钩子中**

useDeferredValue 钩子允许我们延迟更新组件的状态。如果我们希望延迟更新到浏览器空闲时间内，我们可以使用 MessageChannel 将更新包装在一个宏任务中。

```js
const [value, setValue] = useState(0);

const deferredValue = useDeferredValue(value);

useEffect(() => {
  const messageChannel = new MessageChannel();

  messageChannel.port1.onmessage = (event) => {
    // 更新组件状态
    setValue(event.data);
  };

  messageChannel.port2.postMessage(value);

  return () => {
    messageChannel.port1.close();
    messageChannel.port2.close();
  };
}, [value]);
```


### MessageChannel 和 web worker 的区别✅

https://mp.weixin.qq.com/s/m86sRBtukxj9b9weNtJp

MessageChannel 和 Web Worker 都是 JavaScript 中用于实现跨线程通信的 API。但是，它们之间也有一些重要的区别。

1. 线程模型

MessageChannel 用于在主线程和其他线程之间进行通信。这些其他线程可以是 Web Worker、iframe 或其他浏览器上下文。

Web Worker 允许您在单独的线程中执行 JavaScript 代码。这可以提高应用程序的性能，因为它可以将耗时的任务卸载到主线程之外。

2. 通信方式

MessageChannel 使用 消息传递来进行通信。您可以使用 postMessage 方法发送消息，并使用 onmessage 事件处理程序接收消息。

Web Worker 使用 postMessage 方法来进行通信。主线程和 Web Worker 都可以使用 postMessage 方法发送消息，并使用 onmessage 事件处理程序接收消息。

3. 数据传输

MessageChannel 可以传输任意类型的数据，包括对象、数组和函数。

Web Worker 只能传输可序列化数据，例如字符串、数字和布尔值。

4. 安全性

MessageChannel 是安全的，因为它只能用于在信任的上下文之间进行通信。

Web Worker 在安全性方面存在一些风险。例如，恶意 Web Worker 可以访问主线程的 DOM 和 JavaScript 对象。

5. 适用场景

MessageChannel 适用于需要在主线程和其他线程之间进行频繁通信的场景。

Web Worker 适用于需要在单独的线程中执行耗时的任务的场景。

选择使用 MessageChannel 还是 Web Worker 取决于您的具体需求。 如果您需要在主线程和其他线程之间进行频繁通信，那么 MessageChannel 是一个不错的选择。如果需要在单独的线程中执行耗时的任务，那么 Web Worker 是一个不错的选择。

### 为什么不用 Promise 而是用 MessageChannel✅

https://mp.weixin.qq.com/s/m86sRBtukxj9b9weNtJpYg

Promise 和 MessageChannel 都是 JavaScript 中用于处理异步操作的 API。但是，在某些情况下，使用 MessageChannel 可能会比使用 Promise 更有优势。

1. 性能

MessageChannel 的性能通常优于 Promise。这是因为 MessageChannel 可以直接在浏览器提供的线程池中执行回调函数，而 Promise 则需要通过 JavaScript 引擎来执行回调函数。

2. 可预测性

MessageChannel 的执行顺序是确定的。这意味着您可以确信回调函数将在您期望的时间执行。而 Promise 的执行顺序则取决于 JavaScript 引擎的实现，这可能会导致回调函数在您不期望的时间执行。

3. 浏览器兼容性

MessageChannel 是一个标准的 Web API，因此它在所有浏览器上都具有相同的行为。而 Promise 则不是一个标准的 Web API，因此它在不同浏览器上可能具有不同的行为。

4. 代码的可维护性

使用 MessageChannel 可以使代码更加清晰易懂。这是因为 MessageChannel 提供了一种简单易用的方式来实现异步操作。

以下是一些使用 MessageChannel 而不是 Promise 的具体示例:

在 React 中实现异步渲染
在 Web Worker 中执行耗时的任务
在多个浏览器窗口之间进行通信
总结

MessageChannel 在性能、可预测性、浏览器兼容性和代码可维护性方面都具有一些优势。因此，在某些情况下，使用 MessageChannel 可能会比使用 Promise 更有优势。

但是，Promise 仍然是一个非常有用的 API。在许多情况下，使用 Promise 是实现异步操作的最佳方式。

### 实现 MessageChannel 空闲时执行✅

https://mp.weixin.qq.com/s/m86sRBtukxj9b9weNtJpYg

要实现MessageChannel在空闲时执行，可以利用requestIdleCallback或者setTimeout（在没有requestIdleCallback支持的情况下）结合MessageChannel来安排任务在浏览器空闲时段执行。

以下是一个简单的示例：
```js
if ('requestIdleCallback' in window) {
  // 如果浏览器支持 requestIdleCallback
  const channel = new MessageChannel();
  let idleCallbackId;

  function sendMessageWhenIdle(message) {
    if (idleCallbackId) {
      return; // 如果已有回调正在等待执行，则忽略新的消息
    }

    // 创建一个空闲回调函数
    const callback = () => {
      channel.port1.postMessage(message);
      idleCallbackId = null;
    };

    // 请求浏览器在空闲时调用此回调函数
    idleCallbackId = window.requestIdleCallback(callback, { timeout: 500 /* 可以设置超时时间 */ });
  }

  // 接收来自主线程的消息
  channel.port2.onmessage = (event) => {
    // 这里处理从主线程接收到的消息
  };

  // 将端口暴露给主线程
  window.postMessage('initWorker', '*', [channel.port2]);
} else {
  // 如果不支持requestIdleCallback，可以退化到setTimeout模拟空闲执行
  const channel = new MessageChannel();

  function sendMessageWhenIdle(message) {
    clearTimeout(timeoutId); // 清除之前的定时器

    const timeoutId = setTimeout(() => {
      channel.port1.postMessage(message);
    }, 100 /* 假设100毫秒后是空闲状态 */);
  }

  // ... 其他部分与上述代码相同
}
```

在这个例子中，我们首先创建了一个MessageChannel，然后定义了一个函数sendMessageWhenIdle，该函数在浏览器空闲时通过requestIdleCallback（或setTimeout作为备用方案）发送消息。这样，我们就可以在不影响用户体验的情况下，尽量在浏览器空闲时执行通过MessageChannel发送的任务。当然，实际应用场景中，你可能需要根据需求调整具体的逻辑和参数。


### React Concurrent Mode 三连：是什么？为什么？怎么做？✅

https://mp.weixin.qq.com/s/m86sRBtukxj9b9weNtJpYg

**是什么？**

React Concurrent Mode 是 React 18 中引入的新功能。它允许 React 在不阻塞用户界面的情况下执行后台渲染。

Concurrent Mode 的工作原理:

1. React 使用 Fiber 架构来管理更新。Fiber 是 React 中表示 UI 元素的轻量级数据结构。
2. 当 React 收到更新时，它会创建一个新的 Fiber 树。新的 Fiber 树代表更新后的 UI。
3. React 会并行渲染新的 Fiber 树和旧的 Fiber 树。
4. 当新的 Fiber 树准备就绪时，React 会将其提交到 DOM。

**为什么？**

Concurrent Mode 有以下几个优势:

- 提高用户界面响应速度: Concurrent Mode 允许 React 在不阻塞用户界面的情况下执行后台渲染。这意味着用户可以继续与应用程序交互，即使应用程序正在进行更新。
- 提高性能: Concurrent Mode 可以提高应用程序的性能，因为它可以并行执行多个任务。
- 提高可预测性: Concurrent Mode 可以提高应用程序的可预测性，因为它可以确保更新按预期顺序应用。

怎么做？
要使用 Concurrent Mode，您需要:
- 将您的应用程序升级到 React 18。
- 在您的应用程序中启用 Concurrent Mode。
- 启用 Concurrent Mode 的方法:
```js
import { unstable_ConcurrentMode } from 'react';
const App = () => {
  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'), {
  mode: unstable_ConcurrentMode,
});
```
除了启用 Concurrent Mode 之外，您还可以使用以下一些技巧来充分利用 Concurrent Mode:

使用 Suspense 来延迟渲染
使用 useDeferredValue 来延迟读取值
使用 startTransition 来包裹更新


### 讲一下 react 状态发生变化触发视图更新的链路

React 状态更新触发视图更新的链路涉及一系列精心设计的步骤。这些步骤确保了当组件状态改变时，React 可以高效且准确地更新 UI。以下是 React 中状态更新触发视图更新链路的概述：

**1. 状态更新**

当组件中的状态（state）发生变化时。这可能是由于 setState、useState 的 setter 函数或 useReducer 的 dispatch 调用引起的。

当状态更新被触发时，React 会将该组件标记为需要更新。

**2. 调度更新**

React 的调度器接收到更新请求，并不会立即触发组件的重新渲染，而是将更新任务放入待处理的更新队列中，等待后续处理。

React 内部会调度这些更新任务，并根据一定的优先级和调度策略来决定何时进行更新。

**3. 协调（Reconciliation）**

协当 React 决定执行更新任务时，会进入协调阶段，这个阶段主要负责比较新旧状态之间的差异，并生成更新的虚拟 DOM。

React 使用一种叫做协调算法（Reconciliation Algorithm）的方式来比较新旧状态，找出需要更新的部分，并生成相应的更新指令。

**4. 渲染**

在协调阶段完成后，React 将根据生成的更新指令来进行实际的渲染操作。

React 会将更新应用到虚拟 DOM 上，并生成一个新的虚拟 DOM 树。

**5. 提交**

当协调完成并且 React 准备好应用变更到实际 DOM 时，它会执行提交阶段。

- 执行副作用：在提交阶段，React 会执行 useEffect、useLayoutEffect 等 Hook 中的副作用函数。
- 更新 DOM：React 将更新计算出来的变更应用到实际的 DOM 上。这可能包括属性的更新、元素的添加或删除等。
- 引用赋值：React 会更新需要变更的组件的引用，例如将 DOM 节点赋值给通过 useRef 创建的 Refs。

**6. 清理与通知**

最后，React 清理之前渲染的状态、执行副作用的清理函数，并在需要时通知组件更新完成。这是一个清理并使系统保持最新状态的过程。

**思考**

整个过程是高度优化的，涉及到了一系列复杂的内部机制。React 使用了如 Fiber 架构、双缓冲、时间切片等技术，使得即使在大规模的更新中也能保持高性能并避免阻塞主线程。

在实践中，React 开发者不需要深入了解所有内部细节，但理解状态更新和视图更新之间的基本链路对于编写高效且符合预期的代码是非常有帮助的。

## 为什么要推出Fiber 架构？✅

https://juejin.cn/post/7338617055149883419

Fiber 是对 React核心算法（即调和过程）的重写。 首先 React 组件的渲染主要经历两个阶段:

- 协调阶段(Reconciler): 这个阶段 React 用新数据生成新的虚拟 DOM, 遍历新旧虚拟DOM, 然后通过 Diff 算法, 快速找出需要更新的元素, 放到更新队列中去
- 渲染阶段(Renderer): 这个阶段 React 根据所在的渲染环境, 遍历更新队列, 将对应元素更新(在浏览器中, 就是更新对应的 DOM 元素)

**React 传统的协调机制**

在引入 Fiber 之前，React 使用的是一种递归的方式来遍历组件树，对比旧的虚拟 DOM 和新的虚拟 DOM 来确定哪些部分需要更新。这个过程称为协调（Reconciliation）。虽然虚拟 DOM 提高了更新的效率，但这种递归处理方式有一些缺点：

- 无法中断：一旦开始，整个虚拟 DOM 的对比过程就必须一气呵成，无法中断。对于大型应用，这可能导致主线程被长时间占用，从而影响到用户的交互体验。
- UI阻塞问题：由于无法中断，所有的更新都有相同的优先级，React 无法优化那些更紧急的任务（如动画或用户输入）。

Fiber 是 React 16 中采用的新协调（reconciliation）引擎，主要目标是支持虚拟 DOM 的渐进式渲染。 Fiber 将原有的 Stack Reconciler 替换为 Fiber Reconciler，提高了复杂应用的可响应性和性能。主要通过以下方式达成目标：

- 对大型复杂任务的分片。
- 对任务划分优先级，优先调度高优先级的任务。
- 调度过程中，可以对任务进行暂停、挂起、恢复等操作。

参考：https://zhuanlan.zhihu.com/p/424967867

### Fiber和虚拟DOM的区别？

每一个DOM节点对应一个Fiber对象，Fiber通过多向链表树的形式来记录节点之间的关系，它与传统的虚拟DOM最大的区别是多加了几个属性，通过这种链表的形式，可以很轻松的找到每一个节点的下一个节点或上一个节点，更好的去实现时间切片功能。 React**用空间换时间**，更高效的操作可以方便根据优先级进行操作。同时可以根据当前节点找到其他节点，在下面提到的挂起和恢复过程中起到了关键作用。

- return：向上链接整颗树
- child：向下链接整棵树
- sibling：横向链接整颗树

链表的好处：

- 操作更高效，比如顺序调整、删除，只需要改变节点的指针指向就好了。
- 不仅可以根据当前节点找到下一个节点，在多向链表中，还可以找到他的父节点或者兄弟节点。

链表的缺点：

比- 顺序结构数据更占用空间，因为每个节点对象还保存有指向下一个对象的指针。
- 不能自由读取，必须找到他的上一个节点。

![3](/assets/images/react3.webp)

关键词：Fiber节点、链表结构、任务的中断与恢复 区别总结：

1. 数据结构：在传统的虚拟 DOM 中，React 使用递归的方式处理组件树。这种方式虽然简单，但它不能中断。Fiber 架构通过链表和可中断的任务单元，提供了更灵活的更新机制。
2. 优先级调度：Fiber 架构允许 React 对不同的更新任务分配不同的优先级。高优先级的任务（如用户输入）可以打断低优先级的任务（如后台数据同步），从而提高应用的响应性。
3. 空间换时间：虽然 Fiber 节点的链表结构比传统虚拟 DOM 更占用空间（因为每个节点都需要额外的指针），但它提供了更高效的操作方式，尤其是在处理大量节点和复杂更新时。

### Scheduler（调度器）是什么？

Fiber 架构中的 Scheduler（调度器），React 在 setState 后不再直接启动“协调”过程，而是把本次更新注册到 Scheduler，再由 Scheduler 根据浏览器剩余空闲时间、优先级等因素派发给 Reconciler（协调器），并通过中断查询控制协调的中断重启。（协调就是我们说的包含 Diffing 的虚拟 DOM 构建计算过程）

参考：https://juejin.cn/post/7145359419915075615

### Scheduler（调度器）有哪些模块？

**SchedulerHostConfig基于浏览器API，实现时间片管理，有两个关键方法，主要解决两个问题：**

1. 浏览器什么时候有空？有空的话，通知我
2. 什么时候让出线程给浏览器？ requestHostCallback：注册一个在帧间空闲时间执行的回调函数（及其过期时间），并可以通过 cancelHostCallback 取消它。
    - 因requestIdleCallback兼容性堪忧，所以用MessageChannel的空闲回调模拟实现
    - 可能当前帧已经不够执行回调，就需要挪到下一帧。为此引入了 requestAnimationFrame API来实现

**shouldYieldToHost：随时判断是否需要让出线程（避免卡帧）**
- React 能相对准确获取到当前帧的结束时间戳，如果当前时间超过帧结束时间，说明已经卡到帧了，需要让出。

### Scheduler 调度实现，主要做以下事情：

- 维护一个任务池
- 定义应用优先级决定任务池的调用顺序
- 派发任务（调 requestHostCallback）
- 及时中断（在 shouldYieldToHost 时终止派发）

### React 优先级管理： 两套优先级体系 一套转换体系

https://juejin.cn/post/6993139933573546021#heading-3

**两套优先级体系**

**一、fiber优先级(LanePriority)** 

位于react-reconciler包, 也就是Lane(车道模型)，用来处理与fiber构造过程相关的优先级
    - Lane是对于expirationTime的重构，Lane类型被定义为二进制变量, 利用了位掩码的特性, 在频繁运算的时候占用内存少, 计算速度快。参考=》React算法之位运算
    - lane可以简单理解为一些数字，数值越小，表明优先级越高。但是为了计算方便，采用二进制的形式来表示。

一个示例：先点击B按钮，然后快速点击A按钮，请问Reatc对这段代码的更新流程是什么样？
```html
<p>You clicked {count} times</p>
 <button onClick={() => setCount(count + 1)}>
  A按钮
 </button>
 <button onClick={() => startTransition(() => { setCount(count + 1) })}>
  B按钮
 </button>
```
假设B按钮先点击， B更新开始，中途触发了A按钮点击，进而触发A更新。那么此时就会通过lane进行对比，A按钮是属于紧急更新，而B按钮的startTransition是过渡更新，**紧急更新优先级高于过渡更新。此时会中断B更新，开始A更新。直到A更新完成时，再重新开始B更新**。 （startTransition 是 React 18 中引入的一个新特性，用于标记更新的优先级较低，允许React延迟这些更新的处理以保持应用的响应性。）

**React17 Lanes模型相比React16 expirationTime模型有什么优势？**
1. expirationTimes模型只能区分是否>=expirationTimes决定节点是否更新 。 
2. lanes模型可以选定一个更新区间，并且动态的向区间中增减优先级，可以处理更细粒度的更新。

```js
// 判断: 单task与batchTask的优先级是否重叠
//1. 通过expirationTime判断
const isTaskIncludedInBatch = priorityOfTask >= priorityOfBatch;
//2. 通过Lanes判断
const isTaskIncludedInBatch = (task & batchOfTasks) !== 0;
​
// 当同时处理一组任务, 该组内有多个任务, 且每个任务的优先级不一致
// 1. 如果通过expirationTime判断. 需要维护一个范围(在Lane重构之前, 源码中就是这样比较的)
const isTaskIncludedInBatch =
  taskPriority <= highestPriorityInRange &&
  taskPriority >= lowestPriorityInRange;
//2. 通过Lanes判断
const isTaskIncludedInBatch = (task & batchOfTasks) !== 0;
```

**二、调度优先级(SchedulerPriority)**

位于scheduler包，用来处理与scheduler调度中心相关的优先级：

1. 定义了五种优先级，以及它们对应的过期时间
    - Immediate：最高优先级，会马上执行的不能中断
    - UserBlocking：这一般是用户交互的结果，需要及时反馈
    - Normal：普通等级的，比如网络请求等不需要用户立即感受到变化的
    - Low：低优先级的，这种任务可以延后，但最后始终是要执行的
    - Idle：最低等级的任务，可以被无限延迟的，比如`console.log()`
2. 套转换体系：
    - 优先级等级(ReactPriorityLevel) : 位于react-reconciler包中的SchedulerWithReactIntegration.js, 负责fiber优先级和调度优先级的转换，好实现协同处理。

### React fiber 是如何实现时间切片的？

**概念：**

本质上是将渲染任务拆分为多个小任务，以便提高应用程序的响应性和性能，主要依赖于两个功能：任务分割和任务优先级。

- 任务分割（Time Slicing） ：任务分割是指将一个大的渲染任务切割成多个小任务，每个小任务只负责一小部分 DOM 更新。React Fiber 使用 Fiber 节点之间的父子关系，将一个组件树分割成多个”片段“，每个“片段”内部是一颗 Fiber 子树，通过在 Fiber 树上进行遍历和操作，实现时间切片。
- 任务优先级（Prioritization） ：React Fiber 提供了一套基于优先级的算法来决定哪些任务应该先执行，哪些任务可以放到后面执行。React Fiber 将任务分成多个优先级级别，较高优先级的任务在进行渲染时会优先进行，从而确保应用程序的响应性和性能。

**基本流程：**

1. React Fiber 会将渲染任务划分成多个小任务，每个小任务一般只负责一小部分 DOM 更新。
2. React Fiber 将这些小任务保存到任务队列中，并按照优先级进行排序和调度。
3. 当浏览器处于空闲状态时，React Fiber 会从任务队列中取出一个高优先级的任务并执行，直到任务完成或者时间片用完。
4. 如果任务完成，则将结果提交到 DOM 树上并开始下一个任务。如果时间片用完，则将任务挂起，并将未完成的工作保存到 Fiber 树中，返回控制权给浏览器。
5. 当浏览器再次处于空闲状态时，React Fiber 会再次从任务队列中取出未完成的任务并继续执行，直到所有任务完成。

**React实现时间切片的发展历史**

1. 使用requestIdleCallback：

初始尝试使用requestIdleCallback来实现时间切片。

问题：
    - 不稳定：一帧的执行时间存在偏差，导致工作执行不稳定。
    - 兼容性：不同浏览器（特别是Safari）支持不佳。

2. 初步方案：requestAnimationFrame + MessageChannel：

    - 通过requestAnimationFrame来计算一帧的过期时间。
    - 使用MessageChannel创建宏任务，确保任务在下次事件循环中执行，从而不阻塞页面渲染。
问题：
    - 过于依赖显示器的刷新率，存在设备依赖性和不稳定性。

3. 新方案：高频短间隔调度：

    - 利用宏任务机制，以高频（5ms间隔setTimeout(()=>{},5)）对任务进行切片执行。
    - 目的是在每个宏任务执行间让出控制权给浏览器，以便进行必要的渲染工作。
    - 选择宏任务而非微任务，因为宏任务允许在每次事件循环后将控制权交还给浏览器。
    - API执行优先级：
        - 首选setImmediate（仅在特定环境下可用）。
        - 其次选择MessageChannel。
        - 兜底方案为setTimeout。
        - 优先使用MessageChannel而不是setTimeout的原因是MessageChannel能更快地被触发，相较于setTimeout即使设置为0，执行间隔也更短。

### React中两大工作循环scheduler任务调度循环和fiber构造循环有什么区别？

1. scheduler任务调度循环源码位于scheduler.js，控制了所有任务的调度，包括fiber构造循环，fiber构造循环源码位于ReactFiberWorkLoop.js，控制fiber的构造。
2. 「任务调度循环」是以「最小顶堆」为数据结构,堆顶是优先级最高的任务,循环执行堆的顶点, 直到堆被清空.
3. 任务调度循环的逻辑偏向宏观, 它调度的是每一个任务(task), 而不关心这个任务具体是干什么的，具体任务就是调用函数去执行「fiber的构造循环」和「消费任务调度循环的任务」 联系： fiber构造循环是任务调度循环中的任务的一部分.它们是从属关系，每个任务都会重新构造一个fiber树.更具体一点,fiber构造循环(ReactFiberWorkLoop())被封装到了一个task里,给到任务调度循环,然后由任务调度循环决定什么时候执行.

### React的patch流程：

1. React新版架构新增了一个Scheduler调度器主要用于调度Fiber节点的生成和更新任务
2. 当组件更新时，Reconciler协调器执行组件的render方法生成一个Fiber节点之后再递归的去生成Fiber节点的子节点
3. 每一个Fiber节点的生成都是一个单独的任务，会以回调的形式交给Scheduler进行调度处理，在Scheduler里会根据任务的优先级去执行任务
4. 任务的优先级的指定是根据车道模型，将任务进行分类，每一类拥有不同的优先级，所有的分类和优先级都在React中进行了枚举
5. Scheduler按照优先级执行任务时，会异步的执行，同时每一个任务执行完成之后，都会通过requestIdleCallBack去判断下一个任务是否能在当前渲染帧的剩余时间内完成
6. 如果不能完成就发生中断，把线程的控制权交给浏览器，剩下的任务则在下一个渲染帧内执行
7. 整个Reconciler和Scheduler的任务执行完成之后，会生成一个新的workInProgressFiber的新的节点树，之后Reconciler触发Commit阶段通知Render渲染器去进行diff操作，也就是我们说的patch流程

**1. Scheduler（调度器）**

- 任务调度：Scheduler是React新架构中的一个关键部分，它负责调度组件的渲染更新任务。Scheduler会根据任务的优先级来决定执行顺序，确保更重要的更新（如用户交互）能够优先处理。
- 优先级和车道模型：React中的任务分为不同的优先级，这些优先级是根据所谓的“车道模型”来分类的。不同类型的更新（如同步更新、异步更新）会被分配到不同的车道，并拥有不同的优先级。

**2. Reconciler（协调器）**

- Fiber节点的生成：当组件状态更新时，Reconciler开始工作，执行组件的render方法来生成新的Fiber节点。Fiber架构允许Reconciler以单个任务的形式处理组件树的更新。
- 递归子节点：生成Fiber节点后，Reconciler递归地处理子节点，为每个子节点创建新的Fiber任务。

**3. 任务的执行与中断**

- 异步执行和中断：Scheduler会根据优先级异步执行任务。在执行每个任务后，通过requestIdleCallback检查当前帧的剩余时间，如果时间不足以完成下一个任务，则该任务会被中断，控制权交回给浏览器。
- 任务继续：中断的任务会在下一个渲染帧继续执行。

**4. Commit阶段**

workInProgressFiber树：完成所有任务后，Reconciler会生成一棵新的workInProgressFiber树。
Diff操作：在Commit阶段，Reconciler通知渲染器进行DOM更新的Diff操作，即patch流程。这包括添加、删除或更新DOM节点。

**5. 总结**

- 这个过程提高了React应用的性能和响应性，使其能够处理大量的更新，同时保持良好的用户交互体验。
- 通过将任务分解并利用浏览器的空闲时间，React能够更智能地安排工作，避免长时间阻塞主线程，减少界面卡顿。


