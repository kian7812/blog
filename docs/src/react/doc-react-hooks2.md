# Hooks 详解和实践（文档）

- 官方：https://zh-hans.react.dev/ 多看文档 ✅
- 包括：useDeferredValue useTransition useSyncExternalStore useId useDebugValue
- 新版 18/19 的区别

## |useDeferredValue

:::info
**根据文档示例，主要场景：用户事件改变了 state，延迟 state 触发的部分重新渲染，可理解为交互优化，降低部分渲染优先级；可替换防抖、节流 ✅👍🏻**
:::

useDeferredValue 是一个 React Hook，可以让你延迟更新 UI 的某些部分。

### |参考

const deferredValue = useDeferredValue(value, initialValue?)

**参数**

1. value: 你想延迟的值，可以是任何类型。
2. 仅 Canary 可选 initialValue ：在组件初始渲染期间使用的值。如果省略此选项， useDeferredValue 在初始渲染期间将不会延迟，因为它没有可以渲染的 value 的先前版本。（initialValue 是作为初始渲染后的重新渲染的 value ✅）

**返回值**

- currentValue ：在初始渲染期间，返回的延迟值将与您提供的值相同。在更新期间，React 将首先尝试使用旧值重新渲染（因此它将返回旧值），然后在后台尝试使用新值进行另一次重新渲染（因此它将返回更新后的值）。
- 在最新的 React Canary 版本中， useDeferredValue 在初始渲染时返回 initialValue ，并在返回 value 的情况下安排在后台重新渲染。

**注意事项**

- 当更新位于 Transition 内时， useDeferredValue 始终返回新的 value 并且不会生成延迟渲染，因为更新已经延迟。
- 您传递给 useDeferredValue 的值应该是原始值（如字符串和数字）或在渲染之外创建的对象。如果您在渲染期间创建一个新对象并立即将其传递给 useDeferredValue ，则每次渲染时它都会有所不同，从而导致不必要的背景重新渲染。
- 当 useDeferredValue 接收到与之前不同的值（使用 Object.is 进行比较）时，除了当前渲染（此时它仍然使用旧值），它还会安排一个后台重新渲染。这个后台重新渲染是可以被中断的，如果 value 有新的更新，React 会从头开始重新启动后台渲染。举个例子，如果用户在输入框中的输入速度比接收延迟值的图表重新渲染的速度快，那么图表只会在用户停止输入后重新渲染。（**应该是前后值不同时才会触发重新后台渲染**✅）
- useDeferredValue 与 `<Suspense>` 集成。如果由于新值引起的后台更新导致 UI 暂停，用户将**不会看到后备方案 ✅**。他们将看到旧的延迟值，直到数据加载完成。
- useDeferredValue 本身并不能阻止额外的网络请求。（✅）
- useDeferredValue 本身不会引起任何固定的延迟。一旦 React 完成原始的重新渲染，它会立即开始使用新的延迟值处理后台重新渲染。由事件（例如输入）引起的任何更新都会中断后台重新渲染，并被优先处理。（**用户事件优先级高优先处理**✅）
- 由 useDeferredValue 引起的后台重新渲染在提交到屏幕之前不会触发 Effect。如果后台重新渲染被暂停，Effect 将在数据加载后和 UI 更新后运行。（？）

### |用法

...

#### |在新内容加载期间显示旧内容

（看文档：结合 Suspense 使用）

##### |如何在内部实现延迟值？

（题 ✅）

你可以将其看成两个步骤：

1. 首先，React 会使用新的 query 值（"ab"）和旧的 deferredQuery 值（仍为 "a"）重新渲染。 传递给结果列表的 deferredQuery 值是延迟的，它“滞后于” query 值。

2. 在后台，React 尝试重新渲染，并将 query 和 deferredQuery 两个值都更新为 "ab"。 如果此次重新渲染完成，React 将在屏幕上显示它。但是，如果它 suspense（即 "ab" 的结果尚未加载），React 将放弃这次渲染，并在数据加载后再次尝试重新渲染。用户将一直看到旧的延迟值，直到数据准备就绪。

被推迟的“后台”渲染是可中断的。例如，如果你再次在输入框中输入，React 将会中断渲染，并从新值开始重新渲染。React 总是使用最新提供的值。

注意，每次按键仍会发起一个网络请求。这里延迟的是显示结果（直到它们准备就绪），而不是网络请求本身。即使用户继续输入，每个按键的响应都会被缓存，所以按下 Backspace 键是瞬时的，不会再次获取数据。

