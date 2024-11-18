# 状态管理（文档）\*

https://zh-hans.react.dev/learn/managing-state

- 有很多常见问题和实践场景示例 👍🏻
- 纯函数思维 ✅

## 用 State 响应输入

## \*选择 State 结构

摘要
除非您特别想防止更新，否则不要将 props 放入 state 中。
对于选择类型的 UI 模式，请在 state 中保存 ID 或索引而不是对象本身。
如果深度嵌套 state 更新很复杂，请尝试将其展开扁平化。

### 构建 state 的原则

- **合并关联的 state**。如果你总是同时更新两个或更多的 state 变量，请考虑将它们合并为一个单独的 state 变量。
- **避免互相矛盾的 state**。当 state 结构中存在多个相互矛盾或“不一致”的 state 时，你就可能为此会留下隐患。应尽量避免这种情况。（用一个 status 变量来代替它们，这个 state 变量可以采取三种有效状态其中之一。）
- **\*避免冗余的 state**。如果你能在渲染期间从组件的 props 或其现有的 state 变量中计算出一些信息，则不应将这些信息放入该组件的 state 中。（别用 props 和现有 state 作为 另一个 state 初始值）
- **\*避免重复的 state**。当同一数据在多个 state 变量之间或在多个嵌套对象中重复时，这会很难保持它们同步。应尽可能减少重复。（state 和 state 之间数据，不能互相引用。）
- **\*避免深度嵌套的 state**。深度分层的 state 更新起来不是很方便。如果可能的话，最好以扁平化方式构建 state。（或使用 immer）

### \*避免冗余的 state

这个表单有三个 state 变量：firstName、lastName 和 fullName。然而，fullName 是多余的。在渲染期间，你始终可以从 firstName 和 lastName 中计算出 fullName，因此需要把它从 state 中删除。

这里的 **fullName 不是 一个 state 变量。相反，它是在渲染期间中计算出的**：`const fullName = firstName + ' ' + lastName;`（*纯函数思维*✅）（根本不用计算属性，可以看出 Vue 计算属性和 React memo 不全等）

因此，更改处理程序不需要做任何特殊操作来更新它。**当你调用 setFirstName 或 setLastName 时，你会触发一次重新渲染，然后下一个 fullName 将从新数据中计算出来**。（*纯函数思维*✅）

```ts
import { useState } from "react";

export default function Form() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [fullName, setFullName] = useState('');
  // 新增，替代👆🏻✅
  const fullName = firstName + " " + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    // setFullName(e.target.value + ' ' + lastName); // 删除
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    // setFullName(firstName + ' ' + e.target.value); // 删除
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name: <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name: <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

### \*不要在 state 中镜像 props（如果使用要注意命名）

以下代码是体现 state 冗余的一个常见例子：

```ts
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

1. 这里，一个 color state 变量被初始化为 messageColor 的 prop 值。这段代码的问题在于，如果父组件稍后传递不同的 messageColor 值（例如，将其从 'blue' 更改为 'red'），**则 color state 变量将不会更新！ state 仅在第一次渲染期间初始化**。（**why✅**）

这就是为什么在 state 变量中，“镜像”一些 prop 属性会导致混淆的原因。相反，你要在代码中直接使用 messageColor 属性。**如果你想给它起一个更短的名称，请使用常量**：

```ts
function Message({ messageColor }) {
  const color = messageColor;
```

这种写法就不会与从父组件传递的属性失去同步。

2. 只有当你 想要 忽略特定 props 属性的所有更新时，将 props “镜像”到 state 才有意义。按照惯例，prop 名称以 `initial` 或 `default` 开头，以阐明该 prop 的新值将被忽略：（**万一使用呢**✅）

```ts
function Message({ initialColor }) {
  // 这个 `color` state 变量用于保存 `initialColor` 的 **初始值**。
  // 对于 `initialColor` 属性的进一步更改将被忽略。
  const [color, setColor] = useState(initialColor);
```

