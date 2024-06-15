# \*脱围机制 - effect（文档）

https://zh-hans.react.dev/learn/escape-hatches

- （这些章节，更多是为了理解问题和实践，不是作为题，但可以聊到题里，如果可以）
- **很全面的说明了，各种 useEffect 的使用场景，和不必要使用的场景及替代方案**。✅

## \*使用 Effect 同步

使用 useEffect 包裹副作用，把它分离到渲染逻辑的计算过程之外。

### 什么是 Effect，它与事件（event）有何不同？

（**👇🏻 这节描述文字比较多，不用记忆，辅助理解很好，或者直接看文档**）

在谈到 Effect 之前，你需要熟悉 React 组件中的两种逻辑类型：

- **渲染逻辑代码**（在 描述 UI 中有介绍）位于组件的顶层。你将在这里接收 props 和 state，并对它们进行转换，最终返回你想在屏幕上看到的 JSX。**渲染的代码必须是纯粹的**——就像数学公式一样，它只应该“计算”结果，而不做其他任何事情。

- **事件处理程序**（在 添加交互性 中介绍）是嵌套在组件内部的函数，而不仅仅是计算函数。事件处理程序可能会更新输入字段、提交 HTTP POST 请求以购买产品，或者将用户导航到另一个屏幕。事件处理程序包含由特定用户操作（例如按钮点击或键入）引起的“副作用”（它们改变了程序的状态）。

有时这还不够。考虑一个 ChatRoom 组件，它在屏幕上可见时必须连接到聊天服务器。连接到服务器不是一个纯计算（它包含副作用），因此它不能在渲染过程中发生。然而，并没有一个特定的事件（比如点击）导致 ChatRoom 被显示。

**Effect 允许你指定由渲染本身，而不是特定事件引起的副作用**。在聊天中发送消息是一个“事件”，因为它直接由用户点击特定按钮引起。然而，建立服务器连接是 Effect，因为它应该发生无论哪种交互导致组件出现。Effect 在屏幕更新后的 提交阶段 运行。这是一个很好的时机，可以将 React 组件与某个外部系统（如网络或第三方库）同步。

:::info INFO: 什么场景使用 Effect (创建副作用)

- ✅ **渲染的代码必须是纯粹的**
- ✅ 从这个角度理解，**React 确实是纯粹的渲染代码，和各种各样的 副作用** 组成的。
- ✅✅ **Effect 允许你指定由渲染本身，而不是特定事件引起的副作用**
- 下面很多内容是如何使用 Effect 创建副作用

:::

### 如何编写 Effect

编写 Effect 需要遵循以下三个规则：

1. **声明 Effect**。默认情况下，Effect 会在每次 commit 后都会执行。
2. **指定 Effect 依赖**。大多数 Effect 应该按需执行，而不是在每次渲染后都执行。例如，淡入动画应该只在组件出现时触发。连接和断开服务器的操作只应在组件出现和消失时，或者切换聊天室时执行。文章将介绍如何通过指定依赖来控制如何按需执行。
3. **必要时添加清理（cleanup）函数**。有时 Effect 需要指定如何停止、撤销，或者清除它的效果。例如，“连接”操作需要“断连”，“订阅”需要“退订”，“获取”既需要“取消”也需要“忽略”。你将学习如何使用 清理函数 来做到这一切。

### 为什么依赖数组中可以省略 ref?

这是因为 ref 具有 稳定 的标识：React 保证 每轮渲染中调用 useRef 所产生的引用对象时，获取到的对象引用总是相同的，即获取到的对象引用永远不会改变，所以它不会导致重新运行 Effect。因此，依赖数组中是否包含它并不重要。当然也可以包括它。

如果 ref 是从父组件传递的，则必须在依赖项数组中指定它。这样做是合适的，因为无法确定父组件是否始终是传递相同的 ref，或者可能是有条件地传递几个 ref 之一。因此，你的 Effect 将取决于传递的是哪个 ref。

### \*按需添加清理（cleanup）函数

**每次重新执行 Effect 之前，React 都会调用清理函数；组件被卸载时，也会调用清理函数**。✅

```js
import { useState, useEffect } from "react";
import { createConnection } from "./chat.js";

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect(); // ✅
  }, []);
  return <h1>欢迎来到聊天室！</h1>;
}

// chat.js
export function createConnection() {
  // 真实的实现会将其连接到服务器，此处代码只是示例
  return {
    connect() {
      console.log("✅ 连接中……");
    },
    disconnect() {
      console.log("❌ 连接断开。");
    },
  };
}
```

### 如何处理在开发环境中 Effect 执行两次？

（**👇🏻 这节的各场景中，描述文字比较多，不用记忆，辅助理解很好，或者直接看文档**）

#### 控制非 React 组件

某些 API 可能不允许连续调用两次。例如，内置的 `<dialog>` 元素的 showModal 方法在连续调用两次时会抛出异常，此时实现清理函数并使其关闭对话框：

```js
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

_在开发环境中，Effect 将调用 showModal()，然后立即调用 close()，然后再次调用 showModal()。这与调用只一次 showModal() 的效果相同。也正如在生产环境中看到的那样_。

#### 订阅事件

如果 Effect 订阅了某些事件，清理函数应该退订这些事件：

```js
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

_在开发环境中，Effect 会调用 addEventListener()，然后立即调用 removeEventListener()，然后再调用相同的 addEventListener()，这与只订阅一次事件的 Effect 等效；这也与用户在生产环境中只调用一次 addEventListener() 具有相同的感知效果_。

#### 触发动画

如果 Effect 对某些内容加入了动画，清理函数应将动画重置：

```js
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // 触发动画
  return () => {
    node.style.opacity = 0; // 重置为初始值
  };
}, []);
```

在开发环境中，透明度由 1 变为 0，再变为 1。这与在生产环境中，直接将其设置为 1 具有相同的感知效果，如果你使用支持过渡的第三方动画库，你的清理函数应将时间轴重置为其初始状态。

