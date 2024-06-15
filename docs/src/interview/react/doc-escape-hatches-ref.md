# 脱围机制 - ref（文档）

https://zh-hans.react.dev/learn/escape-hatches

## 使用 ref 引用值

https://zh-hans.react.dev/learn/referencing-values-with-refs

### ref 和 state 的不同之处

1. ref 是一种脱围机制，用于保留不用于渲染的值。 你不会经常需要它们。

2. 更改时不会触发重新渲染

   - 当你希望组件“记住”某些信息，但又不想让这些信息 触发新的渲染 时，你可以使用 ref 。
   - 与 state 不同，设置 ref 的 current 值不会触发重新渲染。

3. 可变

   - ref 是一个普通的 JavaScript 对象，具有可以被读取和修改的 current 属性。
   - 你可以在渲染过程之外修改和更新 current 的值。

4. React 会在每次重新渲染之间保留 ref。
   - 与 state 一样，ref 允许你在组件的重新渲染之间保留信息。
5. 你不应在渲染期间读取（或写入） current 值。（期间指在 渲染 阶段）

   - 不要在渲染过程中读取或写入 ref.current。这使你的组件**难以预测**。（**并不是说使用了就报错了，而是确实是难以预测变量的变化，无法追踪**，所以不符合规范，别用。）

6. 使用场景

   - 当一条信息仅被事件处理器需要，并且更改它不需要重新渲染时，使用 ref 可能会更高效。
   - 由于 interval ID 不用于渲染，你可以将其保存在 ref 中。

7. 立即改变

   - React state 的限制不适用于 ref。例如，state 就像 每次渲染的快照，并且 不会同步更新。但是当你改变 ref 的 current 值时，它会立即改变，这是因为 ref 本身是一个普通的 JavaScript 对象， 所以它的行为就像对象那样。

   ```js
   ref.current = 5;
   console.log(ref.current); // 5
   ```

### \*useRef 内部是如何运行的？

尽管 useState 和 useRef 都是由 React 提供的，原则上 useRef 可以在 useState 的基础上 实现。 你可以想象在 React 内部，useRef 是这样实现的：

```js
// React 内部
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref; // unused 没有被返回 ✅
}
```

第一次渲染期间，useRef 返回 { current: initialValue }。 该对象由 React 存储，因此在下一次渲染期间将返回相同的对象。 请注意，在这个示例中，**state 设置函数没有被用到。它是不必要的，因为 useRef 总是需要返回相同的对象！**

React 提供了一个内置版本的 useRef，因为它在实践中很常见。 但是你可以将其视为没有设置函数的常规 state 变量。 如果你熟悉面向对象编程，ref 可能会让你想起实例字段 —— 但是你写的不是 this.something，而是 somethingRef.current

### 何时使用 ref

通常，当你的组件需要“跳出” React 并与外部 API 通信时，你会用到 ref —— 通常是不会影响组件外观的浏览器 API。以下是这些罕见情况中的几个：

- 存储 timeout ID
- 存储和操作 DOM 元素，我们将在 下一页 中介绍
- 存储不需要被用来计算 JSX 的其他对象。

如果你的组件需要存储一些值，但不影响渲染逻辑，请选择 ref。

### ref 的最佳实践

遵循这些原则将使你的组件更具可预测性：

- **将 ref 视为脱围机制**。当你使用外部系统或浏览器 API 时，ref 很有用。如果你很大一部分应用程序逻辑和数据流都依赖于 ref，你可能需要重新考虑你的方法。
- **不要在渲染过程中读取或写入 ref.current**。 如果渲染过程中需要某些信息，请使用 state 代替。由于 React 不知道 ref.current 何时发生变化，即使在渲染时读取它也会使组件的行为难以预测。（唯一的例外是像 if (!ref.current) ref.current = new Thing() 这样的代码，它只在第一次渲染期间设置一次 ref。）（期间指在 渲染 阶段）

### ref 和 DOM

当你将 ref 传递给 JSX 中的 ref 属性时，比如 `<div ref={myRef}>`，React 会将相应的 DOM 元素放入 myRef.current 中。当元素从 DOM 中删除时，React 会将 myRef.current 更新为 null。

### 尝试一些挑战

第 4 个挑战: 读取最新的 state（这个有点意思 ✅，看文档示例吧）

- 答案:
  state 运作起来 就像快照，因此你无法从 timeout 等异步操作中读取最新的 state。但是，你可以在 ref 中保存最新的输入文本。ref 是可变的，因此你可以随时读取 current 属性。由于当前文本也用于渲染，在这个例子中，**你需要 同时 使用一个 state 变量（用于渲染）和 一个 ref（在 timeout 时读取它）。你需要手动更新当前的 ref 值**。

## 使用 ref 操作 DOM

### \*如何使用 ref 回调管理 ref 列表

另一种解决方案是**将函数传递给 ref 属性**。这称为 **ref 回调**。当需要设置 ref 时，React 将传入 DOM 节点来调用你的 ref 回调，并在需要清除它时传入 null 。这使你可以维护自己的数组或 Map，并通过其索引或某种类型的 ID 访问任何 ref。