#### 表明内容已过时

当你开始输入时，旧的结果列表会略微变暗，直到新的结果列表加载完毕。你也可以添加 CSS 过渡来延迟变暗的过程，让用户感受到一种渐进式的过渡，就像下面的例子一样：（**有趣的交互-可实践**✅）

```js
import { Suspense, useState, useDeferredValue } from "react";
import SearchResults from "./SearchResults.js";

export default function App() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div
          style={{
            opacity: isStale ? 0.5 : 1,
            transition: isStale
              ? "opacity 0.2s 0.2s linear"
              : "opacity 0s 0s linear",
          }}
        >
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

#### |延迟渲染 UI 的某些部分

（**看文档：示例和思路 👍🏻，这就是 useDeferredValue 可以调节渲染优先级的作用。可实践** ✅）

想象一下，你有一个文本框和一个组件（例如图表或长列表），在每次按键时都会重新渲染：

```js
function App() {
  const [text, setText] = useState("");
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

首先，我们可以优化 SlowList，使其在 props 不变的情况下跳过重新渲染。只需将其 用 memo 包裹 即可：

```js
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

然而，这仅在 SlowList 的 props 与上一次的渲染时相同才有用。你现在遇到的问题是，当这些 props 不同 时，并且实际上需要展示不同的视觉输出时，页面会变得很慢。

具体而言，**主要的性能问题在于，每次你输入内容时，SlowList 都会接收新的 props，并重新渲染整个树结构，这会让输入感觉很卡顿。使用 useDeferredValue 能够优先更新输入框（必须快速更新），而不是更新结果列表（可以更新慢一些）✅**，从而缓解这个问题：

```js
function App() {
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

**这并没有让 SlowList 的重新渲染变快。然而，它告诉 React 可以将列表的重新渲染优先级降低，这样就不会阻塞按键输入。列表的更新会“滞后”于输入，然后“追赶”上来**。与之前一样，React 会尽快更新列表，但不会阻塞用户输入。（✅👍🏻 优先级降低）

注意：
**这个优化需要将 SlowList 包裹在 memo 中。这是因为每当 text 改变时，React 需要能够快速重新渲染父组件。在重新渲染期间，deferredText 仍然保持着之前的值，因此 SlowList 可以跳过重新渲染（它的 props 没有改变）。如果没有 memo，SlowList 仍会重新渲染，这将使优化失去意义 ✅👍🏻**。

##### |useDeferredValue 和未优化的重新渲染之间的区别

（看文档：**这个优化好明显**✅👍🏻）

#### |延迟一个值与防抖和节流之间有什么不同？

（题 ✅）（比防抖、节流还好用 👍🏻）

在上述的情景中，你可能会使用这两种常见的优化技术：

- 防抖 是指在用户停止输入一段时间（例如一秒钟）之后再更新列表。
- 节流 是指每隔一段时间（例如最多每秒一次）更新列表。

虽然这些技术在某些情况下是有用的，但 useDeferredValue 更适合优化渲染，因为它与 React 自身深度集成，并且能够适应用户的设备。

1. **与防抖或节流不同，useDeferredValue 不需要选择任何固定延迟时间**。如果用户的设备很快（比如性能强劲的笔记本电脑），延迟的重渲染几乎会立即发生并且不会被察觉。如果用户的设备较慢，那么列表会相应地“滞后”于输入，滞后的程度与设备的速度有关。

2. **此外，与防抖或节流不同，useDeferredValue 执行的延迟重新渲染默认是可中断的**。这意味着，如果 React 正在重新渲染一个大型列表，但用户进行了另一次键盘输入，React 会放弃该重新渲染，先处理键盘输入，然后再次开始在后台渲染。相比之下，防抖和节流仍会产生不顺畅的体验，因为它们是阻塞的：它们仅仅是将渲染阻塞键盘输入的时刻推迟了。

如果你要优化的工作不是在渲染期间发生的，那么防抖和节流仍然非常有用。例如，它们可以让你减少网络请求的次数。你也可以同时使用这些技术。

## |useTransition

useTransition 是一个帮助你在不阻塞 UI 的情况下更新状态的 React Hook。

### |参考

const [isPending, startTransition] = useTransition()

**参数：**

useTransition 不需要任何参数。

**返回值：**

useTransition 返回一个由两个元素组成的数组：

1. isPending，告诉你是否存在待处理的 transition。
2. startTransition 函数，你可以使用此方法将状态更新标记为 transition。

#### |startTransition 函数

useTransition 返回的 startTransition 函数允许你**将状态更新标记为 transition**。

**参数：**

- 作用域（scope）：一个通过调用一个或多个 set 函数 更新状态的函数。React 会立即不带参数地调用此函数，并将在 scope 调用期间将所有同步安排的状态更新标记为 transition。它们将是非阻塞的，并且 不会显示不想要的加载指示器。（注意：**1. 立即执行；2. 同步标记状态为 transition；3. 降低更新优先级，非阻塞的** ✅）

**返回值：**

startTransition 不返回任何值。

**注意：**

- useTransition 是一个 Hook，因此只能在组件或自定义 Hook 内部调用。如果需要在其他地方启动 transition（例如从数据库），**请调用独立的 startTransition 函数**。
- **只有在可以访问该状态的 set 函数时，才能将其对应的状态更新包装为 transition**✅。如果你想启用 Transition 以响应某个 prop 或自定义 Hook 值，请尝试使用 useDeferredValue。
- 传递给 startTransition 的函数必须是同步的。**React 会立即执行此函数，并将在其执行期间发生的所有状态更新标记为 transition**✅。如果在其执行期间，尝试稍后执行状态更新（例如在一个定时器中执行状态更新），这些状态更新不会被标记为 transition。
- **标记为 Transition 的状态更新将被其他状态更新打断**。例如在 Transition 中更新图表组件，并在图表组件仍在重新渲染时继续在输入框中输入，React 将首先处理输入框的更新，之后再重新启动对图表组件的渲染工作。（React 更新优先级 ✅）
- Transition 更新不能用于控制文本输入。
- 目前，React 会批处理多个同时进行的 transition。这是一个限制，可能会在未来版本中删除。
- startTransition 不返回任何值。

### |用法

...

#### |将状态更新标记为非阻塞的 Transition

通过 transition，UI 仍将在重新渲染过程中保持响应性。例如用户点击一个选项卡，但改变了主意并点击另一个选项卡，他们可以在不等待第一个重新渲染完成的情况下完成操作。

##### |使用 useTransition 与常规状态更新的区别

- **第 1 个示例 共 2 个挑战**: 在 Transition 中更新当前选项卡
- 第 2 个示例 共 2 个挑战: 在不使用 Transition 的情况下更新当前选项卡

（看文档：点击试试）

#### |在 Transition 中更新父组件

由于父组件的状态更新在 onClick 事件处理程序内，所以该状态更新会被标记为 transition。这就是为什么可以在点击“Posts”后立即点击“Contact”。由于更新选定选项卡被标记为了 transition，因此它不会阻止用户交互。

（看文档：点击试试）

#### |在 Transition 期间显示待处理的视觉状态

你可以使用 useTransition 返回的 isPending 布尔值来向用户表明当前处于 Transition 中。

（看文档：点击试试）

#### |避免不必要的加载指示器

（看文档：与 Suspense 的 fallback 有关）

#### |构建一个 Suspense-enabled 的路由

如果你正在构建一个 React 框架或路由，我们建议将页面导航标记为转换效果。

这么做有两个好处：

- 转换效果是可中断的，这样用户可以在等待重新渲染完成之前点击其他地方。
- 转换效果可以防止不必要的加载指示符，这样用户就可以避免在导航时产生不协调的跳转。

注意：启用 Suspense 的路由默认情况下会将页面导航更新包装为 transition。

（看文档）

### |疑难解答 Troubleshooting

#### |在 Transition 中无法更新输入框内容

不应将控制输入框的状态变量标记为 transition

```js
const [text, setText] = useState("");
// ...
function handleChange(e) {
  // ❌ 不应将受控输入框的状态变量标记为 Transition
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

这是因为 Transition 是非阻塞的，但是在响应更改事件时更新输入应该是同步的。如果想在输入时运行一个 transition，那么有两种做法：

1. 声明两个独立的状态变量：一个用于输入状态（它总是同步更新），另一个用于在 Transition 中更新。这样，便可以使用同步状态控制输入，并将用于 Transition 的状态变量（它将“滞后”于输入）传递给其余的渲染逻辑。
2. 或者使用一个状态变量，并添加 useDeferredValue，它将“滞后”于实际值，并自动触发非阻塞的重新渲染以“追赶”新值。

#### |React 没有将状态更新视为 Transition

当在 Transition 中包装状态更新时，请确保它发生在 startTransition 调用期间：

```js
startTransition(() => {
  // ✅ 在调用 startTransition 中更新状态
  setPage("/about");
});
```

传递给 startTransition 的函数必须是同步的。

你不能像这样将更新标记为 transition：

```js
startTransition(() => {
  // ❌ 在调用 startTransition 后更新状态
  setTimeout(() => {
    setPage("/about");
  }, 1000);
});
```

相反，你可以这样做：

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ 在调用 startTransition 中更新状态
    setPage("/about");
  });
}, 1000);
```

类似地，你不能像这样将更新标记为 transition：

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ 在调用 startTransition 后更新状态
  setPage("/about");
});
```

然而，使用以下方法可以正常工作：

```js
await someAsyncFunction();
startTransition(() => {
  // ✅ 在调用 startTransition 中更新状态
  setPage("/about");
});
```

#### |我想在组件外部调用 useTransition

useTransition 是一个 Hook，因此不能在组件外部调用。请使用独立的 startTransition 方法。它们的工作方式相同，但不提供 isPending 标记。（这也可以 ✅）

#### |我传递给 startTransition 的函数会立即执行

（看文档：文档也不好理解）

:::info
感觉不是这么回事 👇🏻：

- **目前感觉主要用来降低某个状态更新的优选级 ❓**
- transition 应该代表优先级 ❓
- **虽然优先级改变了，但触发改变状态的顺序是不变的 ❓。看选项卡切换示例**
  :::

## |useId

useId 是一个 React Hook，可以生成传递给无障碍属性的唯一 ID。

### |参考

const id = useId()

**参数**

- useId 不带任何参数。

**返回值**

- useId 返回一个唯一的字符串 ID，与此特定组件中的 useId 调用相关联。

**注意事项**

1. useId 是一个 Hook，因此你只能 在组件的顶层 或自己的 Hook 中调用它。你不能在内部循环或条件判断中调用它。如果需要，可以提取一个新组件并将 state 移到该组件中。
2. useId 不应该被用来生成列表中的 key。key 应该由你的数据生成。

### |用法

...

#### |为无障碍属性生成唯一 ID

（看文档）

#### |为什么 useId 比递增计数器更好？

你可能想知道为什么使用 useId 比增加全局变量（如 nextId++）更好。

useId 的主要好处是 React 确保它能够与 服务端渲染一起工作。 在服务器渲染期间，你的组件生成输出 HTML。随后，在客户端，hydration 会将你的事件处理程序附加到生成的 HTML 上。由于 hydration，客户端必须匹配服务器输出的 HTML。

使用递增计数器很难保证这一点，因为客户端组件被 hydrate 处理后的顺序可能与服务器 HTML 的顺序不匹配。调用 useId 可以确保 hydration 正常工作，以及服务器和客户端之间的输出相匹配。

在 React 内部，调用组件的“父路径”生成 useId。这就是为什么如果客户端和服务器的树相同，不管渲染顺序如何，“父路径”始终都匹配。

#### |为多个相关元素生成 ID

```js
import { useId } from "react";

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + "-firstName"}>名字：</label>
      <input id={id + "-firstName"} type="text" />
      <hr />
      <label htmlFor={id + "-lastName"}>姓氏：</label>
      <input id={id + "-lastName"} type="text" />
    </form>
  );
}
```

可以使你避免为每个需要唯一 ID 的元素调用 useId。✅

#### |为所有生成的 ID 指定共享前缀

如果你在单个页面上渲染多个独立的 React 应用程序，请在 createRoot 或 hydrateRoot 调用中将 identifierPrefix 作为选项传递。这确保了由两个不同应用程序生成的 ID 永远不会冲突，因为使用 useId 生成的每个 ID 都将以你指定的不同前缀开头。（前缀 ✅ 看文档）

#### |在客户端和服务端上使用相同的 ID 前缀

如果你 在同一页面上渲染多个独立的 React 应用程序，并且其中一些应用程序是服务端渲染，请确保你在客户端向 hydrateRoot 调用传递的标识符前缀 identifierPrefix 与你向 服务器 API （如 renderToPipeableStream ）传递的标识符前缀 identifierPrefix 相同。（
看文档）

## |useSyncExternalStore

...

## |useDebugValue

...

## v18/v19

- React.memo() 弃用 => API - memo
- forwardRef 在 v19 弃用 => props.ref https://mp.weixin.qq.com/s/P04842cMtzNTz335CG4-jQ

🔗 一个被小瞧的冷门 hook 补全了 React 19 异步最佳实践的最后一环 https://mp.weixin.qq.com/s/U-UWD86NHcuHTEgwqkuqqQ
