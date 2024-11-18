# Hooks 详解和实践（文档）

- 官方：https://zh-hans.react.dev/ 多看文档
- 包括：useEffect、useLayoutEffect、useInsertionEffect、useMemo、useCallback

## |useEffect

useEffect 是一个 React Hook，**它允许你 将组件与外部系统同步**✅。

**参数：**

1. setup：处理 Effect 的函数。setup 函数选择性返回一个 清理（cleanup） 函数。当组件被添加到 DOM 的时候，React 将运行 setup 函数。**在每次依赖项变更重新渲染后，React 将首先使用旧值运行 cleanup 函数（如果你提供了该函数），然后使用新值运行 setup 函数。在组件从 DOM 中移除后，React 将最后一次运行 cleanup 函数**。（当前 cleanup 是上一次 useEffect 的，而且上一次的 useEffect 已经执行过了 ✅）
2. 可选 dependencies：setup 代码中引用的所有响应式值的列表。响应式值包括 props、state 以及所有直接在组件内部声明的变量和函数。如果你的代码检查工具 配置了 React，那么它将验证是否每个响应式值都被正确地指定为一个依赖项。React 将使用 Object.is 来比较每个依赖项和它先前的值。

**返回值：**

1. useEffect 返回 undefined。

**注意事项：**

- useEffect 是一个 Hook，因此只能在 组件的顶层 或自己的 Hook 中调用它，而不能在循环或者条件内部调用。如果需要，抽离出一个新组件并将 state 移入其中。

- 如果你 没有打算与某个外部系统同步，那么你可能不需要 Effect。

- 当严格模式启动时，React 将在真正的 setup 函数首次运行前，运行一个开发模式下专有的额外 setup + cleanup 周期。这是一个压力测试，用于确保 cleanup 逻辑“映射”到了 setup 逻辑，并停止或撤消 setup 函数正在做的任何事情。如果这会导致一些问题，请实现 cleanup 函数。

- 如果你的一些依赖项是组件内部定义的对象或函数，则存在这样的风险，即它们将 导致 Effect 过多地重新运行。要解决这个问题，请删除不必要的 对象 和 函数 依赖项。你还可以 抽离状态更新 和 非响应式的逻辑 到 Effect 之外。

- 如果你的 Effect 不是由交互（比如点击）引起的，那么 React 会让浏览器 在运行 Effect 前先绘制出更新后的屏幕。如果你的 Effect 正在做一些视觉相关的事情（例如，定位一个 tooltip），并且有显著的延迟（例如，它会闪烁），那么将 useEffect 替换为 useLayoutEffect。

- 如果你的 Effect 是由一个交互（比如点击）引起的，React 可能会在浏览器重新绘制屏幕之前执行 Effect。通常情况下，这样是符合预期的。但是，如果你必须要推迟 Effect 执行到浏览器绘制之后，和使用 alert() 类似，可以使用 setTimeout。有关更多信息，请参阅 reactwg/react-18/128。

- 即使你的 Effect 是由一个交互（比如点击）引起的，React 也可能允许浏览器在处理 Effect 内部的状态更新之前重新绘制屏幕。通常，这样是符合预期的。但是，如果你一定要阻止浏览器重新绘制屏幕，则需要用 useLayoutEffect 替换 useEffect。

Effect 只在客户端上运行，在服务端渲染中不会运行。

### |\*用法(示例)

···

#### |连接到外部系统

**React 在必要时会调用 setup 和 cleanup，这可能会发生多次：**

1. 将组件挂载到页面时，将运行 setup 代码。
2. 重新渲染 依赖项 变更的组件后：
   - 首先，使用旧的 props 和 state 运行 cleanup 代码。
   - 然后，使用新的 props 和 state 运行 setup 代码。
3. 当组件从页面卸载后，cleanup 代码 将运行最后一次。

**尽量 将每个 Effect 作为一个独立的过程编写，并且 每次只考虑一个单独的 setup/cleanup 周期。组件是否正在挂载、更新或卸载并不重要**。

**外部系统是指任何不受 React 控制的代码，例如：**

1. 由 setInterval() 和 clearInterval() 管理的定时器。
2. 使用 window.addEventListener() 和 window.removeEventListener() 的事件订阅。
3. 一个第三方的动画库，它有一个类似 animation.start() 和 animation.reset() 的 API。

**连接到外部系统的示例：**

