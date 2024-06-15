# 脱围机制 - hook（文档）

https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks

- **这节大部分示例实践都是：把 Effect 包裹进自定义 Hook**✅。

## 使用自定义 Hook 复用逻辑

...

### 自定义 Hook：组件间共享逻辑

···

### 从组件中提取自定义 Hook

声明一个 useOnlineStatus 函数，并把组件里早前写的所有重复代码移入该函数：

```js
import { useState, useEffect } from "react";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return isOnline;
}
```

在组件里没有那么多的重复逻辑了。**更重要的是，组件内部的代码描述的是想要做什么（使用在线状态！），而不是怎么做（通过订阅浏览器事件完成）**。

当提取逻辑到自定义 Hook 时，你可以隐藏如何处理外部系统或者浏览器 API 这些乱七八糟的细节。**组件内部的代码表达的是目标而不是具体实现**。

### Hook 的名称必须永远以 use 开头

- React 组件名称必须以大写字母开头
- Hook 的名称必须以 use 开头，然后紧跟一个大写字母

### \*自定义 Hook 共享的是状态逻辑，而不是状态本身

对 Hook 的每个调用完全独立于对同一个 Hook 的其他调用。

### 在 Hook 之间传递响应值

每当组件重新渲染，自定义 Hook 中的代码就会重新运行。这就是组件和自定义 Hook 都 需要是纯函数 的原因。我们应该把自定义 Hook 的代码看作组件主体的一部分。

由于自定义 Hook 会随着组件一起重新渲染，所以组件可以一直接收到最新的 props 和 state。

### \*|把事件处理函数传到自定义 Hook 中

当你在更多组件中使用 useChatRoom 时，你可能希望组件能定制它的行为。例如现在 Hook 内部收到消息的处理逻辑是硬编码：

```js
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId,
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on("message", (msg) => {
      showNotification("New message: " + msg); // 这里加上处理消息
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

你想把这个逻辑移回到组件中，把 onReceiveMessage 作为其命名选项之一：

```js
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId,
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on("message", (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ 声明了所有的依赖
}
```

**增加对 onReceiveMessage 的依赖并不理想，因为每次组件重新渲染时聊天室就会重新连接。 通过 将这个事件处理函数包裹到 Effect Event 中来将它从依赖中移除：**

```js
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage); // onReceiveMessage 作为 prop 传进来的

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId,
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on("message", (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 声明所有依赖
}
```

现在每次 ChatRoom 组件重新渲染时聊天室都不会重连。**这是一个将事件处理函数传给自定义 Hook 的完整且有效的 demo**✅

### |什么时候使用自定义 Hook

每当你写 Effect 时，考虑一下把它包裹在自定义 Hook 是否更清晰。你不应该经常使用 Effect，所以如果你正在写 Effect 就意味着你需要“走出 React”和某些外部系统同步，或者需要做一些 React 中没有对应内置 API 的事。**把 Effect 包裹进自定义 Hook 可以准确表达你的目标以及数据在里面是如何流动**的。

**让你的自定义 Hook 专注于具体的高级用例**

从选择自定义 Hook 名称开始。如果你难以选择一个清晰的名称，这可能意味着你的 Effect 和组件逻辑剩余的部分耦合度太高，还没有做好被提取的准备。

理想情况下，你的自定义 Hook 名称应该清晰到即使一个不经常写代码的人也能很好地猜中自定义 Hook 的功能，输入和返回：

- useData(url)
- useImpressionLog(eventName, extraData)
- useChatRoom(options)

当你和外部系统同步的时候，你的自定义 Hook 名称可能会更加专业，并使用该系统特定的术语。只要对熟悉这个系统的人来说名称清晰就可以：

- useMediaQuery(query)
- useSocket(url)
- useIntersectionObserver(ref, options)

保持自定义 Hook 专注于具体的高级用例。避免创建和使用作为 useEffect API 本身的替代品和 wrapper 的自定义“生命周期” Hook：

- 🔴 useMount(fn)
- 🔴 useEffectOnce(fn)
- 🔴 useUpdateEffect(fn)

### |自定义 Hook 帮助你迁移到更好的模式

_Effect 是一个 脱围机制：当需要“走出 React”且用例没有更好的内置解决方案时你可以使用他们。随着时间的推移，React 团队的目标是通过给更具体的问题提供更具体的解决方案来最小化应用中的 Effect 数量。把你的 Effect 包裹进自定义 Hook，当这些解决方案可用时升级代码会更加容易_。

```js
import { useState, useEffect } from "react";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return isOnline;
}
```

在上述示例中，useOnlineStatus 借助一组 useState 和 useEffect 实现。但这不是最好的解决方案。它有许多边界用例没有考虑到。例如假设当组件加载时，isOnline 已经为 true，但是如果网络已经离线的话这就是错误的。简而言之这段代码可以改进。

幸运的是，React 18 包含了一个叫做 useSyncExternalStore 的专用 API，它可以解决你所有这些问题。这里展示了如何利用这个新 API 来重写你的 useOnlineStatus Hook：

```js
// useOnlineStatus.js
import { useSyncExternalStore } from "react";

function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // 如何在客户端获取值
    () => true // 如何在服务端获取值
  );
}

