# 描述 UI（文档）

https://zh-hans.react.dev/learn/describing-the-ui

## 你的第一个组件

React 组件是常规的 JavaScript 函数，但组件的名称必须以大写字母开头，否则它们将无法运行！

React 是常规的 JavaScript 函数，除了：
- 它们的名字总是以大写字母开头。
- 它们返回 JSX 标签。

### 陷阱：不要在组件中定义组件

组件可以渲染其他组件，但是 请不要嵌套他们的定义：

```js
export default function Gallery() {
  // 🔴 永远不要在组件中定义组件
  function Profile() {
    // ...
  }
  // ...
}
```

上面这段代码 非常慢，并且会导致 bug 产生。因此，你应该在顶层定义每个组件：

```js
export default function Gallery() {
  // ...
}

// ✅ 在顶层声明组件
function Profile() {
  // ...
}
```

### 组件中可以添加条件返回 jsx

（这和上面组件中定义组件是不一样的）

```ts
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}

```


## 使用 JSX 书写标签语言

https://zh-hans.react.dev/learn/writing-markup-with-jsx

JSX 规则 ：

1. 只能返回一个根元素。如果你不想在标签中增加一个额外的 `<div>`，可以用 <> 和 </> 元素来代替。这个空标签被称作 `Fragment`。
2. 标签必须闭合。
3. 使用驼峰式命名法给大部分属性命名！

### 为什么多个 JSX 标签需要被一个父元素包裹？ 

JSX 虽然看起来很像 HTML，但在底层其实被转化为了 JavaScript 对象，你不能在一个函数中返回多个对象，除非用一个数组把他们包装起来。这就是为什么多个 JSX 标签必须要用一个父元素或者 Fragment 来包裹。

### JSX 中的 内联样式

当你需要内联样式的时候，你可以给 style 属性传递一个对象。

内联 style 属性 使用驼峰命名法编写。

```ts
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

## 将 Props 传递给组件

https://zh-hans.react.dev/learn/passing-props-to-a-component

摘要
- 要传递 props，请将它们添加到 JSX，就像使用 HTML 属性一样。
- 要读取 props，请使用 function Avatar({ person, size }) 解构语法。
- 你可以指定一个默认值，如 size = 100，用于缺少值或值为 undefined 的 props 。
- 你可以使用 `<Avatar {...props} />` JSX 展开语法转发所有 props，但不要过度使用它！
- 像 `<Card><Avatar /></Card>` 这样的嵌套 JSX，将被视为 Card 组件的 children prop。
- Props 是只读的时间快照：每次渲染都会收到新版本的 props。
- 你不能改变 props。当你需要交互性时，你可以设置 state。


### props.children 代表插槽内容

父组件通过名为 children 的 prop 中接收到内容。

```js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

## 条件渲染*

https://zh-hans.react.dev/learn/conditional-rendering

在 React 中，你可以通过使用 JavaScript 的 if 语句、&& 和 ? : 运算符来选择性地渲染 JSX。

摘要
- 在 React，你可以使用 JavaScript 来控制分支逻辑。
- 你可以使用 if 语句来选择性地返回 JSX 表达式。
- 你可以选择性地将一些 JSX 赋值给变量，然后用大括号将其嵌入到其他 JSX 中。
- 在 JSX 中，`{cond ? <A /> : <B />}` 表示 “当 cond 为真值时, 渲染 `<A />`，否则 `<B />`”。
- 在 JSX 中，`{cond && <A />}` 表示 “当 cond 为真值时, 渲染 `<A />`，否则不进行渲染”。
- 快捷的表达式很常见，但如果你更倾向于使用 if，你也可以不使用它们。



### 通过 if 语句

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}
```

### 选择性地返回 null

在一些情况下，你不想有任何东西进行渲染。这种情况下，你可以直接返回 null。通常情况下，你可以在父组件里选择是否要渲染该组件。

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}
```