### \*避免重复的 state （文档示例更完整）

（避免）

1. 当前，**它将所选元素作为对象存储在 selectedItem state 变量中。然而，这并不好：selectedItem 的内容与 items 列表中的某个项是同一个对象。 这意味着关于该项本身的信息在两个地方产生了重复**。

```ts
const [selectedItem, setSelectedItem] = useState(items[0]);
```

2. **问题**，请注意，如果你首先单击菜单上的“Choose” 然后 **编辑它，输入会更新，但底部的标签不会反映编辑内容**。 这是因为你有重复的 state，并且你忘记更新了 selectedItem。

3. **解决**，尽管你也可以更新 selectedItem，但更简单的解决方法是消除重复项。在下面这个例子中，你将 selectedId 保存在 state 中，而不是在 selectedItem 对象中（它创建了一个与 items 内重复的对象），然后 通过搜索 items 数组中具有该 ID 的项，以此获取 selectedItem.

4. 现在，如果你编辑 selected 元素，下面的消息将立即更新。这是因为 setItems 会触发重新渲染，而 items.find(...) 会找到带有更新文本的元素。你不需要在 state 中保存 选定的元素，因为只有 选定的 ID 是必要的。**其余的可以在渲染期间计算**。（纯函数思维 ✅）

5. tip：**更新数组内对象，只需替换要更新的对象，其它 item 可用现有的，前提是在新的数组里**。

```js
import { useState } from "react";

const initialItems = [
  { title: "pretzels", id: 0 },
  { title: "crispy seaweed", id: 1 },
  { title: "granola bar", id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  // const [selectedItem, setSelectedItem] = useState(
  //   items[0]
  // );
  // 新增，替代👆🏻，纯函数思维✅
  const selectedItem = items.find((item) => item.id === selectedId);

  function handleItemChange(id, e) {
    // 数组 state 只需更新要变更的对象 ✅
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            title: e.target.value,
          };
        } else {
          return item;
        }
      })
    );
  }

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={(e) => {
                handleItemChange(item.id, e);
              }}
            />{" "}
            <button
              onClick={() => {
                setSelectedId(item.id);
              }}
            >
              Choose
            </button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```

### 避免深度嵌套的 state

- 如果 state 嵌套太深，难以轻松更新，可以考虑将其“扁平化”。
- 还可以 使用 Immer 使更新逻辑更加简洁。

## 在组件间共享状态

- 状态提升：将相关 state 从这两个组件上移除，并把 state 放到它们的公共父级，再通过 props 将 state 传递给这两个组件。
- 每个状态都对应唯一的数据源。对于每个独特的状态，都应该存在且只存在于一个指定的组件中作为 state。这一原则也被称为拥有 “可信单一数据源”。
- （难道状态库，也是依据状态提升吗）

## \*对 state 进行保留和重置

- （注意：**组件重新渲染和组件重新创建是两回事，重新渲染的组件'实例'不一定被销毁了**✅✅）

- **匹配相同的位置条件：是值树中的位置不变**✅
  - 只相对于直接父节点，和左侧兄弟节点的位置
  - 相同的父级节点，
  - 在父节点中，相对于左侧兄弟节点，自己的位置不变。
  - 不管左侧兄弟节点如何变化，哪怕变成{null}，都算自己位置不变。

摘要：

- 只要在相同位置渲染的是相同组件， React 就会保留状态。
- state 不会被保存在 JSX 标签里。它与你在树中放置该 JSX 的位置相关联。
- 你可以通过为一个子树指定一个不同的 key 来重置它的 state。
- 不要嵌套组件的定义，否则你会意外地导致 state 被重置。

### 状态与渲染树中的位置相关

只要一个组件还被渲染在 UI 树的相同位置，React 就会保留它的 state。 如果它被移除，或者一个不同的组件被渲染在相同的位置，那么 React 就会丢掉它的 state。React 在移除一个组件时，也会销毁它的 state。

下面是两个独立的 counter，因为它们在树中被渲染在了各自的位置。