#### \*获取数据

_如果 Effect 将会获取数据，清理函数应该要么 中止该数据获取操作，要么忽略其结果_：

（**下面 👇🏻 ignore 是通过闭包来实现的，异步任务使用了父级作用域的变量**✅）

```js
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

我们无法撤消已经发生的网络请求，但是清理函数应当确保获取数据的过程以及获取到的结果不会继续影响程序运行。如果 userId 从 'Alice' 变为 'Bob'，那么请确保 'Alice' 响应数据被忽略，即使它在 'Bob' 之后到达。

在开发环境中，浏览器调试工具的“网络”选项卡中会出现两个 fetch 请求。这是正常的。使用上述方法，第一个 Effect 将立即被清理，而 ignore 将被设置为 true。因此，即使有额外的请求，由于有 if (!ignore) 判断检查，也不会影响程序状态。

在生产环境中，只会显示发送了一条获取请求。如果开发环境中，第二次请求给你造成了困扰，最好的方法是使用一种可以删除重复请求、并缓存请求响应的解决方案

#### Effect 中有哪些好的数据获取替代方案？

在 Effect 中调用 fetch 请求数据 是一种非常受欢迎的方式，特别是在客户端应用中。然而，它非常依赖手动操作，有很多的缺点：

- Effect 不能在服务端执行
- 直接在 Effect 中获取数据容易产生网络瀑布（network waterfall）
- 直接在 Effect 中获取数据通常意味着无法预加载或缓存数据
- 这不是很符合人机交互原则

我们推荐以下方法：

- 如果你正在使用 框架 ，使用其内置的数据获取机制。现代 React 框架集成了高效的数据获取机制，不会出现上述问题。如 nextjs
- 否则，请考虑使用或构建客户端缓存。目前受欢迎的开源解决方案是 React Query、useSWR 和 React Router v6.4+。
- 你也可以构建自己的解决方案，在这种情况下，你可以在幕后使用 Effect，但是请注意添加用于删除重复请求、缓存响应和避免网络瀑布（通过预加载数据或将数据需求提升到路由）的逻辑。

#### 发送分析报告

考虑在访问页面时发送日志分析：

```js
useEffect(() => {
  logVisit(url); // 发送 POST 请求
}, [url]);
```

在开发环境中，logVisit 会为每个 URL 发送两次请求，所以你可能会想尝试解决这个问题。不过我们建议**不必修改此处代码**，与前面的示例一样，从用户的角度来看，运行一次和运行两次之间不会 感知 到行为差异。从实际的角度来看，logVisit 不应该在开发环境中做任何影响生产事情。由于每次保存代码文件时都会重新挂载组件，因此在开发环境中会额外记录访问次数。**在生产环境中，不会产生有重复的访问日志**。

#### 初始化应用时不需要使用 Effect 的情形

某些逻辑应该只在应用程序启动时运行一次。比如，验证登陆状态和加载本地程序数据。你可以将其放在组件之外：

```js
if (typeof window !== "undefined") {
  // 检查是否在浏览器中运行
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ……
}
```

这保证了这种逻辑在浏览器加载页面后只运行一次。

#### 不要在 Effect 中执行购买商品一类的操作

有时，即使编写了一个清理函数，也不能避免执行两次 Effect。例如，Effect 包含会发送 POST 请求以执行购买操作：

```js
useEffect(() => {
  // 🔴 错误：此处的 Effect 会在开发环境中执行两次，这在代码中是有问题的。
  fetch("/api/buy", { method: "POST" });
}, []);
```

一方面，开发环境下，Effect 会执行两次，这意味着购买操作执行了两次，但是这并非是预期的结果，所以不应该把这个业务逻辑放在 Effect 中。另一方面，如果用户转到另一个页面，然后按“后退”按钮回到了这个界面，该怎么办？Effect 会随着组件再次挂载而再次执行。所以，当用户重新访问某个页面时，不应当执行购买操作；当只有用户点击“购买”按钮时，才执行购买操作。

因此，“购买”的操作不应由组件的挂载、渲染引起的；它是由特定的交互作用引起的，它应该只在用户按下按钮时运行。因此，它不应该写在 Effect 中，应当把 /api/buy 请求操作移动到购买按钮事件处理程序中：

```js
function handleClick() {
  // ✅ 购买商品应当在事件中执行，因为这是由特定的操作引起的。
  fetch("/api/buy", { method: "POST" });
}
```

**这个例子说明如果重新挂载破坏了应用程序的逻辑，则通常含有未被发现的错误**。从用户的角度来看，访问一个页面不应该与访问它、点击链接然后按下返回键再次查看页面有什么不同。React 通过在开发环境中重复挂载组件以验证组件是否遵守此原则。

### \*每一轮渲染都有自己的 Effect（总结）

1. **即使有清理函数，也执行清理函数而已。但每个 Effect 回调函数，在 commit 阶段都会执行的** ✅。
   - 示例中：现在编辑输入框，输入 abc。如果输入速度足够快，你会看到 安排 "ab" 日志，紧接着的是 取消 "ab" 日志 和 安排 "abc" 日志。
   - 就解释了，为什么 安排 "xx" 没有被清理掉，Effect 回调函数每次渲染都会执行的，只是如果有清理函数，会执行同一个 Effect 的上一轮渲染的 Effect 的清理函数。
2. 有清理函数：

   1. **React 总是在执行下一轮渲染的 Effect 之前，执行上一轮渲染的 Effect 的清理函数。**
   2. 组件卸载时，会执行同一个 Effect 的最后一轮渲染的 Effect 的清理函数。

3. **闭包问题**，useEffect 的回调函数，以及里面 setTimeout 回调函数，都会用到外层函数组件作用域的变量。
4. **注释掉清理函数**：
   这样安排操作就不会被取消。尝试快速输入 abcde：
   三秒后，你应该看到一系列日志：a、ab、abc、abcd 与 abcde，而不是五个 abcde。每个 Effect 都会“捕获”其对应渲染的 text 值。text state 发生变化并不重要：来自 text = 'ab' 的渲染的 Effect 始终会得到 'ab'。换句话说，每个渲染的 Effect 都是相互隔离的。如果你对这是如何工作的感到好奇，你可以阅读有关 闭包 的内容。
5. 。

```js
import { useState, useEffect } from "react";