### 三目运算符（? :）

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}
```

### 与运算符（&&）

当 JavaScript && 表达式 的左侧（我们的条件）为 true 时，它则返回其右侧的值。但条件的结果是 false，则整个表达式会变成 false。在 JSX 里，**React 会将 false 视为一个“空值”，就像 null 或者 undefined，这样 React 就不会在这里进行任何渲染**。

陷阱：切勿将数字放在 && 左侧.
- 如果左侧是 0，整个表达式将变成左侧的值（0），React 此时则会渲染 0 而不是不进行渲染。

### 选择性地将 JSX 赋值给变量

跟之前的一样，这个方式不仅仅适用于文本，任意的 JSX 均适用：
```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}
```


### 注意：JSX 元素不是“实例”

因为它们没有内部状态也不是真实的 DOM 节点。

（应该是 createElement 和 createFiberNode 是不一样的）


## 渲染列表

https://zh-hans.react.dev/learn/rendering-lists

1. React 中使用 filter() 筛选需要渲染的组件。
2. React 中使用**使用 map() 把数组转换成组件数组**。（列表渲染使用map）

### 用 key 保持列表项的顺序 

1. 它可以是字符串或数字的形式
2. 直接放在 map() 方法里的 JSX 元素一般都需要指定 key 值！
3. Fragment 语法的简写形式 <> </> 无法接受 key 值。

### 如何设定 key 值 

1. 来自数据库的数据：如果你的数据是从数据库中获取的。
2. 本地产生数据： 可以使用一个自增计数器或者一个类似 uuid 的库来生成 key。

### key 需要满足的条件：*
1. key 值在兄弟节点之间必须是唯一的。 不过不要求全局唯一，在不同的数组中可以使用相同的 key。
2. key 值不能改变，否则就失去了使用 key 的意义！所以千万不要在渲染时动态地生成 key。

### React 中为什么需要 key？

从众多的兄弟元素中唯一标识出某一项（JSX 节点或文件）。它使 React 能追踪这些组件，即便后者的位置或数据发生了变化。

### key 陷阱：

1. 你可能会想直接把数组项的索引当作 key 值来用，实际上，如果你没有显式地指定 key 值，React 确实默认会这么做。但是数组项的顺序在插入、删除或者重新排序等操作中会发生改变，此时把索引顺序用作 key 值会产生一些微妙且令人困惑的 bug。
2. 与之类似，请不要在运行过程中动态地产生 key，像是 key={Math.random()} 这种方式。这会导致每次重新渲染后的 key 值都不一样，从而使得所有的组件和 DOM 元素每次都要重新创建。这不仅会造成运行变慢的问题，更有可能导致用户输入的丢失。所以，使用能从给定数据中稳定取得的值才是明智的选择。
3. 有一点需要注意，组件不会把 key 当作 props 的一部分。Key 的存在只对 React 本身起到提示作用。如果你的组件需要一个 ID，那么请把它作为一个单独的 prop 传给组件： `<Profile key={id} userId={id} />`。

## 保持组件纯粹

https://zh-hans.react.dev/learn/keeping-components-pure

- **React 假设你编写的所有组件都是纯函数。也就是说，对于相同的输入，你所编写的 React 组件必须总是返回相同的 JSX**。
- React 的渲染过程必须自始至终是纯粹的，组件应该只 返回 它们的 JSX，而不 改变 在渲染前，就已存在的任何对象或变量 — 这将会使它们变得不纯粹！
- 当你的组件正在渲染时，你永远不应该改变预先存在的变量或对象。**（预先存在：数作用域外的变量、状态变量）**
- **在 React 中，你可以在渲染时读取三种输入：props，state 和 context。你应该始终将这些输入视为只读。（渲染过程中不能修改）**
- 每个组件是独立的。


### 纯函数：组件作为公式

1. 只负责自己的任务。它不会更改在该函数调用前就已存在的对象或变量。
2. 输入相同，则输出相同。给定相同的输入，纯函数应总是返回相同的结果。

```js
// double() 就是一个 纯函数。如果你传入 3 ，它将总是返回 6 。
function double(number) {
  return 2 * number;
} 
```

### 不纯粹示例

- 该组件正在读写其外部声明的 guest 变量。这意味着 多次调用这个组件会产生不同的 JSX！
- 每次渲染都更改了预先存在的变量！

```js
let guest = 0;

function Cup() {
  // Bad：正在更改预先存在的变量！
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

可以 将 guest 作为 prop 传入 来修复此组件，现在你的组件就是纯粹的，因为它返回的 JSX 只依赖于 guest prop。

### 局部 mutation

上述示例的问题出在渲染过程中，组件改变了 预先存在的 变量的值。这种现象称为 突变（mutation） 。纯函数不会改变函数作用域外的变量、或在函数调用前创建的对象——这会使函数变得不纯粹！

**但是，你完全可以在渲染时更改你 刚刚 创建的变量和对象**。

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

### 哪些地方 可能 引发副作用

函数式编程在很大程度上依赖于纯函数，但 某些事物 在特定情况下不得不发生改变。这是编程的要义！这些变动包括更新屏幕、启动动画、更改数据等，它们被称为 副作用。**它们是 “额外” 发生的事情，与渲染过程无关**。

**在 React 中，副作用通常属于 事件处理程序**。事件处理程序是 React 在你执行某些操作（如单击按钮）时运行的函数。即使事件处理程序是在你的组件 内部 定义的，**它们也不会在渲染期间运行！ 因此事件处理程序无需是纯函数**。

如果你用尽一切办法，仍无法为副作用找到合适的事件处理程序，**你还可以调用组件中的 useEffect 方法**将其附加到返回的 JSX 中。这会告诉 React 在渲染结束后执行它。然而，**这种方法应该是你最后的手段**。

### React 为何侧重于纯函数? 

1. 组件可以在不同的环境下运行。例如，在服务器上！由于它们针对相同的输入，总是返回相同的结果，因此一个组件可以满足多个用户请求。
2. 可以为那些输入未更改的组件来 跳过渲染，以提高性能。因为纯函数总是返回相同的结果。
3. 纯粹性使得它随时可以安全地停止计算。如果在渲染深层组件树的过程中，某些数据发生了变化，React 可以重新开始渲染，而不会浪费时间完成过时的渲染。

我们正在构建的每个 React 新特性都利用到了纯函数。从数据获取到动画再到性能，保持组件的纯粹可以充分释放 React 范式的能力。


## 将 UI 视为树

渲染树有助于识别顶级组件和叶子组件。顶级组件会影响其下所有组件的渲染性能，而叶子组件通常会频繁重新渲染。识别它们有助于理解和调试渲染性能问题。