```js
export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}
```

在 React 中，屏幕中的每个组件都有完全独立的 state。举个例子，当你并排渲染两个 Counter 组件时，它们都会拥有各自独立的 score 和 hover state。

注意 ✅：**这个并不是'就地复用'，组件没有'就地复用'**，和下面的'相同位置'组件被保留，不是一回事。

### \*相同位置的相同组件会使得 state 被保留下来

**对 React 来说重要的是组件在 UI 树中的位置，而不是在 JSX 中的位置**
（意思是：**不管 jsx 各种判断条件，只要函数组件返回的树**✅）。

这个组件在 if 内外有两个 return 语句，它们带有不同的 `<Counter />` JSX 标签。

你可能以为当你勾选复选框的时候 state 会被重置，但它并没有！这是因为 两个 `<Counter />` 标签被渲染在了相同的位置。 React 不知道你的函数里是如何进行条件判断的，**它只会“看到”你返回的树。在这两种情况下，App 组件都会返回一个包裹着 `<Counter />` 作为第一个子组件的 div。这就是 React 认为它们是 同一个 `<Counter />` 的原因**。

你可以认为它们有相同的“地址”：根组件的第一个子组件的第一个子组件。不管你的逻辑是怎么组织的，这就是 React 在前后两次渲染之间将它们进行匹配的方式。

```js
export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={(e) => {
              setIsFancy(e.target.checked);
            }}
          />
          使用好看的样式
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={(e) => {
            setIsFancy(e.target.checked);
          }}
        />
        使用好看的样式
      </label>
    </div>
  );
}
```

### \*相同位置的不同组件会使 state 重置

示例中，你在相同位置对 不同 的组件类型进行切换。刚开始 `<div>` 的第一个子组件是一个 Counter。但是当你切换成 p 时，React 将 Counter 从 UI 树中移除了并销毁了它的状态。

**当你在相同位置渲染不同的组件时，组件的整个子树都会被重置。当子组件 div 从 DOM 中被移除的时候，它底下的整棵树（包含 Counter 以及它的 state）也都被销毁了**。

### \*这也是为什么你不应该把组件函数的定义嵌套起来的原因

示例中， MyTextField 组件被定义在 MyComponent 内部。

每次你点击按钮，输入框的 state 都会消失！这是因为**每次 MyComponent 渲染时都会创建一个 不同 的 MyTextField 函数。你在相同位置渲染的是 不同 的组件**，所以 **React 将其下所有的 state 都重置了**。这样会导致 bug 以及性能问题。为了避免这个问题， 永远要将组件定义在最上层并且**不要把它们的定义嵌套起来**。

```js
import { useState } from "react";

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState("");

    return <input value={text} onChange={(e) => setText(e.target.value)} />;
  }

  return (
    <>
      <MyTextField />
      <button
        onClick={() => {
          setCounter(counter + 1);
        }}
      >
        点击了 {counter} 次
      </button>
    </>
  );
}
```

### \*在相同位置重置 state

**默认情况下，React 会在一个组件保持在同一位置时保留它的 state**。

下面示例中，当你切换玩家时，分数会被保留下来。这两个 Counter 出现在相同的位置，**所以 React 会认为它们是 同一个 Counter**，只是传了不同的 person prop。

但是从概念上讲，**这个应用中的两个计数器应该是各自独立的**。虽然它们在 UI 中的位置相同，但是一个是 Taylor 的计数器，一个是 Sarah 的计数器。

有两个方法可以在它们相互切换时重置 state：

1. **将组件渲染在不同的位置**
2. **使用 key 赋予每个组件一个明确的身份**

```js
// 更多看文档
export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? <Counter person="Taylor" /> : <Counter person="Sarah" />}
      <button
        onClick={() => {
          setIsPlayerA(!isPlayerA);
        }}
      >
        下一位玩家！
      </button>
    </div>
  );
}
```

#### 方法一：将组件渲染在不同的位置:

```js
export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA && <Counter person="Taylor" />}
      {!isPlayerA && <Counter person="Sarah" />}
      <button
        onClick={() => {
          setIsPlayerA(!isPlayerA);
        }}
      >
        下一位玩家！
      </button>
    </div>
  );
}
```

**每当 Counter 组件从 DOM 中移除时，它的 state 会被销毁**。这就是每次点击按钮它们就会被重置的原因。

#### 方法二：使用 key 来重置 state:

- key 不只可以用于列表！**你可以使用 key 来让 React 区分任何组件**。
- **指定一个 key，能够让 React 将 key 本身作为位置的一部分**。

```js
export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button
        onClick={() => {
          setIsPlayerA(!isPlayerA);
        }}
      >
        下一位玩家！
      </button>
    </div>
  );
}
```

- 注意：请记住 key 不是全局唯一的。它们只能指定 父组件内部 的顺序。

#### 使用 key 重置表单

**通过动态改变 key 值**：当你选择一个不同的收件人时， **Chat 组件——包括其下方树中的任何 state——都将从头开始重新创建。 React 还将重新创建 DOM 元素，而不是复用它们**。

```js
export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={(contact) => setTo(contact)}
      />
      <Chat key={to.id} contact={to} /> // 单个组件重新创建的场景，动态改变key值
    </div>
  );
}
```

### 尝试一些挑战

1. 你还可以在 else 分支的 `<Form />` 之前加个 null，以匹配 if 分支的结构（还可以这样..）

```js
  <div>
      {null}
      <Form />
```

2. 其它几个示例，都是指定 key，或动态改变 key，还有不要用 index 作为 key，不准确。

## 迁移状态逻辑至 Reducer 中

- （这一节主要是示例，可以参考 useReducer 一起看）
- （单独抽离 Reducer 确实不错，xxxReducer.js）

**对比 useState 和 useReducer**

Reducers 并非没有缺点！以下是比较它们的几种方法：

1. **代码体积**： 通常，在使用 useState 时，一开始只需要编写少量代码。而 useReducer 必须提前编写 reducer 函数和需要调度的 actions。但是，当多个事件处理程序以相似的方式修改 state 时，useReducer 可以减少代码量。
2. **可读性**： 当状态更新逻辑足够简单时，useState 的可读性还行。但是，一旦逻辑变得复杂起来，它们会使组件变得臃肿且难以阅读。在这种情况下，useReducer 允许你将状态更新逻辑与事件处理程序分离开来。
3. **可调试性**： 当使用 useState 出现问题时, 你很难发现具体原因以及为什么。 而使用 useReducer 时， 你可以在 reducer 函数中通过打印日志的方式来观察每个状态的更新，以及为什么要更新（来自哪个 action）。 如果所有 action 都没问题，你就知道问题出在了 reducer 本身的逻辑中。 然而，与使用 useState 相比，你必须单步执行更多的代码。
4. **可测试性**： reducer 是一个不依赖于组件的纯函数。这就意味着你可以单独对它进行测试。一般来说，我们最好是在真实环境中测试组件，但对于复杂的状态更新逻辑，针对特定的初始状态和 action，断言 reducer 返回的特定状态会很有帮助。
5. **个人偏好**： 并不是所有人都喜欢用 reducer，没关系，这是个人偏好问题。你可以随时在 useState 和 useReducer 之间切换，它们能做的事情是一样的！

如果你在修改某些组件状态时经常出现问题或者想给组件添加更多逻辑时，我们建议你还是使用 reducer。当然，你也不必整个项目都用 reducer，这是可以自由搭配的。你甚至可以在一个组件中同时使用 useState 和 useReducer。

**编写一个好的 reducers**

编写 reducers 时最好牢记以下两点：