function Playground() {
  const [text, setText] = useState("a");

  useEffect(() => {
    function onTimeout() {
      console.log("⏰ " + text);
    }

    console.log('🔵 安排 "' + text + '" 日志');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 取消 "' + text + '" 日志');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        日志内容：{" "}
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? "卸载" : "挂载"} 组件
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

## 你可能不需要 Effect

Effect 是 React 范式中的一种脱围机制。它们让你可以 “逃出” React 并使组件和一些外部系统同步，比如非 React 组件、网络和浏览器 DOM。如果没有涉及到外部系统（例如，你想根据 props 或 state 的变化来更新一个组件的 state），你就不应该使用 Effect。移除不必要的 Effect 可以让你的代码更容易理解，运行得更快，并且更少出错。

### \*如何移除不必要的 Effect

有两种不必使用 Effect 的常见情况：

1. **你不必使用 Effect 来转换渲染所需的数据**。（使用函数思维处理，改变 state 或 props 会重新渲染函数，此时函数里直接处理）（新词：在渲染期间计算 ✅）
   - 通过添加 key 来重置所有 state，或者 在渲染期间计算所需内容。
2. **你不必使用 Effect 来处理用户事件**。（用户触发的事件，通过事件函数处理）

:::info

- **Effect 是 React 范式中的一种脱围机制。处理副作用的，如果没有副作用就不应用使用。✅**
- **尽可能在渲染期间进行计算，以及在事件处理函数中调整 state**。
  :::

#### 根据 props 或 state 来更新 state

**如果一个值可以基于现有的 props 或 state 计算得出，不要把它作为一个 state，而是在渲染期间直接计算这个值。** （函数思维 ✅）（也算是计算属性，但每次都计算）

#### 缓存昂贵的计算

```js
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState("");

  // 🔴 避免：多余的 state 和不必要的 Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

就像之前的例子一样，这既没有必要，也很低效。首先，移除 state 和 Effect：

```js
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState("");
  // ✅ 如果 getFilteredTodos() 的耗时不长，这样写就可以了。
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

如果，getFilteredTodos() 的耗时可能会很长，可以使用 useMemo Hook 缓存，这会告诉 React，除非 todos 或 filter 发生变化，否则不要重新执行传入的函数。

```js
import { useMemo, useState } from "react";

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState("");
  const visibleTodos = useMemo(() => {
    // ✅ 除非 todos 或 filter 发生变化，否则不会重新执行
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

如何判断计算是昂贵的？https://zh-hans.react.dev/learn/you-might-not-need-an-effect#how-to-tell-if-a-calculation-is-expensive

#### 当 props 变化时重置所有 state

在 userId 变化时，清除 comment 变量：

```js
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState("");

  // 🔴 避免：当 prop 变化时，在 Effect 中重置 state
  useEffect(() => {
    setComment("");
  }, [userId]);
  // ...
}
```

取而代之的是，你可以通过为每个用户的个人资料组件提供一个明确的键来告诉 React 它们原则上是 不同 的个人资料组件。将你的组件拆分为两个组件，并从外部的组件传递一个 key 属性给内部的组件：

```js
export default function ProfilePage({ userId }) {
  return <Profile userId={userId} key={userId} />;
}

function Profile({ userId }) {
  // ✅ 当 key 变化时，该组件内的 comment 或其他 state 会自动被重置
  const [comment, setComment] = useState("");
  // ...
}
```

通常，当在相同的位置渲染相同的组件时，React 会保留状态。**通过将 userId 作为 key 传递给 Profile 组件，使 React 将具有不同 userId 的两个 Profile 组件视为两个不应共享任何状态的不同组件**。每当 key（这里是 userId）变化时，React 将重新创建 DOM，并 重置 Profile 组件和它的所有子组件的 state。现在，当在不同的个人资料之间导航时，comment 区域将自动被清空。

（这和 Vue 解决问题思路完全不一样，Vue 可能用 watch ✅）

#### \*当 prop 变化时调整部分 state

（这个场景很好，全文摘下来了）

有时候，当 prop 变化时，你可能只想重置或调整部分 state ，而不是所有 state。

List 组件接收一个 items 列表作为 prop，然后用 state 变量 selection 来保持已选中的项。当 items 接收到一个不同的数组时，你想将 selection 重置为 null：

```js
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 避免：当 prop 变化时，在 Effect 中调整 state
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

这不太理想。每当 items 变化时，List 及其子组件会先使用旧的 selection 值渲染。然后 React 会更新 DOM 并执行 Effect。最后，**调用 setSelection(null) 将导致 List 及其子组件重新渲染，重新启动整个流程**。

让我们从删除 Effect 开始。取而代之的是在渲染期间直接调整 state：

```js
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 好一些：在渲染期间调整 state
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

像这样 存储前序渲染的信息 可能很难理解，但它比在 Effect 中更新这个 state 要好。上面的例子中，在渲染过程中直接调用了 setSelection。当它执行到 return 语句退出后，React 将 立即 重新渲染 List。此时 React 还没有渲染 List 的子组件或更新 DOM，这使得 List 的子组件可以跳过渲染旧的 selection 值。（这个方案是在渲染期间更新 state）

在渲染期间更新组件时，React 会丢弃已经返回的 JSX 并立即尝试重新渲染。为了避免非常缓慢的级联重试，React 只允许在渲染期间更新 同一 组件的状态。如果你在渲染期间更新另一个组件的状态，你会看到一条报错信息。条件判断 items !== prevItems 是必要的，它可以避免无限循环。你可以像这样调整 state，但任何其他副作用（比如变化 DOM 或设置的延时）应该留在事件处理函数或 Effect 中，以 保持组件纯粹。（**渲染期间更新 state，不好** ✅）

虽然这种方式比 Effect 更高效，但大多数组件也不需要它。**无论你怎么做，根据 props 或其他 state 来调整 state 都会使数据流更难理解和调试**。**总是检查是否可以通过添加 key 来重置所有 state，或者 在渲染期间计算所需内容**。例如，你可以存储已选中的 item ID 而不是存储（并重置）已选中的 item：

```js
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ 非常好：在渲染期间计算所需内容
  const selection = items.find((item) => item.id === selectedId) ?? null;
  // ...
}
```

现在完全不需要 “调整” state 了。如果包含已选中 ID 的项出现在列表中，则仍然保持选中状态。如果没有找到匹配的项，则在渲染期间计算的 selection 将会是 null。行为不同了，但可以说更好了，因为大多数对 items 的更改仍可以保持选中状态。（**还转换为 在渲染期间计算** ✅）

#### 在事件处理函数中共享逻辑

**当你不确定某些代码应该放在 Effect 中还是事件处理函数中时，先自问 为什么 要执行这些代码。Effect 只用来执行那些显示给用户时组件 需要执行 的代码**。在这个例子中，通知应该在用户 按下按钮 后出现，而不是因为页面显示出来时！删除 Effect 并将共享的逻辑放入一个被两个事件处理程序调用的函数中。

#### 发送 POST 请求

当你决定将某些逻辑放入事件处理函数还是 Effect 中时，你需要回答的主要问题是：从用户的角度来看它是 怎样的逻辑。如果这个逻辑是由某个特定的交互引起的，请将它保留在相应的事件处理函数中。如果是由用户在屏幕上 看到 组件时引起的，请将它保留在 Effect 中。

```js
function Form() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // ✅ 非常好：这个逻辑应该在组件显示时执行
  useEffect(() => {
    post("/analytics/event", { eventName: "visit_form" });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ 非常好：事件特定的逻辑在事件处理函数中处理
    post("/api/register", { firstName, lastName });
  }
  // ...
}
```

#### 链式计算

这段代码里有两个问题。（代码看文档吧）

一个问题是它非常低效：在链式的每个 set 调用之间，组件（及其子组件）都不得不重新渲染。在上面的例子中，**在最坏的情况下（setCard → 渲染 → setGoldCardCount → 渲染 → setRound → 渲染 → setIsGameOver → 渲染）有三次不必要的重新渲染**。

即使不考虑渲染效率问题，随着代码不断扩展，你会遇到这条 “链式” 调用不符合新需求的情况。

在这个例子中，更好的做法是：**尽可能在渲染期间进行计算，以及在事件处理函数中调整 state**✅：

```js
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ 尽可能在渲染期间进行计算
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('游戏已经结束了。');
    }

    // ✅ 在事件处理函数中计算剩下的所有 state
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('游戏结束！');
        }
      }
    }
  }

  // ...
