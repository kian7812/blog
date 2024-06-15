# 添加交互（文档）

https://zh-hans.react.dev/learn/adding-interactivity

## 响应事件

原生事件遵循，浏览器 DOM 事件模型，捕获、冒泡、默认行为。

- e.stopPropagation() 阻止触发绑定在外层标签上的事件处理函数。
- e.preventDefault() 阻止少数事件的默认浏览器行为。

## |state 如同一张快照 & 把一系列 state 更新加入队列

批量更新的是同一个事件函数中的 state 更新。不同的事件函数中的 state 更新不会批量处理。

1. React 会等到事件处理函数中的 所有 代码都运行完毕再处理你的 state 更新。
2. React 不会跨 多个 需要刻意触发的事件（如点击）进行批处理——每次点击都是单独处理的。

以下是 React 在执行事件处理函数时处理这几行代码的过程：

setNumber(number + 5)：number 为 0，所以 setNumber(0 + 5)。React 将 “替换为 5” 添加到其队列中。
setNumber(n => n + 1)：n => n + 1 是一个更新函数。React 将该函数添加到其队列中。
setNumber(42)：React 将 “替换为 42” 添加到其队列中。

总而言之，以下是你可以考虑传递给 setNumber state 设置函数的内容：

一个更新函数（例如：n => n + 1）会被添加到队列中。
任何其他的值（例如：数字 5）会导致“替换为 5”被添加到队列中，已经在队列中的内容会被忽略。

事件处理函数执行完成后，React 将触发重新渲染。在重新渲染期间，React 将处理队列。更新函数会在渲染期间执行，因此 更新函数必须是 纯函数 并且只 返回 结果。不要尝试从它们内部设置 state 或者执行其他副作用。

- （批量处理底层还是依赖的 lanes，大概率是这个批量的 state 更新设置的 lane 一样）
- （最核心的就是放入队列的是 1.值（当场计算好），2.函数（调用时计算，入参是当时的 state））
- （state 列表放在了 fiber 上，新老 state 对比时不需要触发更新。）
- （闭包问题，应该不是说闭包本身的有问题，如 settimeout，而是回调函数中，如果 set 中是值，那获取值应该在闭包里获取。闭包取值是在定义闭包的作用域取值。这个问题 React 很常见。\*这点很重要）
- （React 都是纯函数，就好理解闭包了，都是存函数，只是每次渲染都重新执行。函数本身时干净的。）

### |更新 state 中的对象 & 更新 state 中的数组

- https://zh-hans.react.dev/learn/updating-objects-in-state
- https://zh-hans.react.dev/learn/updating-arrays-in-state

1. 要用新对象和新数组，赋值更新 state。
2. 都有嵌套对象和数组问题，需要深度替换，可使用 Immer

#### \*数组 state 只需更新要变更的对象，前提是在新的数组里

（嵌套对象也应该是这样）

```ts
// 文档中有
setMyList(
  // 但最外层的数组state要用map重新返回新的✅
  myList.map((artwork) => {
    if (artwork.id === artworkId) {
      // 发生变更的，重新创建✅
      return { ...artwork, seen: nextSeen };
    } else {
      // 没有变更，直接返回✅
      return artwork;
    }
  })
);
```