- 第 1 个示例 共 5 个挑战: 连接到聊天服务器
- 第 2 个示例 共 5 个挑战: 监听全局的浏览器事件
- 第 3 个示例 共 5 个挑战: 触发动画效果
- 第 4 个示例 共 5 个挑战: 控制模态对话框
- 第 5 个示例 共 5 个挑战: 跟踪元素可见性

#### |在自定义 Hook 中封装 Effect

**自定义 Hook 中封装 Effect 示例：**

- 第 1 个示例 共 3 个挑战: 定制 useChatRoom Hook
- 第 2 个示例 共 3 个挑战: 定制 useWindowListener Hook
- 第 3 个示例 共 3 个挑战: 定制 useIntersectionObserver Hook
  - useEffect 中 new IntersectionObserver(...)

#### |控制非 React 小部件

- useEffect 中 new MapWidget(...)
- 在本例中，不需要 cleanup 函数，因为 MapWidget 类只管理传递给它的 DOM 节点。从树中删除 Map React 组件后，DOM 节点和 MapWidget 类实例都将被浏览器的 JavaScript 引擎的垃圾回收机制自动处理掉。

#### |使用 Effect 请求数据

- 注意，ignore 变量被初始化为 false，并且在 cleanup 中被设置为 true。这样可以确保 你的代码不会受到“竞争条件”的影响：网络响应可能会以与你发送的不同的顺序到达。（ignore 的使用，重复请求后无效接口数据的 ignore✅）

**Effect 中的数据请求有什么好的替代方法：**

在 Effect 中使用 fetch 是 请求数据的一种流行方式，特别是在完全的客户端应用程序中。然而，这是一种非常手动的方法，而且有很大的缺点：...

这些缺点并不仅仅体现在 React 上，它可能出现在所有挂载时请求数据的地方。与路由一样，要做好数据请求并非易事，因此我们推荐以下方法：

- 如果正在使用 框架，那么请使用其内置的数据获取机制。现代 React 框架已经集成了高效的数据获取机制，不会受到上述问题的影响。
- 否则，请考虑使用或构建客户端缓存。流行的开源解决方案包括 React Query、useSWR 和 React Router v6.4+。你也可以构建自己的解决方案，在这种情况下，你将在底层使用 Effect，但还需添加逻辑以避免重复请求、缓存响应并避免网络瀑布效应（通过预加载数据或将数据需求提升到路由级别）。

如果这两种方法都不适合你，可以继续直接在 Effect 中请求数据。

#### |指定响应式依赖项

- 注意，**你无法“选择” Effect 的依赖项**。Effect 代码中使用的每个 响应式值 都必须声明为依赖项。你的 Effect 依赖列表是由周围代码决定的
- **响应式值 包括 props 和直接在组件内声明的所有变量和函数**。（直接声明的也是响应式的，因为每次重新渲染多变化 ✅）
- 要删除一个依赖项，你需要 “证明”给代码检查工具，表明它 不需要 作为一个依赖项。
- 例如，你可以将 serverUrl 声明移动到组件外面，以证明它不是响应式的，并且不会在重新渲染时发生变化。
- 如果 Effect 的代码不使用任何响应式值，则其依赖项列表应为空（[]）

**传递响应式依赖项的示例:**

- 第 1 个示例 共 3 个挑战: 传递依赖项数组
- 第 2 个示例 共 3 个挑战: 传递空依赖项数组
- 第 3 个示例 共 3 个挑战: 不传递依赖项数组

#### |在 Effect 中根据先前 state 更新 state

当你想要在 Effect 中根据先前的 state 更新 state 时，你可能会遇到问题：

```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // 你想要每秒递增该计数器...
    }, 1000);
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... 但是指定 `count` 作为依赖项总是重置间隔定时器。
  // ...
}
```

因为 count 是一个响应式值，所以必须在依赖项列表中指定它。但是，这会导致 Effect 在每次 count 更改时再次执行 cleanup 和 setup。这并不理想。

为了解决这个问题，将 c => c + 1 状态更新器传递给 setCount：

```js
import { useState, useEffect } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((c) => c + 1); // ✅ 传递一个 state 更新器
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅现在 count 不是一个依赖项

  return <h1>{count}</h1>;
}
```

**现在，你传递的是 c => c + 1 而不是 count + 1，因此 Effect 不再需要依赖于 count。由于这个修复，每次 count 更改时，它都不需要清理（cleanup）和设置（setup）间隔定时器** ✅。

#### |删除不必要的对象依赖项