```

#### 初始化应用

注意：开发环境会执行两次。

#### 通知父组件有关 state 变化的信息

（代码看文档吧）

和之前一样，这不太理想。Toggle 首先更新它的 state，然后 React 会更新屏幕。然后 React 执行 Effect 中的代码，调用从父组件传入的 onChange 函数。现在父组件开始更新它自己的 state，开启另一个渲染流程。更好的方式是在单个流程中完成所有操作。

删除 Effect，并在同一个事件处理函数中更新 两个 组件的 state。

**通过这种方式，Toggle 组件及其父组件都在事件处理期间更新了各自的 state。React 会 批量 处理来自不同组件的更新，所以只会有一个渲染流程**。

你也可以完全移除该 state，并从父组件中接收 isOn。“状态提升” 允许父组件通过切换自身的 state 来完全控制 Toggle 组件。

#### 将数据传递给父组件

当子组件在 Effect 中更新其父组件的 state 时，数据流变得非常难以追踪。既然子组件和父组件都需要相同的数据，那么可以让父组件获取那些数据，并将其 向下传递 给子组件。

这更简单，并且可以保持数据流的可预测性：数据从父组件流向子组件。

#### 订阅外部 store

https://zh-hans.react.dev/reference/react/useSyncExternalStore

#### 获取数据

许多应用使用 Effect 来发起数据获取请求。像这样在 Effect 中写一个数据获取请求是相当常见的：

你 **不需要 把这个数据获取逻辑迁移到一个事件处理函数中**。

这可能看起来与之前需要将逻辑放入事件处理函数中的示例相矛盾！但是，**考虑到这并不是 键入事件**，这是在这里获取数据的主要原因。搜索输入框的值经常从 URL 中预填充，用户可以在不关心输入框的情况下导航到后退和前进页面。

page 和 query 的来源其实并不重要。**只要该组件可见，你就需要通过当前 page 和 query 的值，保持 results 和网络数据的 同步。这就是为什么这里是一个 Effect 的原因**。

然而，上面的代码有一个问题。假设你快速地输入 “hello”。那么 query 会从 “h” 变成 “he”，“hel”，“hell” 最后是 “hello”。这会触发一连串不同的数据获取请求，但无法保证对应的返回顺序。例如，“hell” 的响应可能在 “hello” 的响应 之后 返回。由于它的 setResults() 是在最后被调用的，你将会显示错误的搜索结果。这种情况被称为 “竞态条件”：两个不同的请求 “相互竞争”，并以与你预期不符的顺序返回。

**为了修复这个问题，你需要添加一个 清理函数 来忽略较早的返回结果**：

```js
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then((json) => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true; // 通常通过 忽略其结果 的方式，清除状态数据赋值✅
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

这确保了当你在 Effect 中获取数据时，**除了最后一次请求的所有返回结果都将被忽略**。

处理竞态条件并不是实现数据获取的唯一难点。你可能还需要考虑缓存响应结果（使用户点击后退按钮时可以立即看到先前的屏幕内容），如何在服务端获取数据（使服务端初始渲染的 HTML 中包含获取到的内容而不是加载动画），以及如何避免网络瀑布（使子组件不必等待每个父组件的数据获取完毕后才开始获取数据）。

这些问题适用于任何 UI 库，而不仅仅是 React。解决这些问题并不容易，这也是为什么现代 框架 提供了比在 Effect 中获取数据更有效的内置数据获取机制的原因。

如果你不使用框架（也不想开发自己的框架），但希望使从 Effect 中获取数据更符合人类直觉，请考虑像这个例子一样，将获取逻辑提取到一个自定义 Hook 中：

```js
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

你可能还想添加一些错误处理逻辑以及跟踪内容是否处于加载中。你可以自己编写这样的 Hook，也可以使用 React 生态中已经存在的许多解决方案。虽然仅仅使用自定义 Hook 不如使用框架内置的数据获取机制高效，但将数据获取逻辑移动到自定义 Hook 中将使后续采用高效的数据获取策略更加容易。

一般来说，当你不得不编写 Effect 时，请留意是否可以将某段功能提取到专门的内置 API 或一个更具声明性的自定义 Hook 中，比如上面的 useData。你会发现组件中的原始 useEffect 调用越少，维护应用将变得更加容易。

#### 摘要

- 如果你可以在渲染期间计算某些内容，则不需要使用 Effect。
- 想要缓存昂贵的计算，请使用 useMemo 而不是 useEffect。
- 想要重置整个组件树的 state，请传入不同的 key。
- 想要在 prop 变化时重置某些特定的 state，请在渲染期间处理。
- 组件 显示 时就需要执行的代码应该放在 Effect 中，否则应该放在事件处理函数中。
- 如果你需要更新多个组件的 state，最好在单个事件处理函数中处理。
- 当你尝试在不同组件中同步 state 变量时，请考虑状态提升。
- 你可以使用 Effect 获取数据，但你需要实现清除逻辑以避免竞态条件。

## 响应式 Effect 的生命周期

**Effect 与组件有不同的生命周期。组件可以挂载、更新或卸载。Effect 只能做两件事：开始同步某些东西，然后停止同步它。如果 Effect 依赖于随时间变化的 props 和 state，这个循环可能会发生多次** 。（Effect 核心运行规则 ✅）

### Effect 的生命周期

每个 React 组件都经历相同的生命周期：

- 当组件被添加到屏幕上时，它会进行组件的 挂载。
- 当组件接收到新的 props 或 state 时，通常是作为对交互的响应，它会进行组件的 更新。
- 当组件从屏幕上移除时，它会进行组件的 卸载。

**这是一种很好的思考组件的方式，但并不适用于 Effect。相反，尝试从组件生命周期中跳脱出来，独立思考 Effect。Effect 描述了如何将外部系统与当前的 props 和 state 同步**✅。随着代码的变化，同步的频率可能会增加或减少。

你可能会直观地认为当组件挂载时 React 会 开始同步，而当组件卸载时会 停止同步。然而，事情并没有这么简单！有时，在组件保持挂载状态的同时，**可能还需要 多次开始和停止同步**。

让我们来看看 为什么 这是必要的、何时 会发生以及 如何 控制这种行为。

#### 为什么同步可能需要多次进行

#### React 如何重新同步 Effect

#### 从 Effect 的角度思考

让我们总结一下从 ChatRoom 组件的角度所发生的一切：

1. ChatRoom 组件挂载，roomId 设置为 "general"
2. ChatRoom 组件更新，roomId 设置为 "travel"
3. ChatRoom 组件更新，roomId 设置为 "music"
4. ChatRoom 组件卸载

在组件生命周期的每个阶段，Effect 执行了不同的操作：

1. Effect 连接到了 "general" 聊天室
2. Effect 断开了与 "general" 聊天室的连接，并连接到了 "travel" 聊天室
3. Effect 断开了与 "travel" 聊天室的连接，并连接到了 "music" 聊天室
4. Effect 断开了与 "music" 聊天室的连接

现在让我们从 Effect 本身的角度来思考所发生的事情：

```js
useEffect(() => {
  // Effect 连接到了通过 roomId 指定的聊天室...
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => {
    // ...直到它断开连接
    connection.disconnect();
  };
}, [roomId]);
```

这段代码的结构可能会将所发生的事情看作是一系列不重叠的时间段：

1. Effect 连接到了 "general" 聊天室（直到断开连接）
2. Effect 连接到了 "travel" 聊天室（直到断开连接）
3. Effect 连接到了 "music" 聊天室（直到断开连接）

**之前，你是从组件的角度思考的。当你从组件的角度思考时，很容易将 Effect 视为在特定时间点触发的“回调函数”或“生命周期事件”，例如“渲染后”或“卸载前”。这种思维方式很快变得复杂，所以最好避免使用**。

**相反，始终专注于单个启动/停止周期。无论组件是挂载、更新还是卸载，都不应该有影响。只需要描述如何开始同步和如何停止。如果做得好，Effect 将能够在需要时始终具备启动和停止的弹性**。✅

这可能会让你想起当编写创建 JSX 的渲染逻辑时，并不考虑组件是挂载还是更新。描述的是应该显示在屏幕上的内容，而 React 会 解决其余的问题。

#### React 如何验证 Effect 可以重新进行同步

**React 通过在开发环境中立即强制 Effect 重新进行同步来验证其是否能够重新同步。这可能让你想起打开门并额外关闭它以检查门锁是否有效的情景。React 在开发环境中额外启动和停止 Effect 一次，以检查 是否正确实现了它的清理功能**。✅

#### React 如何知道需要重新进行 Effect 的同步

如果在初始渲染时传递了 ["general"]，然后在下一次渲染时传递了 ["travel"]，React 将比较 "general" 和 "travel"。这些是不同的值（使用 Object.is 进行比较），因此 React 将重新同步 Effect。另一方面，如果组件重新渲染但 roomId 没有发生变化，Effect 将继续连接到相同的房间。

#### \*每个 Effect 表示一个独立的同步过程

代码中的每个 Effect 应该代表一个独立的同步过程。

在上面的示例中，删除一个 Effect 不会影响另一个 Effect 的逻辑。这表明它们同步不同的内容，因此将它们拆分开是有意义的。另一方面，如果将一个内聚的逻辑拆分成多个独立的 Effects，代码可能会看起来更加“清晰”，但 维护起来会更加困难。这就是为什么你应该考虑这些过程是相同还是独立的，而不是只考虑代码是否看起来更整洁。

### Effect 会“响应”于响应式值

#### 没有依赖项的 Effect 的含义

现在 Effect 的代码不使用任何响应式值，因此它的依赖可以是空的 ([])。

从组件的角度来看，空的 [] 依赖数组意味着这个 Effect 仅在组件挂载时连接到聊天室，并在组件卸载时断开连接。（请记住，在开发环境中，React 仍会 额外执行一次 来对逻辑进行压力测试。）

然而，**如果你 从 Effect 的角度思考，根本不需要考虑挂载和卸载**。重要的是，你已经指定了 Effect 如何开始和停止同步。目前，它没有任何响应式依赖。但是，如果希望用户随时间改变 roomId 或 serverUrl（它们将变为响应式），Effect 的代码不需要改变。只需要将它们添加到依赖项中即可。

#### 在组件主体中声明的所有变量都是响应式的

Props 和 state 并不是唯一的响应式值。**从它们计算出的值也是响应式的**。如果 props 或 state 发生变化，组件将重新渲染，从中计算出的值也会随之改变。这就是为什么 Effect 使用的组件主体中的所有变量都应该在依赖列表中。

假设用户可以在下拉菜单中选择聊天服务器，但他们还可以在设置中配置默认服务器。假设你已经将设置状态放入了 上下文，因此从该上下文中读取 settings。现在，可以根据 props 中选择的服务器和默认服务器来计算 serverUrl：

这个例子中，serverUrl 不是 prop 或 state 变量。**它是在渲染过程中计算的普通变量。但是它是在渲染过程中计算的，所以它可能会因为重新渲染而改变。这就是为什么它是响应式的**。

**组件内部的所有值（包括 props、state 和组件体内的变量）都是响应式的。任何响应式值都可以在重新渲染时发生变化，所以需要将响应式值包括在 Effect 的依赖项中**。

换句话说，Effect 对组件体内的所有值都会“react”。

#### 全局变量或可变值可以作为依赖项吗？

**可变值（包括全局变量）不是响应式的**。

例如，像 location.pathname 这样的可变值不能作为依赖项。它是可变的，因此可以在 React 渲染数据流之外的任何时间发生变化。更改它不会触发组件的重新渲染。因此，即使在依赖项中指定了它，React 也无法知道在其更改时重新同步 Effect。这也违反了 React 的规则，因为在渲染过程中读取可变数据（即在计算依赖项时）会破坏 纯粹的渲染。相反，应该使用 useSyncExternalStore 来读取和订阅外部可变值。

另外，**像 ref.current 或从中读取的值也不能作为依赖项**。useRef 返回的 ref 对象本身可以作为依赖项，但其 current 属性是有意可变的。它允许 跟踪某些值而不触发重新渲染。但由于更改它不会触发重新渲染，它不是响应式值，React 不会知道在其更改时重新运行 Effect。

#### React 会验证是否将每个响应式值都指定为了依赖项

在某些情况下，React 知道 一个值永远不会改变，即使它在组件内部声明。

例如，**从 useState 返回的 set 函数**✅ 和从 useRef 返回的 ref 对象是 稳定的 ——它们保证在重新渲染时不会改变。稳定值不是响应式的，因此可以从列表中省略它们。包括它们是允许的：它们不会改变，所以无关紧要。

**避免将对象和函数作为依赖项。如果在渲染过程中创建对象和函数，然后在 Effect 中读取它们，它们将在每次渲染时都不同。这将导致 Effect 每次都重新同步**。

#### 当你不想进行重新同步时该怎么办

1. 可以将它们移到组件外部。现在它们不需要成为依赖项。
2. 也可以将它们 移动到 Effect 内部。它们不是在渲染过程中计算的，因此它们不是响应式的。

Effect 是一段响应式的代码块。它们在读取的值发生变化时重新进行同步。与事件处理程序不同，事件处理程序只在每次交互时运行一次，而 Effect 则在需要进行同步时运行。

#### 摘要

- 组件可以挂载、更新和卸载。
- 每个 Effect 与周围组件有着独立的生命周期。
- 每个 Effect 描述了一个独立的同步过程，可以 开始 和 停止。
- 在编写和读取 Effect 时，要独立地考虑每个 Effect（如何开始和停止同步），而不是从组件的角度思考（如何挂载、更新或卸载）。
- 在组件主体内声明的值是“响应式”的。
- 响应式值应该重新进行同步 Effect，因为它们可以随着时间的推移而发生变化。
- 检查工具验证在 Effect 内部使用的所有响应式值都被指定为依赖项。
- 检查工具标记的所有错误都是合理的。总是有一种方法可以修复代码，同时不违反规则。

#### 尝试一些挑战

5 个示例都不错。

## 将事件从 Effect 中分开

...

### 在事件处理函数和 Effect 中做选择

...

#### 事件处理函数只在响应特定的交互操作时运行

...

#### 每当需要同步，Effect 就会运行

...

### \*响应式值和响应式逻辑

...

#### 事件处理函数内部的逻辑是非响应式的

...

#### Effect 内部的逻辑是响应式的

...

### 从 Effect 中提取非响应式逻辑

...

#### \*声明一个 Effect Event

（**useEffectEvent 是配合 useEffect 使用** ✅）

**使用 useEffectEvent 这个特殊的 Hook 从 Effect 中提取非响应式逻辑 ✅**。

这里的 onConnected 被称为 **Effect Event。它是 Effect 逻辑的一部分，但是其行为更像事件处理函数。它内部的逻辑不是响应式的，而且能一直“看见”最新的 props 和 state✅**。

现在你可以在 Effect 内部调用 onConnected Effect Event：

```js
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 声明所有依赖项（✅解决依赖theme的问题，文档中有）
  // ...
```

这个方法解决了问题。注意你必须从 Effect 依赖项中 移除 onConnected。Effect Event 是非响应式的并且必须从依赖项中删除。

**你可以将 Effect Event 看成和事件处理函数相似的东西。主要区别是事件处理函数只在响应用户交互的时候运行，而 Effect Event 是你在 Effect 中触发的。Effect Event 让你在 Effect 响应性和不应是响应式的代码间“打破链条”**。

#### 使用 Effect Event 读取最新的 props 和 state

每个 URL 代表不同的页面。换言之，logVisit 调用对于 url 应该 是响应式的。

现在假设你想在每次页面访问中包含购物车中的商品数量。

你在 Effect 内部使用了 numberOfItems，所以代码检查工具会让你把它加到依赖项中。但是，你 不 想要 logVisit 调用响应 numberOfItems。如果用户把某样东西放入购物车， numberOfItems 会变化，这 并不意味着 用户再次访问了这个页面。换句话说，在某种意义上，访问页面 是一个“事件”。它发生在某个准确的时刻。

将代码分割为两部分：

```js
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent((visitedUrl) => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ 声明所有依赖项
  // ...
}
```

这里的 onVisit 是一个 Effect Event。里面的代码不是响应式的。这就是为什么你可以使用 numberOfItems（或者任意响应式值！）而不用担心引起周围代码因为变化而重新执行。

另一方面，Effect 本身仍然是响应式的。其内部的代码使用了 url props，所以每次因为不同的 url 重新渲染后 Effect 都会重新运行。这会依次调用 onVisit 这个 Effect Event。

结果是你会因为 url 的变化去调用 logVisit，并且读取的一直都是最新的 numberOfItems。但是如果 numberOfItems 自己变化，不会引起任何代码的重新运行。

#### \*如果 Effect 内部有一些异步逻辑

```js
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent((url) => {
    logVisit(url, numberOfItems); // useEffect 闭包回调保存了上一次的 url✅）
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // 延迟记录访问
  }, [url]);
}
```

**在这里，onVisit 内的 url 对应 最新的 url（可能已经变化了），但是 visitedUrl 对应的是最开始引起这个 Effect（并且是本次 onVisit 调用）运行的 url **。

#### \*初始化监听

```js
export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
```

#### \*Effect Event 的局限性

Effect Event 的局限性在于你如何使用他们：

- **只在 Effect 内部调用他们 ✅**。
- **永远不要把他们传给其他的组件或者 Hook✅**。

例如不要像这样声明和传递 Effect Event：

**Effect Event 是 Effect 代码的非响应式“片段”。他们应该在使用他们的 Effect 的旁边 ✅**。

### \*摘要

- 事件处理函数在响应特定交互时运行。
- Effect 在需要同步的时候运行。
- 事件处理函数内部的逻辑是非响应式的。
- Effect 内部的逻辑是响应式的。
- 你可以将非响应式逻辑从 Effect 移到 Effect Event 中。
- 只在 Effect 内部调用 Effect Event。
- 不要将 Effect Event 传给其他组件或者 Hook。

### 尝试一些挑战

第 4 个挑战: 修复延迟通知。也是 useEffect 使用异步问题。（**useEffect 闭包回调保存了上一次的 roomId**✅）

## \*移除 Effect 依赖

（**很多实践场景**✅）

### 依赖应该和代码保持一致

...

#### 当要移除一个依赖时，请证明它不是一个依赖

...

#### 要改变依赖，请改变代码

...

### 移除非必需的依赖

...

#### 这段代码应该移到事件处理程序中吗？

...

#### Effect 是否在做几件不相关的事情？

...

#### 是否在读取一些状态来计算下一个状态？

为了解决这个问题，不要在 Effect 里面读取 messages。相反，应该将一个 state 更新函数 传递给 setMessages：

```js
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ 所有依赖已声明
  // ...