在这个例子中，itemsRef 保存的不是单个 DOM 节点，而是保存了包含列表项 ID 和 DOM 节点的 Map。(Ref 可以保存任何值！) 每个列表项上的 ref 回调负责更新 Map：

```js
function getMap() {
  if (!itemsRef.current) {
    // 首次运行时初始化 Map。
    itemsRef.current = new Map();
  }
  return itemsRef.current;
}

...
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Add to the Map
      map.set(cat, node);
    } else {
      // Remove from the Map
      map.delete(cat);
    }
  }}
>

// 19 新版中
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Add to the Map
    map.set(cat, node);

    return () => {
      // Remove from the Map
      map.delete(cat);
    };
  }}
>
```

### 访问另一个组件的 DOM 节点

一个组件可以指定将它的 ref “转发”给一个子组件。下面是 MyInput 如何使用 forwardRef API：

1. `<MyInput ref={inputRef} />` 告诉 React 将对应的 DOM 节点放入 inputRef.current 中。但是，这取决于 MyInput 组件是否允许这种行为， 默认情况下是不允许的。
2. MyInput 组件是使用 forwardRef 声明的。 这让从上面接收的 inputRef 作为第二个参数 ref 传入组件，第一个参数是 props 。
3. MyInput 组件将自己接收到的 ref 传递给它内部的 <input>。

```js
import { forwardRef, useRef } from "react";

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>聚焦输入框</button>
    </>
  );
}
```

#### 使用命令句柄暴露一部分 API

可以用 useImperativeHandle 做到这一点：这里，MyInput 中的 realInputRef 保存了实际的 input DOM 节点。

```js
// 更多看文档
const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // 只暴露 focus，没有别的
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});
```

### \*React 何时添加 refs

- （_1. 如果在渲染期间访问了 dom 的 ref，那 ref 值可能是上一次的，因为最新的在 commit 阶段赋值_。）
- （_2. 如果 "将受影响的 ref.current 值设置为 null" 发生在提交阶段，那 dom 节点 ref 和其它 ref 貌似也没啥区别，应该是这样_。）
- （下面 👇🏻 第 3 个挑战 共 4 个挑战-滚动图像轮播，描述 "请注意，为了强制 React 在滚动前更新 DOM，flushSync 调用是必需的。否则，selectedRef.current 将始终指向之前选择的项目。"，**应该能佐证上面两条猜想是对的**✅）

在 React 中，每次更新都分为 两个阶段：渲染阶段、提交阶段

React 在提交阶段设置 ref.current。**在更新 DOM 之前，React 将受影响的 ref.current 值设置为 null**。更新 DOM 后，React 立即将它们设置到相应的 DOM 节点。

### 用 flushSync 同步更新 state（同时立即更新 DOM）

你可以强制 React 同步更新（“刷新”）DOM。 为此，从 react-dom 导入 flushSync 并将 state 更新包裹 到 flushSync 调用中：

```js
// 更多看文档
function handleAdd() {
  const newTodo = { id: nextId++, text: text };
  flushSync(() => {
    setText("");
    setTodos([...todos, newTodo]);
  });
  listRef.current.lastChild.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
}
```

这将指示 React 当封装在 flushSync 中的代码执行后，立即同步更新 DOM。因此，当你尝试滚动到最后一个待办事项时，它已经在 DOM 中了。

### \*使用 refs 操作 DOM 的最佳实践

Refs 是一种脱围机制。你应该只在你必须“跳出 React”时使用它们。这方面的常见示例包括管理焦点、滚动位置或调用 React 未暴露的浏览器 API。

如果你坚持聚焦和滚动等非破坏性操作，应该不会遇到任何问题。但是，如果你尝试手动修改 DOM，则可能会与 React 所做的更改发生冲突。因为你更改了 DOM，而 React 不知道如何继续正确管理它。

**避免更改由 React 管理的 DOM 节点**。 对 React 管理的元素进行修改、添加子元素、从中删除子元素会导致不一致的视觉结果，或与上述类似的崩溃。

但是，这并不意味着你完全不能这样做。它需要谨慎。 你可以安全地修改 **React 没有理由更新的部分 DOM**。

### \*摘要

- Refs 是一个通用概念，但大多数情况下你会使用它们来保存 DOM 元素。
- 你通过传递 `<div ref={myRef}>` 指示 React 将 DOM 节点放入 myRef.current。
- 通常，你会将 refs 用于非破坏性操作，例如聚焦、滚动或测量 DOM 元素。
- 默认情况下，组件不暴露其 DOM 节点。 您可以通过使用 forwardRef 并将第二个 ref 参数传递给特定节点来暴露 DOM 节点。
- 避免更改由 React 管理的 DOM 节点。
- 如果你确实修改了 React 管理的 DOM 节点，请修改 React 没有理由更新的部分。

### \*第 3 个挑战: 滚动图像轮播

你可以声明一个 selectedRef，然后根据条件将它传递给当前图像：`<li ref={index === i ? selectedRef : null}>`，当 index === i 时，表示图像是被选中的图像，**相应的 `<li>` 将接收到 selectedRef**。**React 将确保 selectedRef.current 始终指向正确的 DOM 节点**。

请注意，为了强制 React 在滚动前更新 DOM，flushSync 调用是必需的。否则，selectedRef.current 将始终指向之前选择的项目。