如果你的 Effect 依赖于在渲染期间创建的对象或函数，则它可能会频繁运行。例如，此 Effect 在每次渲染后都重新连接，因为 options 对象 每次渲染都不同：

避免使用渲染期间创建的对象作为依赖项。相反，在 Effect 内部创建对象：

现在你已经在 Effect 内部创建了 options 对象，因此 Effect 仅依赖于 roomId 字符串。

通过此修复，在输入框中输入不会导致重新连接到聊天室。阅读有关删除依赖项的更多信息。

#### |删除不必要的函数依赖项

如果你的 Effect 依赖于在渲染期间创建的对象或函数，则它可能会频繁运行。例如，此 Effect 在每次渲染后重新连接，因为 createOptions 函数 在每次渲染时都不同：

就其本身而言，在每次重新渲染时从头新建一个函数不是问题。你不需要优化它。但是，如果你将其用作 Effect 的依赖项，则会导致 Effect 在每次重新渲染后重新运行。

避免使用在渲染期间创建的函数作为依赖项，请在 Effect 内部声明它：

现在你在 Effect 内部定义了 createOptions 函数，这样 Effect 本身只依赖于 roomId 字符串。通过此修复，输入框的输入不会重新连接聊天室。了解更多有关移除依赖项的信息。

#### |从 Effect 读取最新的 props 和 state

如果你想在每次 url 更改后记录一次新的页面访问，而不是在 shoppingCart 更改后记录，该怎么办？你不能在不违反 响应规则 的情况下将 shoppingCart 从依赖项中移除。然而，你可以表达你 不希望 某些代码对更改做出“响应”，即使它是在 Effect 内部调用的。使用 useEffectEvent Hook 声明 Effect 事件，并将读取 shoppingCart 的代码移入其中：

```js
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent((visitedUrl) => {
    logVisit(visitedUrl, shoppingCart.length);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ 所有声明的依赖项
  // ...
}
```

Effect 事件不是响应式的，必须始终省略其作为 Effect 的依赖项。

**这就是让你在其中放置非响应式代码（可以在其中读取某些 props 和 state 的最新值）的原因。通过在 onVisit 中读取 shoppingCart，确保了 shoppingCart 不会使 Effect 重新运行**。

#### |在服务器和客户端上显示不同的内容

...

### |疑难解答

...

#### |Effect 在组件挂载时运行了两次

在开发环境下，如果开启严格模式，React 会在实际运行 setup 之前额外运行一次 setup 和 cleanup。

这是一个压力测试，用于验证 Effect 的逻辑是否正确实现。如果出现可见问题，则 cleanup 函数缺少某些逻辑。cleanup 函数应该停止或撤消 setup 函数所做的任何操作。一般来说，用户不应该能够区分 setup 被调用一次（如在生产环境中）和调用 setup → cleanup → setup 序列（如在开发环境中）。

#### |Effect 在每次重新渲染后都运行

...

#### |Effect 函数一直在无限循环中运行

...

#### |即使组件没有卸载，cleanup 逻辑也会运行

...

#### |我的 Effect 做了一些视觉相关的事情，在它运行之前我看到了一个闪烁

如果 Effect 一定要阻止浏览器绘制屏幕，使用 useLayoutEffect 替换 useEffect。请注意，绝大多数的 Effect 都不需要这样。只有当在浏览器绘制之前运行 Effect 非常重要的时候才需要如此：例如，在用户看到 tooltip 之前测量并定位它。

## |useLayoutEffect

useLayoutEffect 是 useEffect 的一个版本，**在浏览器重新绘制屏幕之前触发**。

### |参考

**参数**

1. setup：处理副作用的函数。setup 函数选择性返回一个清理（cleanup）函数。在将组件首次添加到 DOM 之前，React 将运行 setup 函数。在每次因为依赖项变更而重新渲染后，React 将首先使用旧值运行 cleanup 函数（如果你提供了该函数），然后使用新值运行 setup 函数。在组件从 DOM 中移除之前，React 将最后一次运行 cleanup 函数。
2. 可选 dependencies：setup 代码中引用的所有响应式值的列表。响应式值包括 props、state 以及所有直接在组件内部声明的变量和函数。如果你的代码检查工具 配置了 React，那么它将验证每个响应式值都被正确地指定为一个依赖项。依赖项列表必须具有固定数量的项，并且必须像 [dep1, dep2, dep3] 这样内联编写。React 将使用 Object.is 来比较每个依赖项和它先前的值。如果省略此参数，则在每次重新渲染组件之后，将重新运行副作用函数。