```

注意 **Effect 现在根本不读取 messages 变量**。你只需要传递一个更新函数，比如 msgs => [...msgs, receivedMessage]。React 将更新程序函数放入队列 并将在下一次渲染期间向其提供 msgs 参数。这就是 Effect 本身不再需要依赖 messages 的原因。

#### 你想读取一个值而不对其变化做出“反应”吗？

...

#### \*包装来自 props 的事件处理程序

当组件接收事件处理函数作为 props 时，你可能会遇到类似的问题：

```js
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ 所有依赖已声明
  // ...
```

**由于 onReceiveMessage 是依赖，它会导致 Effect 在每次父级重新渲染后重新同步。这将导致聊天重新连接 (要解决的问题 ✅)**。要解决此问题，请用 Effect Event 包裹之后再调用：

（**1. onReceiveMessage 变化还是会重新渲染，但不会引起重新连接了，2. 同时 roomId 改变时会重新渲染重新 useEffect，3. 此时 onReceiveMessage 也是响应最新的函数 ✅**。）

```js
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ 所有依赖已声明
  // ...
```

Effect Events 不是响应式的，因此你不需要将它们指定为依赖。因此，即使父组件传递的函数在每次重新渲染时都不同，聊天也将不再重新连接。

#### \*|分离响应式和非响应式代码

在此示例中，你希望在每次 roomId 更改时记录一次。你希望在每个日志中包含当前的 notificationCount，但你 不 希望通过更改 notificationCount 来触发日志事件。

**解决方案还是将非响应式代码拆分，将其放到 Effect Event 内：✅**

```js
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent((visitedRoomId) => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ 所有依赖已声明
  // ...
}
```

**你希望逻辑对 roomId 做出响应，因此你在 Effect 中读取 roomId。但是，你不希望更改 notificationCount 来记录额外的日志输出，因此你可以在 Effect Event 中读取 notificationCount✅**。

#### \*一些响应式值是否无意中改变了？

（**对象和函数等引用类型的变量，作为 Effect 依赖**✅）

**当组件重新渲染时，其中的代码会从头开始重新运行**。

```js
const serverUrl = 'xxx';
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // 暂时禁用 linter 以演示问题
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);
```

**在每次重新渲染 ChatRoom 组件时，都会从头开始创建一个新的 options 对象。React 发现 options 对象与上次渲染期间创建的 options 对象是 不同的对象**。这就是为什么它会重新同步 Effect（依赖于 options）

**此问题仅影响对象和函数。在 JavaScript 中，每个新创建的对象和函数都被认为与其他所有对象和函数不同。即使他们的值相同也没关系！**

**对象和函数作为依赖，会使 Effect 比你需要的更频繁地重新同步。**

**这就是为什么你应该尽可能避免将对象和函数作为 Effect 的依赖。所以，尝试将它们移到组件外部、Effect 内部，或从中提取原始值**。

**将静态对象和函数移出组件（解决方案 1）**

1. 如果该对象不依赖于任何 props 和 state，你可以将该对象移到组件之外，它不会因为重新渲染而改变，所以它不是依赖。现在重新渲染 ChatRoom 不会导致 Effect 重新同步。

2. 这也适用于函数场景，由于 createOptions 是在组件外部声明的，因此它不是响应式值。这就是为什么它不需要在 Effect 的依赖中指定，以及为什么它永远不会导致 Effect 重新同步。（**关键是 createOptions()在 useEffect 里调用的 ✅**）

```js
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: '音乐'
};
// 或者
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: '音乐'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 所有依赖已声明
  // ...