1. **reducers 必须是纯粹的**。 这一点和 状态更新函数 是相似的，reducers 是在渲染时运行的！（actions 会排队直到下一次渲染）。 这就意味着 reducers 必须纯净，即当输入相同时，输出也是相同的。它们不应该包含异步请求、定时器或者任何副作用（对组件外部有影响的操作）。它们应该以不可变值的方式去更新 对象 和 数组。
2. **每个 action 都描述了一个单一的用户交互**，即使它会引发数据的多个变化。 举个例子，如果用户在一个由 reducer 管理的表单（包含五个表单项）中点击了 重置按钮，那么 dispatch 一个 reset_form 的 action 比 dispatch 五个单独的 set_field 的 action 更加合理。如果你在一个 reducer 中打印了所有的 action 日志，那么这个日志应该是很清晰的，它能让你以某种步骤复现已发生的交互或响应。这对代码调试很有帮助！

**使用 Immer 简化 reducers**

与在平常的 state 中 修改对象 和 数组 一样，你可以使用 Immer 这个库来简化 reducer。

## 使用 Context 深层传递参数

- （这节示例主要讲了，嵌套组件**如何覆盖 context**。）

**Context 的使用场景**

1. 主题： 如果你的应用允许用户更改其外观（例如暗夜模式），你可以在应用顶层放一个 context provider，并在需要调整其外观的组件中使用该 context。
2. 当前账户： 许多组件可能需要知道当前登录的用户信息。将它放到 context 中可以方便地在树中的任何位置读取它。某些应用还允许你同时操作多个账户（例如，以不同用户的身份发表评论）。在这些情况下，将 UI 的一部分包裹到具有不同账户数据的 provider 中会很方便。
3. 路由： 大多数路由解决方案在其内部使用 context 来保存当前路由。这就是每个链接“知道”它是否处于活动状态的方式。如果你创建自己的路由库，你可能也会这么做。
4. 状态管理： 随着你的应用的增长，最终在靠近应用顶部的位置可能会有很多 state。许多遥远的下层组件可能想要修改它们。通常 将 reducer 与 context 搭配使用来管理复杂的状态并将其传递给深层的组件来避免过多的麻烦。

Context 不局限于静态值。如果你在下一次渲染时传递不同的值，React 将会更新读取它的所有下层组件！这就是 context 经常和 state 结合使用的原因。

一般而言，如果树中不同部分的远距离组件需要某些信息，context 将会对你大有帮助。

**摘要**

1. Context 使组件向其下方的整个树提供信息。
2. 传递 Context 的方法:
   - 通过 export const MyContext = createContext(defaultValue) 创建并导出 context。
   - 在无论层级多深的任何子组件中，把 context 传递给 useContext(MyContext) Hook 来读取它。
   - 在父组件中把 children 包在 `<MyContext.Provider value={...}>` 中来提供 context。
3. Context 会穿过中间的任何组件。
4. Context 可以让你写出 “较为通用” 的组件。
5. 在使用 context 之前，先试试传递 props 或者将 JSX 作为 children 传递。

## ⭐️ 用 Reducer 和 Context 拓展你的应用

- （这节**抽离 TasksContext.js 实践**很有用 ✅）

所有的 context 和 reducer 连接部分都在 TasksContext.js 中。这保持了组件的干净和整洁，让我们专注于它们显示的内容，而不是它们从哪里获得数据：

```js
import { createContext, useContext, useReducer } from "react";

const TasksContext = createContext(null); // ✅ 这个context负责：提供当前的 tasks 列表

const TasksDispatchContext = createContext(null); // ✅ 这个context负责：提供了一个函数可以让组件分发动作

// ✅ 声明一个新的 TasksProvider 组件。此组件将所有部分连接在一起：
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

// ✅ hook useTasks： 进一步分割这些 context 或向这些函数添加一些逻辑
export function useTasks() {
  return useContext(TasksContext);
}
// ✅ hook useTasksDispatch： 进一步分割这些 context 或向这些函数添加一些逻辑
export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added": {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case "changed": {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case "deleted": {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: "Philosopher’s Path", done: true },
  { id: 1, text: "Visit the temple", done: false },
  { id: 2, text: "Drink matcha", done: false },
];
```