**返回值**

- useLayoutEffect 返回 undefined。

**注意事项**

1. useLayoutEffect 是一个 Hook，因此只能在 组件的顶层 或自己的 Hook 中调用它。不能在循环或者条件内部调用它。如果你需要的话，抽离出一个组件并将副作用处理移动到那里。
2. 当 StrictMode 启用时，React 将在真正的 setup 函数首次运行前，运行一个额外的开发专有的 setup + cleanup 周期。这是一个压力测试，确保 cleanup 逻辑“映照”到 setup 逻辑，并停止或撤消 setup 函数正在做的任何事情。如果这导致一个问题，请实现清理函数。
3. 如果你的一些依赖项是组件内部定义的对象或函数，则存在这样的风险，即它们将 导致 Effect 重新运行的次数多于所需的次数。要解决这个问题，请删除不必要的 对象 和 函数 依赖项。你还可以 抽离状态更新 和 非响应式逻辑 到 Effect 之外。
4. Effect 只在客户端上运行，在服务端渲染中不会运行。
5. useLayoutEffect 内部的代码和所有计划的状态更新阻塞了浏览器重新绘制屏幕。如果过度使用，这会使你的应用程序变慢。如果可能的话，尽量选择 useEffect。

### |用法

...

#### |在浏览器重新绘制屏幕前计算布局

大多数组件不需要依靠它们在屏幕上的位置和大小来决定渲染什么。他们只返回一些 JSX，然后浏览器计算他们的 布局（位置和大小）并重新绘制屏幕。

有时候，这还不够。想象一下悬停时出现在某个元素旁边的 tooltip。如果有足够的空间，tooltip 应该出现在元素的上方，但是如果不合适，它应该出现在下面。为了让 tooltip 渲染在最终正确的位置，你需要知道它的高度（即它是否适合放在顶部）。

要做到这一点，你需要分两步渲染：

1. 将 tooltip 渲染到任何地方（即使位置不对）。
2. 测量它的高度并决定放置 tooltip 的位置。
3. 把 tooltip 渲染放在正确的位置。

**所有这些都需要在浏览器重新绘制屏幕之前完成。你不希望用户看到 tooltip 在移动。调用 useLayoutEffect 在浏览器重新绘制屏幕之前执行布局测量**：

```js
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // 你还不知道真正的高度

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // 现在重新渲染，你知道了真实的高度
  }, []);

  // ... 在下方的渲染逻辑中使用 tooltipHeight ...
}
```

下面是这如何一步步工作的：（**文档中有这个示例完整代码 ✅，可模仿学习**）

1. Tooltip 使用初始值 tooltipHeight = 0 进行渲染（因此 tooltip 可能被错误地放置）。
2. **React 将它放在 DOM 中，然后运行 useLayoutEffect 中的代码**。
3. **useLayoutEffect 测量 了 tooltip 内容的高度，并立即触发重新渲染**。
4. **使用实际的 tooltipHeight 再次渲染 Tooltip（这样 tooltip 的位置就正确了）**。
5. R**eact 在 DOM 中对它进行更新，浏览器最终显示出 tooltip**。

注意，即使 Tooltip 组件需要两次渲染（首先，使用初始值为 0 的 tooltipHeight 渲染，然后使用实际测量的高度渲染），你也只能看到最终结果。这就是为什么在这个例子中需要 useLayoutEffect 而不是 useEffect 的原因。

注意，两次渲染并阻塞浏览器绘制会**影响性能**。尽量避免这种情况。

#### |useLayoutEffect vs useEffect

**第 1 个示例 共 2 个挑战: useLayoutEffect 阻塞浏览器重新绘制 ✅**

React 保证了 useLayoutEffect 中的代码以及其中任何计划的状态更新都会在浏览器重新绘制屏幕之前得到处理。这样你就可以渲染 tooltip，测量它，然后在用户没有注意到第一个额外渲染的情况下再次重新渲染。换句话说，**useLayoutEffect 阻塞了浏览器的绘制**。

**第 2 个示例 共 2 个挑战: useEffect 不阻塞浏览器绘制**

下面是同样的例子，但是使用 useEffect 代替 useLayoutEffect。如果你使用的是速度较慢的设备，你可能注意到有时 tooltip 会“闪烁”，并且会在更正位置之前短暂地看到初始位置。