```

**将动态对象和函数移动到 Effect 中（解决方案 2）**

1. **在 Effect 内部 创建它们**，现在 options 已在 Effect 中声明，它不再是 Effect 的依赖。相反，Effect 使用的唯一响应式值是 roomId。

```js
const serverUrl = 'xxx';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 所有依赖已声明
  // ...
```

2. **这也适用于函数的场景，只要将这些函数声明在 Effect 内部，它们就不是响应式值，因此它们也不是 Effect 的依赖**。

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 所有依赖已声明
  // ...
```

**从对象中读取原始值（解决方案 3）**

有时，你可能会通过 props 接收到类型为对象的值。

要解决此问题，请从 Effect 外部 读取对象信息（**解构对象**），并避免依赖对象和函数类型：

```js
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 所有依赖已声明
  // ...
```

同样的方法也适用于函数。这仅适用于 纯 函数，因为它们在渲染期间可以安全调用。如果函数是一个事件处理程序，但你不希望它的更改重新同步 Effect，将它包装到 Effect Event 中。

```js
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 所有依赖已声明
  // ...
```

### |摘要

- 依赖应始终与代码匹配。
- 当你对依赖不满意时，你需要编辑的是代码。
- 抑制 linter 会导致非常混乱的错误，你应该始终避免它。
- 要移除依赖，你需要向 linter “证明”它不是必需的。
- 如果某些代码是为了响应特定交互，请将该代码移至事件处理的地方。
- 如果 Effect 的不同部分因不同原因需要重新运行，请将其拆分为多个 Effect。
- 如果你想根据以前的状态更新一些状态，传递一个更新函数。
- 如果你想读取最新值而不“反应”它，请从 Effect 中提取出一个 Effect Event。
- 在 JavaScript 中，如果对象和函数是在不同时间创建的，则它们被认为是不同的。
- **尽量避免对象和函数依赖。将它们移到组件外或 Effect 内 ✅**。