// App.js 使用
// const isOnline = useOnlineStatus();
```

这是把 Effect 包裹进自定义 Hook 有益的另一个原因：

1. 你让进出 Effect 的数据流非常清晰。
2. 你让组件专注于目标，而不是 Effect 的准确实现。
3. 当 React 增加新特性时，你可以在不修改任何组件的情况下移除这些 Effect。

和 设计系统 相似，**你可能会发现从应用的组件中提取通用逻辑到自定义 Hook 是非常有帮助的。这会让你的组件代码专注于目标，并且避免经常写原始 Effect**。

### |不止一个方法可以做到

使用浏览器的 requestAnimationFrame API 从头开始 实现一个 fade-in 动画。

你也许会从一个设置动画循环的 Effect 开始。在动画的每一帧中，你可以修改 ref 持有的 DOM 节点的 opacity 属性直到 1。你的代码一开始可能是这样：

```js
function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // 我们还有更多的帧需要绘制
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}
```

你也可以采取不一样的方法。把大部分必要的逻辑移入一个 JavaScript 类，而不是把逻辑保留在 Effect 中：

```js
// App.js
import { useState, useEffect, useRef } from "react";
import { useFadeIn } from "./useFadeIn.js";

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>{show ? "Remove" : "Show"}</button>
      <hr />
      {show && <Welcome />}
    </>
  );
}

// useFadeIn.js
import { useState, useEffect } from "react";
import { FadeInAnimation } from "./animation.js";

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}

// animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // 我们还有更多的帧要绘制
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

Effect 可以连接 React 和外部系统。Effect 之间的配合越多（例如链接多个动画），像上面的 sandbox 一样 完整地 从 Effect 和 Hook 中提取逻辑就越有意义。然后你提取的代码 变成 “外部系统”。这会让你的 Effect 保持简洁，因为他们只需要向已经被你移动到 React 外部的系统发送消息。

### |摘要

- 自定义 Hook 让你可以在组件间共享逻辑。
- 自定义 Hook 命名必须以后跟一个大写字母的 use 开头。
- 自定义 Hook 共享的只是状态逻辑，不是状态本身。
- 你可以将响应值从一个 Hook 传到另一个，并且他们会保持最新。
- 每次组件重新渲染时，所有的 Hook 会重新运行。
- 自定义 Hook 的代码应该和组件代码一样保持纯粹。
- 把自定义 Hook 收到的事件处理函数包裹到 Effect Event。
- 不要创建像 useMount 这样的自定义 Hook。保持目标具体化。
- 如何以及在哪里选择代码边界取决于你。

### |尝试一些挑战

**5 个 挑战，最佳实践都很棒，抽离思想直接学习使用 ✅👍🏻**

#### |\*第 3 个挑战答案：是前 2 个挑战的合并 ✅

```js
// App.js
import { useCounter } from "./useCounter.js";

export default function Counter() {
  const count = useCounter(1000); // ✅
  return <h1>Seconds passed: {count}</h1>;
}

//useCounter.js✅
import { useState } from "react";
import { useInterval } from "./useInterval.js";

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount((c) => c + 1);
  }, delay);
  return count;
}

// useInterval.js ✅
import { useEffect } from "react";

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

#### |\*第 4 个挑战答案：✅

App 组件 新增 调用 useInterval 每两秒随机更新一次页面背景色。

**更新页面背景色的回调函数因为一些原因从未执行过。**

```js
export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

问题分析：页面背景颜色变化 interval 在触发之前，会被每秒重置一次。

- **因为 useCounter 这个 Hook 调用 useInterval 来每秒更新一次计数器，导致组件重新渲染，重新生成颜色 Interval 的 callback 函数，useInterval 依赖了这个 callback/onTick 函数，所以每秒都会重置** ✅。

修改：**useInterval 内部把 tick 回调函数包裹进一个 Effect Event。✅**

**这将让你可以从 Effect 的依赖项中删掉 onTick。每次组件重新渲染时，Effect 将不会重新同步，所以页面背景颜色变化 interval 有机会触发之前不会每秒重置一次**。

随着这个修改，两个 interval 都会像预期一样工作并且不会互相干扰：

```js
export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback); // ✅👍🏻
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

#### |第 5 个挑战答案：✅

（**很有意思，一个 hook 的 state，依赖另一个 hook 的 state ✅，而且动画不错**）

你想要实现的是一个“交错”运动：每个圆点应该“跟随”它前一个点的路径。例如如果你快速移动光标，第一个点应该立刻跟着它，第二个应该在小小的延时后跟上第一个点，第三个点应该跟着第二个点等等。

你需要实现自定义 Hook useDelayedValue。它当前的实现返回的是提供给它的 value。而你想从 delay 毫秒之前返回 value。你可能需要一些 state 和一个 Effect 来完成这个任务。

这里是一个生效的版本。你将 delayedValue 保存为一个 state 变量。当 value 更新时，Effect 会安排一个 timeout 来更新 delayedValue。这就是 delayedValue 总是“滞后于”实际 value 的原因。

```js
// App.js
import { useState, useEffect } from "react";
import { usePointerPosition } from "./usePointerPosition.js";

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: "pink",
        borderRadius: "50%",
        opacity,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: "none",
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }}
    />
  );
}

// usePointerPosition.js
import { useState, useEffect } from "react";

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);
  return position;
}
```