### |疑难解答

useLayoutEffect 的目的是让你的组件 使用布局信息来渲染：（问答 ✅）

1. 渲染初始的内容。
2. 在 浏览器重新绘制屏幕之前 测量布局。
3. 使用所读取的布局信息渲染最终内容。

#### |我收到一个错误：“ useLayoutEffect 在服务端没有任何作用”

在 前面的示例 中，Tooltip 组件中的 useLayoutEffect 调用允许它根据内容高度正确定位自己的位置（高于或低于内容）。如果你试图将 Tooltip 作为服务端初始 HTML 的一部分渲染，那么这是不可能确定的。在服务端，还没有布局！因此，即使你在服务端渲染它，它的位置也会在 JavaScript 加载和运行之后在客户端上“跳动”。

通常，依赖于布局信息的组件不需要在服务器上渲染。例如，在初始渲染时显示 Tooltip 可能就没有意义了。它是通过客户端交互触发的。

然而，如果你遇到这个问题，你有几个不同的选择：（具体看文档吧 ✅）

## |useInsertionEffect

useInsertionEffect 是为 CSS-in-JS 库的作者特意打造的。除非你正在使用 CSS-in-JS 库并且需要注入样式，否则你应该使用 useEffect 或者 useLayoutEffect。

useInsertionEffect 可以在布局副作用触发之前将元素插入到 DOM 中。

### |参考

useInsertionEffect(setup, dependencies?)

调用 useInsertionEffect 在任何可能需要读取布局的副作用启动之前插入样式：

**参数**

1. setup：处理 Effect 的函数。setup 函数选择性返回一个 清理（cleanup） 函数。当你的组件添加到 DOM 中，但在任何布局触发之前，React 将运行你的 setup 函数。在每次重新渲染时，如果依赖项发生变化并且提供了 cleanup 函数，React 首先会使用旧值运行 cleanup 函数，然后使用新值运行你的 setup 函数。当你的组件从 DOM 中移除时，React 将运行你的 cleanup 函数。
2. 可选 dependencies：setup 代码中引用的所有响应式值的列表。响应式值包括 props、state 以及所有直接在组件内部声明的变量和函数。如果你的代码检查工具 配置了 React，那么它将验证是否每个响应式值都被正确地指定为依赖项。依赖列表必须具有固定数量的项，并且必须像 [dep1, dep2, dep3] 这样内联编写。React 将使用 Object.is 来比较每个依赖项和它先前的值。如果省略此参数，则将在每次重新渲染组件之后重新运行 Effect。

**返回值**

useInsertionEffect 返回 undefined。

**注意**

1. Effect 只在客户端运行。在服务器渲染期间不会运行。
2. **你不能在 useInsertionEffect 内部更新状态**。
3. 当 useInsertionEffect **运行时，refs 尚未附加**。
4. useInsertionEffect **可能在 DOM 更新之前或之后运行。你不应该依赖于 DOM 在任何特定时间的更新状态**。
5. 与其他类型的 Effect 不同，它们会先为每个 Effect 触发 cleanup 函数，然后再触发 setup 函数。**而 useInsertionEffect 会同时触发 cleanup 函数和 setup 函数**。这会导致 cleanup 函数和 setup 函数的“交错”执行。

### |用法-从 CSS-in-JS 库中注入动态样式

...(有 CSS-in-JS 问答时再看这块内容)

### |这与在渲染期间或 useLayoutEffect 中注入样式相比有何优势？

如果你在渲染期间注入样式并且 React 正在处理 非阻塞更新，那么浏览器将在渲染组件树时每一帧都会重新计算样式，这可能会 非常慢。

**useInsertionEffect 比在 useLayoutEffect 或 useEffect 期间注入样式更好。因为它会确保 `<style>` 标签在其它 Effect 运行前被注入。否则，正常的 Effect 中的布局计算将由于过时的样式而出错**。✅（_也说明 useInsertionEffect 比 useLayoutEffect 和 useEffect 运行时机早_）

## |useMemo

useMemo 是一个 React Hook，它在每次重新渲染的时候能够缓存计算的结果。

### |参考

const cachedValue = useMemo(calculateValue, dependencies)

**参数**