### |尝试一些挑战

4 个挑战场景都很实用。

#### |第 1 个挑战: 修复重置 interval

这个 Effect 设置了一个每秒运行的 interval。你已经注意到一些奇怪的事情：似乎每次 interval 都会被销毁并重新创建。修复代码，使 interval 不会被不断重新创建。

```js
export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("✅ 创建定时器");
    const id = setInterval(() => {
      console.log("⏰ Interval");
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log("❌ 清除定时器");
      clearInterval(id);
    };
  }, [count]);

  return <h1>计数器: {count}</h1>;
}
```

**你想要从 Effect 内部将 count 状态更新为 count + 1。但是，这会使 Effect 依赖于 count，它会随着每次滴答而变化，这就是为什么 interval 会在每次滴答时重新创建**。（**注意：这里每次 count 加 1 计算式正确的，只是 interval 销毁重建的问题**。✅）

要解决这个问题，请使用 更新函数 并编写 setCount(c => c + 1) 而不是 setCount(count + 1):

```js
import { useState, useEffect } from "react";

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("✅ 创建定时器");
    const id = setInterval(() => {
      console.log("⏰ Interval");
      setCount((c) => c + 1);
    }, 1000);
    return () => {
      console.log("❌ 清除定时器");
      clearInterval(id);
    };
  }, []);

  return <h1>计数器: {count}</h1>;
}
```

译注：
在创建 onTick 函数时，由于闭包的缘故，setCount(count + increment) 捕获的是创建时 count 和 increment 值。

#### |第 2 个挑战: 修复重新触发动画的问题

```js
function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);
```

Effect 需要读取 duration 的最新值，但你不希望它对 duration 的变化做出“反应”。你使用 duration 来启动动画，但启动动画不是响应式的。将非响应式代码行提取到 Effect Event 中，并从 Effect 中调用该函数

```js
function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration); // animation 还可以作为参数✅
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);
```

#### 第 4 个挑战: 再次修复聊天重新连接的问题

问题代码：

```js
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on("message", (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>欢迎来到 {roomId} 房间！</h1>;
}
```

**主要解决 [createConnection, onMessage] 依赖问题 ✅**，直接上正确答案，更多分析看文档吧：

```js
import { useState, useEffect } from "react";
import { experimental_useEffectEvent as useEffectEvent } from "react";
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from "./chat.js";

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: "https://localhost:1234",
        roomId: roomId,
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on("message", (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>欢迎来到 {roomId} 房间！</h1>;
}
```