1. calculateValue：要缓存计算值的函数。它应该是**一个没有任何参数的纯函数** ✅，并且可以返回任意类型。React 将会在首次渲染时调用该函数；在之后的渲染中，**如果 dependencies 没有发生变化，React 将直接返回相同值。否则，将会再次调用 calculateValue 并返回最新结果**，然后缓存该结果以便下次重复使用。
2. dependencies：所有在 calculateValue 函数中使用的响应式变量组成的数组。响应式变量包括 props、state 和**所有你直接在组件中定义的变量和函数**。如果你在代码检查工具中 配置了 React，它将会确保每一个响应式数据都被正确地定义为依赖项。依赖项数组的长度必须是固定的并且必须写成 [dep1, dep2, dep3] 这种形式。React 使用 Object.is 将每个依赖项与其之前的值进行比较。

**返回值**

- 在初次渲染时，useMemo 返回不带参数调用 calculateValue 的结果。
- 在接下来的渲染中，如果依赖项没有发生改变，它将返回上次缓存的值；否则将再次调用 calculateValue，并返回最新结果。

**注意**

（看文档）

### |用法

...

#### |跳过代价昂贵的重新计算

你需要给 useMemo 传递两样东西：

- 一个没有任何参数的 calculation 函数，像这样 () =>，并且返回任何你想要的计算结果。
- 一个由包含在你的组件中并在 calculation 中使用的所有值组成的 依赖列表。

##### |如何衡量计算过程的开销是否昂贵？

...

##### |你应该在所有地方添加 useMemo 吗？

使用 useMemo 进行优化仅在少数情况下有价值：

1. 你在 useMemo 中进行的计算明显很慢，而且它的依赖关系很少改变。
2. 将计算结果作为 props 传递给包裹在 memo 中的组件。当计算结果没有改变时，你会想跳过重新渲染。记忆化让组件仅在依赖项不同时才重新渲染。
3. 你传递的值稍后用作某些 Hook 的依赖项。例如，也许另一个 useMemo 计算值依赖它，或者 useEffect 依赖这个值。

##### |使用 useMemo 和直接计算之间的区别

- 第 1 个示例 共 2 个挑战
- 第 2 个示例 共 2 个挑战: 始终重新计算

#### |跳过组件的重新渲染

**默认情况下，当一个组件重新渲染时，React 会递归地重新渲染它的所有子组件**。这就是为什么当 TodoList 使用不同的 theme 重新渲染时，List 组件 也会 重新渲染。这对于不需要太多计算来重新渲染的组件来说很好。但是如果你已经确认重新渲染很慢，你可以通过将它**包装在 memo 中，这样当它的 props 跟上一次渲染相同的时候它就会跳过本次渲染**：

```js
const List = memo(function List({ items }) {
  // ...
});
```

通过此更改，如果 List 的所有 props 都与上次渲染时相同，则 List 将跳过重新渲染。

**filterTodos 函数总是创建一个不同数组，类似于 {} 总是创建一个新对象的方式。通常，这不是问题，但这意味着 List 属性永远不会相同，并且你的 memo 优化将不起作用。这就是 useMemo 派上用场的地方：** 通过将 visibleTodos 的计算函数包裹在 useMemo 中，你可以确保它在重新渲染之间具有相同值。✅

```js
export default function TodoList({ todos, tab, theme }) {
  // 告诉 React 在重新渲染之间缓存你的计算结果...✅
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...所以只要这些依赖项不变...
  );
  return (
    <div className={theme}>
      {/* ... List 也就会接受到相同的 props 并且会跳过重新渲染 ✅ */}
      <List items={visibleTodos} />
    </div>
  );
}
```

##### |记忆单个 JSX 节点

可以将 `<List />` JSX 节点本身包裹在 useMemo 中，而不是将 List 包裹在 memo 中：

```js
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return <div className={theme}>{children}</div>;
}
```

手动将 JSX 节点包裹到 useMemo 中并不方便，比如你不能在条件语句中这样做。**这就是为什么通常会选择使用 memo 包装组件而不是使用 useMemo 包装 JSX 节点**。

##### |跳过重新渲染和总是重新渲染之间的区别

（看文档：优化前后很明显）

#### |记忆另一个 Hook 的依赖

```js
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 提醒：依赖于在组件主体中创建的对象
  // ...
```

依赖这样的对象会破坏记忆化。当组件重新渲染时，组件主体内的所有代码都会再次运行。创建 searchOptions 对象的代码行也将在每次重新渲染时运行。因为 searchOptions 是你的 useMemo 调用的依赖项，而且每次都不一样，React 知道依赖项是不同的，并且每次都重新计算 searchItems。

要解决此问题，你可以在将其作为依赖项传递之前记忆 searchOptions 对象 本身：

```js
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ 只有当 text 改变时才会发生改变

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ 只有当 allItems 或 serachOptions 改变时才会发生改变
  // ...
```

在上面的例子中，如果 text 没有改变，searchOptions 对象也不会改变。然而，**更好的解决方法是将 searchOptions 对象声明移到 useMemo 计算函数的 内部：**

```js
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ 只有当 allItems 或者 text 改变的时候才会重新计算
  // ...
```

#### |记忆一个函数

假设 Form 组件被包裹在 memo 中，你想将一个函数作为 props 传递给它：

```js
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post("/product/" + productId + "/buy", {
      referrer,
      orderDetails,
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

正如 {} 每次都会创建不同的对象一样，像 function() {} 这样的函数声明和像 () => {} 这样的表达式在每次重新渲染时都会产生一个 不同 的函数。就其本身而言，创建一个新函数不是问题。这不是可以避免的事情！但是，如果 Form 组件被记忆了，大概你想在没有 props 改变时跳过它的重新渲染。总是 不同的 props 会破坏你的记忆化。

**要使用 useMemo 记忆函数，你的计算函数必须返回另一个函数：**✅

```js
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback(
    (orderDetails) => {
      post("/product/" + productId + "/buy", {
        referrer,
        orderDetails,
      });
    },
    [productId, referrer]
  );

  return <Form onSubmit={handleSubmit} />;
}
```

这看起来很笨拙！记忆函数很常见，React 有一个专门用于此的内置 Hook。将你的函数包装到 useCallback 而不是 useMemo 中，以避免编写额外的嵌套函数：✅

```js
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback(
    (orderDetails) => {
      post("/product/" + productId + "/buy", {
        referrer,
        orderDetails,
      });
    },
    [productId, referrer]
  );

  return <Form onSubmit={handleSubmit} />;
}
```

**上面两个例子是完全等价的**✅。useCallback 的唯一好处是它可以让你避免在内部编写额外的嵌套函数。它没有做任何其他事情。

### |故障排除

...

#### |每次重新渲染时计算函数都会运行两次

**这种 仅限开发环境下的 行为可帮助你 保持组件纯粹**。React 使用其中一次调用的结果，而忽略另一次的结果。只要你的组件和计算函数是纯函数，这就不会影响你的逻辑。

计算不应更改任何现有对象。（计算应用外的任何对象 ✅）

#### |我调用的 useMemo 应该返回一个对象，但返回了 undefined

...

#### |组件每次渲染时，useMemo 都会重新计算

...

#### |我需要为循环中的每个列表项调用 useMemo，但这是不允许的

假设 Chart 组件被包裹在 memo 中。当 ReportList 组件重新渲染时，你想跳过重新渲染列表中的每个 Chart。但是，**你不能在循环中调用 useMemo**：

```js
function ReportList({ items }) {
  return (
    <article>
      {items.map((item) => {
        // 🔴 你不能像这样在循环中调用 useMemo：
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

相反，为每个 item 提取一个组件并为单个 item 记忆数据：

```js
function ReportList({ items }) {
  return (
    <article>
      {items.map((item) => (
        <Report key={item.id} item={item} />
      ))}
    </article>
  );
}

function Report({ item }) {
  // ✅ 在顶层调用 useMemo：
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

**或者，你可以删除 useMemo 并将 Report 本身包装在 memo 中。如果 item props 没有改变，Report 将跳过重新渲染，因此 Chart 也会跳过重新渲染：**

```js
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```

（**没有说必须 memo 和 useMemo 配合使用，要重点看他们的 变量是否发生了改变** ✅）

## useCallback

useCallback 是一个允许你在多次渲染中缓存函数的 React Hook。

### |参考

**参数**

1. fn：想要缓存的函数。此函数可以接受任何参数并且返回任何值。在初次渲染时，React 将把函数返回给你（而不是调用它！）。当进行下一次渲染时，如果 dependencies 相比于上一次渲染时没有改变，那么 React 将会返回相同的函数。否则，React 将返回在最新一次渲染中传入的函数，并且将其缓存以便之后使用。React 不会调用此函数，而是返回此函数。你可以自己决定何时调用以及是否调用。
2. dependencies：有关是否更新 fn 的所有响应式值的一个列表。响应式值包括 props、state，和所有在你组件内部直接声明的变量和函数。如果你的代码检查工具 配置了 React，那么它将校验每一个正确指定为依赖的响应式值。依赖列表必须具有确切数量的项，并且必须像 [dep1, dep2, dep3] 这样编写。React 使用 Object.is 比较每一个依赖和它的之前的值。

**返回值**

- 在初次渲染时，useCallback 返回你已经传入的 fn 函数
- 在之后的渲染中, 如果依赖没有改变，useCallback 返回上一次渲染中缓存的 fn 函数；否则返回这一次渲染传入的 fn。

**注意**

（看文档）

### |用法

...

#### |跳过组件的重新渲染

（看文档：内容重点和 useMemo 类似）

##### |useCallback 与 useMemo 有何关系？

useMemo 经常与 useCallback 一同出现。当尝试优化子组件时，它们都很有用。

```js
import { useMemo, useCallback } from "react";

function ProductPage({ productId, referrer }) {
  const product = useData("/product/" + productId);

  const requirements = useMemo(() => {
    //调用函数并缓存结果
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback(
    (orderDetails) => {
      // 缓存函数本身
      post("/product/" + productId + "/buy", {
        referrer,
        orderDetails,
      });
    },
    [productId, referrer]
  );

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

区别在于你需要缓存 什么:

1. **useMemo 缓存函数调用的结果**。在这里，它缓存了调用 computeRequirements(product) 的结果。除非 product 发生改变，否则它将不会发生变化。这让你向下传递 requirements 时而无需不必要地重新渲染 ShippingForm。必要时，React 将会调用传入的函数重新计算结果。
2. **useCallback 缓存函数本身**。不像 useMemo，它不会调用你传入的函数。相反，它缓存此函数。从而除非 productId 或 referrer 发生改变，handleSubmit 自己将不会发生改变。这让你向下传递 handleSubmit 函数而无需不必要地重新渲染 ShippingForm。直至用户提交表单，你的代码都将不会运行。

如果你已经熟悉了 useMemo，你可能发现将 useCallback 视为以下内容会很有帮助：

```js
// 在 React 内部的简化实现✅
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

##### |是否应该在任何地方添加 useCallback？

（题 ✅）

使用 useCallback 缓存函数仅在少数情况下有意义：

1. **将其作为 props 传递给包装在 `[memo]` 中的组件**。如果 props 未更改，则希望跳过重新渲染。缓存允许组件仅在依赖项更改时重新渲染。
2. **传递的函数可能作为某些 Hook 的依赖**。比如，另一个包裹在 useCallback 中的函数依赖于它，或者依赖于 useEffect 中的函数。

在其他情况下，将函数包装在 useCallback 中没有任何意义。不过即使这样做了，也没有很大的坏处。所以有些团队选择不考虑个案，从而尽可能缓存。不好的地方可能是降低了代码可读性。而且，并不是所有的缓存都是有效的：一个始终是新的值足以破坏整个组件的缓存。

##### |使用 useCallback 与直接声明函数的区别

（看文档）

### |从记忆化回调中更新 state

有时，你可能在记忆化回调中基于之前的 state 来更新 state。

下面的 handleAddTodo 函数将 todos 指定为依赖项，因为它会从中计算下一个 todos：

```js
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

我们期望记忆化函数具有尽可能少的依赖，当你读取 state 只是为了计算下一个 state 时，你可以通过传递 updater function 以移除该依赖：

```js
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ 不需要 todos 依赖项
  // ...
```

**在这里，并不是将 todos 作为依赖项并在内部读取它，而是传递一个关于 如何 更新 state 的指示器 (todos => [...todos, newTodo]) 给 React**。（✅👍🏻）

### |防止频繁触发 Effect

（看文档：这块在教程里也有）

### |优化自定义 Hook

如果你正在编写一个 自定义 Hook，**建议将它返回的任何函数包裹在 useCallback 中**：（✅👍🏻）

```js
function useRouter() {
  const navigate = useCallback((url) => {
    ...
  }, [xx]);

  const goBack = useCallback(() => {
    ...
  }, [xxx]);

  return {
    navigate,
    goBack,
  };
}
```

这确保了 Hook 的使用者在需要时能够优化自己的代码。

### |疑难解答

#### |我的组件每一次渲染时, useCallback 都返回了完全不同的函数

（看文档：调试方法可尝试 ✅）

#### |我需要在循环中为每一个列表项调用 useCallback 函数，但是这不被允许

（看文档：优化方案比较常用 ✅）
