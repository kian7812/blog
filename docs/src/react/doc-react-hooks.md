# Hooks 详解和实践（文档）

- 官方：https://zh-hans.react.dev/ （多看文档，文档讲的很清楚了，实践、陷阱都有、如何实现 XXX 的设计的思路 ✅）
- 包括：useState useReducer useContext useRef useImperativeHandle

## |useState

https://zh-hans.react.dev/reference/react/useState

**参数**：

initialState 在初始渲染后，此参数将被忽略。

**返回**：useState 返回一个由两个值组成的数组：

1. 当前的 state。
2. set 函数，它可以让你将 state 更新为不同的值并触发重新渲染。

**注意事项**：

1. set 函数 仅更新 下一次 渲染的状态变量。如果在调用 set 函数后读取状态变量，则 仍会得到在调用之前显示在屏幕上的旧值。
2. 如果你提供的新值与当前 state 相同（由 Object.is 比较确定），React 将 跳过重新渲染该组件及其子组件。
3. React 会 批量处理状态更新。它会在所有 事件处理函数运行 并调用其 set 函数后更新屏幕。这可以防止在单个事件期间多次重新渲染。在某些罕见情况下，你需要强制 React 更早地更新屏幕，例如访问 DOM，你可以使用 flushSync。

### |用法

...

#### |为组件添加状态

陷阱：调用 set 函数 不会 改变已经执行的代码中当前的 state

#### |根据先前的 state 更新 state

点击一次后，age 将只会变为 43 而不是 45！(函数调用时，状态 age 一直是 42)

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

为了解决这个问题，你可以向 setAge 传递一个 更新函数。
React 将更新函数放入 队列 中。然后，在下一次渲染期间，它将按照相同的顺序调用它们。

现在没有其他排队的更新，因此 React 最终将存储 45 作为当前状态。

```js
function handleClick() {
  setAge((a) => a + 1); // setAge(42 => 43)
  setAge((a) => a + 1); // setAge(43 => 44)
  setAge((a) => a + 1); // setAge(44 => 45)
}
```

是否总是优先使用更新函数？是的

#### |更新状态中的对象和数组

你可以将对象和数组放入状态中。在 React 中，状态被认为是只读的，因此 你应该替换它而不是改变现有对象。

状态中的对象和数组的示例（文档中有 4 个示例 ✅）

第 3 个示例: 列表（数组）

```js
function handleAddTodo(title) {
  // 直接创建新数组
  setTodos([
    ...todos,
    {
      id: nextId++,
      title: title,
      done: false,
    },
  ]);
}

function handleChangeTodo(nextTodo) {
  setTodos(
    // 但最外层的数组state要用map重新返回新的✅
    todos.map((t) => {
      if (t.id === nextTodo.id) {
        // 发生变更的，重新创建✅
        return nextTodo;
      } else {
        // 没有变更，直接返回✅
        return t;
      }
    })
  );
}

function handleDeleteTodo(todoId) {
  // 但最外层的数组state要用filter重新返回新的✅
  setTodos(todos.filter((t) => t.id !== todoId));
}
```

（**1. 最外层对象和数组必须返回新的，2. 里面的只需要重新创建变更的。3. 如果是嵌套层很多呢**?✅）

#### |避免重复创建初始状态

React 只在初次渲染时保存初始状态，后续渲染时将其忽略。

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

尽管 **createInitialTodos()** 的结果仅用于初始渲染，但你**仍然在每次渲染时调用此函数**。如果它创建大数组或执行昂贵的计算，这可能会浪费资源。

为了解决这个问题，你可以将它 作为初始化函数传递给 useState：

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

**请注意，你传递的是 createInitialTodos 函数本身，而不是 createInitialTodos() 调用该函数的结果。如果将函数传递给 useState，React 仅在初始化期间调用它 ✅**。（当组件重新渲染，它不会再次运行。）

React 在开发模式下可能会调用你的 初始化函数 两次，以验证它们是否是 纯函数。

（_被忽略的意思是不被使用，如果初始化函数每次重新渲染还是被执行，只是结果不被使用，这个理解不对 ❎_）

#### |使用 key 重置状态

在 渲染列表 时，你经常会遇到 key 属性。然而，它还有另外一个用途。

**你可以 通过向组件传递不同的 key 来重置组件的状态。在这个例子中，重置按钮改变 version 状态变量，我们将它作为一个 key 传递给 Form 组件。当 key 改变时，React 会从头开始重新创建 Form 组件（以及它的所有子组件），所以它的状态被重置了**✅。

#### |存储前一次渲染的信息

在极少数情况下，你可能希望在响应渲染时调整状态——例如，当 props 改变时，你可能希望改变状态变量。

### |疑难解答

...

#### |我已经更新了状态，但日志仍显示旧值

...

#### |我已经更新了状态，但是屏幕没有更新

...

#### |出现错误：“Too many re-renders”

有时可能会出现错误：“Too many re-renders”。React 会限制渲染次数，以防止进入无限循环。通常，这意味着 在渲染期间 无条件地设置状态，因此组件进入循环：渲染、设置状态（导致重新渲染）、渲染、设置状态（导致重新渲染）等等。通常，这是由错误地指定事件处理函数时引起的：

```js
// 🚩 错误：在渲染过程中调用事件处理函数
return <button onClick={handleClick()}>Click me</button>;

// ✅ 正确：将事件处理函数传递下去
return <button onClick={handleClick}>Click me</button>;

// ✅ 正确：传递一个内联函数
return <button onClick={(e) => handleClick(e)}>Click me</button>;
```

#### |初始化函数或更新函数运行了两次（问题）

在 严格模式 下，React 会调用你的某些函数两次而不是一次.
这种 仅在开发环境下生效 的行为有助于 保持组件的纯粹性。
这就是为什么 React 调用它两次可以帮助你找到错误的原因。只有组件、初始化函数和更新函数需要是纯粹的。

#### |我尝试将 state 设置为一个函数，但它却被调用了

你不能像这样把函数放入状态：

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

因为你传递了一个函数，React 认为 someFunction 是一个 初始化函数，而 someOtherFunction 是一个 更新函数。你必须在两种情况下在它们之前加上 () =>。然后 React 将存储你传递的函数。

```js
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```

## |useReducer

- 👍🏻 https://zh-hans.react.dev/reference/react/useReducer （多复习文档）
- https://zh-hans.react.dev/learn/extracting-state-logic-into-a-reducer todo

### |使用方式

1. useReducer 函数：

   - const [state, dispatch] = useReducer(reducer, initialArg, init?)
   - state 的类型也是任意的，一般会使用对象或数组。
   - initialArg：用于初始化 state 的任意值。初始值的计算逻辑取决于接下来的 init 参数。
   - 可选参数 init：用于计算初始值的函数。如果存在，使用 **init(initialArg) 的执行结果作为初始值**，否则使用 initialArg。(**initialArg 会默认作为 init 的参数**✅)

2. reducer(state, action) 函数：

   - 参数为当前的 state 与传递的 action。
   - reducer 是用于更新 state 的纯函数，参数为 state 和 action，返回值是更新后的 state。
   - 一般定义到组件外部。

3. dispatch 函数：

   - 用于：调用 reducer 函数更新 state 并触发组件的重新渲染。
   - 过程：React 会把**当前的 state** 和这个 action 一起作为参数传给 reducer 函数，然后 reducer 计算并返回新的 state，最后 React 保存新的 state，并使用它渲染组件和更新 UI。
   - 参数就一个：是 action，通常是一个对象，其中 type 属性标识类型，还有其它属性用于计算新的 state 值所必须的数据（payload）。
   - 返回值：没有。

注意：

- dispatch 函数 是为下一次渲染而更新 state。因此在调用 dispatch 函数后读取 state 并不会拿到更新后的值，也就是说只能获取到调用前的值。
- 如果你提供的新值与当前的 state 相同（**使用 Object.is 比较**），React 会 跳过组件和子组件的重新渲染，这是一种优化手段。虽然**在跳过重新渲染前 React 可能会调用你的组件**，但是这不应该影响你的代码。（？）
- React 会批量更新 state。state 会在 所有事件函数执行完毕 并且已经调用过它的 set 函数后进行更新，这可以防止在一个事件中多次进行重新渲染。如果在访问 DOM 等极少数情况下需要强制 React 提前更新，可以使用 flushSync。

### |用法

...

#### |向组件添加 reducer

useReducer 和 useState 非常相似，但是它可以让你把状态更新逻辑从事件处理函数中移动到组件外部。

#### |实现 reducer 函数

...

#### |避免重新创建初始值

通过给 useReducer 的第三个参数传入 初始化函数 来解决这个问题。
需要注意的是你传入的参数是 createInitialState 这个 函数自身，而不是执行 createInitialState() 后的返回值。这样传参就可以保证初始化函数不会再次运行。（同 useState）

```js
function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

```js
function TodoList({ username }) {
  // (**username 会默认作为 createInitialState 的参数**✅)
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

### |疑难解答

...

#### |我已经 dispatch 了一个 action，但是打印出来仍然还是旧的 state

如果你需要获取更新后的 state，可以手动调用 reducer 来得到结果：

```js
const action = { type: "incremented_age" };
dispatch(action);

const nextState = reducer(state, action); // 还可以这样 ✅
console.log(state); // { age: 42 }
console.log(nextState); // { age: 43 }
```

#### |我已经 dispatch 了一个 action，但是屏幕并没有更新

React 使用 Object.is 比较更新前后的 state，如果 它们相等就会跳过这次更新。这通常是因为你直接修改了对象或数组。

#### |在 dispatch 后 state 的某些属性变为了 undefined & 在 dispatch 后整个 state 都变为了 undefined

#### |我收到了一个报错：“Too many re-renders”

你可能会收到这样一条报错信息：Too many re-renders. React limits the number of renders to prevent an infinite loop.。这通常是在 渲染期间 dispatch 了 action 而导致组件进入了无限循环：dispatch（会导致一次重新渲染）、渲染、dispatch（再次导致重新渲染），然后无限循环。大多数这样的错误是由于事件处理函数中存在错误的逻辑：

```js
// 🚩 错误：渲染期间调用了处理函数
return <button onClick={handleClick()}>Click me</button>;

// ✅ 修复：传递一个处理函数，而不是调用
return <button onClick={handleClick}>Click me</button>;

// ✅ 修复：传递一个内联的箭头函数
return <button onClick={(e) => handleClick(e)}>Click me</button>;
```

#### |我的 reducer 和初始化函数运行了两次

严格模式 下 React 会调用两次 reducer 和初始化函数，但是这不应该会破坏你的代码逻辑。

这个 仅限于开发模式 的行为可以帮助你 保持组件纯粹：React 会使用其中一次调用结果并忽略另一个结果。

这就是 React 如何通过调用两次函数来帮助你发现错误。**只有组件、初始化函数和 reducer 函数需要是纯函数**。事件处理函数不需要实现为纯函数，并且 React 永远不会调用事件函数两次。

#### |其它-dispatch 不必出现在 effect 的依赖中

https://juejin.cn/post/7244876679041794105

```js
function DispatchDemo(props: { step: number }) {
  function reducer(value: number) {
    // 始终能访问到最新的 step
    return props.step + value;
  }
  const [value, dispatch] = useReducer(reducer, 0);
  useEffect(() => {
    document.body.addEventListener("click", dispatch);
    return () => {
      document.body.removeEventListener("click", dispatch);
    };
  }, []);

  return; // todo
}
```

上述代码 useEffect 的第二个参数为空数组，这意味着 effect 只在组件初始渲染时执行。**由于 React 会让 dispatch 在组件的每次渲染中保持唯一的引用**，所以 dispatch 不必出现在 effect 的依赖中，此特性与 ref 类似。虽然 dispatch 的引用保持不变，但它能调用组件本次渲染时的 reducer，在 reducer 作用域将得到最新的 state 和 props。

## useContext\*

### |定义

const SomeContext = createContext(defaultValue)

useContext(SomeContext)

1. SomeContext：是先前用 **createContext** 创建的 context。context 本身不包含信息，它只代表你可以提供或从组件中读取的信息类型。
2. SomeContext.Provider 提供 value
3. 组件调用 useContext(SomeContext) 返回 SomeContext 的 value 值

注意：

1. **useContext() 总是在调用它的组件 上面 寻找最近的 provider**。它向上搜索，不考虑 调用 useContext() 的组件中的 provider。（不考虑和它在同一组件的 provider✅）
1. 为了确定 context 值，React 搜索组件树，为这个特定的 context 向上查找最近的 context provider。
1. 组件中的 useContext() 调用不受 同一 组件返回的 provider 的影响。相应的 `<Context.Provider>` 需要位于调用 useContext() 的组件 之上。
1. 如果没有这样的 provider，那么返回值将会是为创建该 context 传递给 createContext 的 defaultValue。

1. **从 provider 接收到不同的 value 开始，React 自动重新渲染使用了该特定 context 的所有子级。先前的值和新的值会使用 Object.is 来做比较。使用 memo 来跳过重新渲染并不妨碍子级接收到新的 context 值**。

### |用法

···

#### |向组件树深层传递数据

···

#### |通过 context 更新传递的数据

通常，你会希望 context 随着时间的推移而改变。要更新 context，请将其与 state 结合。在父组件中声明一个状态变量，并将当前状态作为 context value 传递给 provider。

**更新 context 的例子：✅**

- 第 4 个示例: 把 provider 抽离成组件。如果你从审美上不喜欢这种嵌套，你可以将 provider 抽离成单独的组件。
- 第 5 个示例: 使用 context 和 reducer 进行扩展。在大型应用程序中，通常将 context 和 reducer 结合起来从组件中抽离与某种状态相关的逻辑。在本例中，所有的“线路”都隐藏在 TasksContext.js 中，它包含一个 reducer 和两个单独 context。

#### |指定后备方案默认值

如果 React 没有在父树中找到该特定 context 的任何 provider，useContext() 返回的 context 值将等于你在 创建 context 时指定的 默认值：const ThemeContext = createContext(null);

**默认值 从不改变**。如果你想要更新 context，请按 上述方式 将其与状态一起使用。

通常，除了 null，还有一些更有意义的值可以用作默认值，例如：

const ThemeContext = createContext('light');

#### |覆盖组件树一部分的 context

通过在 provider 中使用不同的值包装树的某个部分，可以覆盖该部分的 context。

```js
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

你可以根据需要多次嵌套和覆盖 provider。

**第 2 个示例**: 自动嵌套标题。在嵌套使用 context provider 时，可以“累积”信息。在此示例中，Section 组件记录了 LevelContext，该 context 指定了 section 嵌套的深度。它从父级 section 中读取 LevelContext，然后把 LevelContext 的数值加一传递给子级。因此，Heading 组件可以根据被 Section 组件嵌套的层数自动决定使用 `<h1>，<h2>，<h3>`，…，中的哪种标签。（有点意思 ✅）

#### |在传递对象和函数时优化重新渲染

你可以通过 context 传递任何值，包括对象和函数。

```js
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      <Page />
    </AuthContext.Provider>
  );
}
```

此处，context value 是一个具有两个属性的 JavaScript 对象，其中一个是函数。**每当 MyApp 出现重新渲染（例如，路由更新）时，这里将会是一个 不同的 对象指向 不同的 函数，因此 React 还必须重新渲染树中调用 useContext(AuthContext) 的所有组件**✅。

在较小的应用程序中，这不是问题。但是，如果基础数据如 currentUser 没有更改，则不需要重新渲染它们。为了帮助 React 利用这一点，**你可以使用 useCallback 包装 login 函数，并将对象创建包装到 useMemo 中。这是一个性能优化的例子**✅：

这样，即使 MyApp 需要重新渲染，调用 useContext(AuthContext) 的组件也不需要重新渲染，除非 currentUser 发生了变化。

```js
import { useCallback, useMemo } from "react";

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  // ✅
  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  // ✅
  const contextValue = useMemo(
    () => ({
      currentUser,
      login,
    }),
    [currentUser, login]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

### |疑难解答

···

#### |我的组件获取不到 provider 传递的值

这里有几种常见的情况会引起这个问题：

1. 你在调用 useContext() 的同一组件（或下层）渲染 `<SomeContext.Provider>。把 <SomeContext.Provider>` 向调用 useContext() 组件 之上和之外 移动。
2. 你可能忘记了使用 `<SomeContext.Provider>` 包装组件，或者你可能将组件放在树的不同部分。使用 React DevTools 检查组件树的层级是否正确。
3. 你的工具可能会遇到一些构建问题，导致你在传值组件中的所看到的 SomeContext 和读值组件中所看到的 SomeContext 是两个不同的对象。

#### |尽管设置了不一样的默认值，但是我总是从 context 中得到 undefined

你可能在组件树中有一个没有设置 value 的 provider

注意，只有在 上层根本没有匹配的 provider 时才使用 createContext(defaultValue)调用的默认值。如果存在 `<SomeContext.Provider value={undefined}>` 组件在父树的某个位置，调用 useContext(SomeContext) 的组件 将会 接收到 undefined 作为 context 的值。

### |其它-减少不必要的重新渲染

https://juejin.cn/post/7244818537776136247

**只要 context value 被更新，那么订阅该 context 的组件一定会重新渲染**，而不管 context value 中更新的那部分值是否被它使用，也不管它的祖先组件是否跳过重新渲染，所以推荐将不同职责的数据保存到不同的 context 中，以减少不必要的重新渲染。

**如果 Context.Provider 的 value 属性传递了一个对象字面量，那么 Context.Provider 的父组件每一次重新渲染都会使 context value 更新，进而导致订阅该 context 的组件重新渲染**，所有应该避免给 Context.Provider 的 value 传对象字面量。

## |useRef

useRef 是一个 React Hook，它能帮助引用一个不需要渲染的值。
const ref = useRef(initialValue)

### |参考

1. 参数：initialValue：ref 对象的 current 属性的初始值。可以是任意类型的值。这个参数在首次渲染后被忽略。
2. 返回值：useRef 返回一个只有一个属性的对象。
   - current：初始值为传递的 initialValue。之后可以将其设置为其他值。
   - 如果将 ref 对象作为一个 JSX 节点的 ref 属性传递给 React，React 将为它设置 current 属性。
   - 在后续的渲染中，useRef 将返回同一个对象。
3. 参数 initialValue，ref 对象的 current 属性的初始值。在首次渲染后被忽略。（下面有它的优化）

注意：

1. 可以修改 ref.current 属性。与 state 不同，它是可变的。然而，如果它持有一个用于渲染的对象（例如 state 的一部分），那么就不应该修改这个对象。
2. 改变 ref.current 属性时，React 不会重新渲染组件。React 不知道它何时会发生改变，因为 ref 是一个普通的 JavaScript 对象。
3. 除了 初始化 外不要在渲染期间写入或者读取 ref.current，否则会使组件行为变得不可预测。（说明在 👇🏻 下面多好）
4. 在严格模式下，React 将会 调用两次组件方法，这是为了 帮助发现意外问题。但这只是开发模式下的行为，不会影响生产模式。
   - 改变 ref 不会触发重新渲染，所以 ref 不适合用于存储期望显示在屏幕上的信息。如有需要，使用 state 代替。
   - React 期望组件主体表现得像一个纯函数。只能（props、state 与 上下文）可影响渲染。
5. 除了 初始化 外，不要在渲染期间写入或者读取 ref.current。（不能在函数组件执行中使用）

### |使用

1. 存储一个 定时器 interval ID
2. 可以在 事件处理程序或者 Effect 中读取和写入 ref。
3. 通过 ref 操作 DOM
4. 向父组件暴露 ref，通过 forwardRef 函数包裹子组件，并使用父组件传入的 ref。

#### |使用用 ref 引用一个值

- 第 1 个示例：点击计数器。这个组件使用 ref 记录按钮被点击的次数。注意，在这里使用 ref 而不是 state 是可以的，因为点击次数只在事件处理程序中被读取和写入。
- 第 2 个示例：秒表

**陷阱：不要在渲染期间写入或者读取 ref.current✅**

React 期望组件主体 **表现得像一个纯函数**：

- **如果输入的（props、state 与 上下文）都是一样的，那么就应该返回一样的 JSX**。
- 以不同的顺序或用不同的参数调用它，不应该影响其他调用的结果。

**在 渲染期间 读取或写入 ref 会破坏这些预期行为:✅**

```js
function MyComponent() {
  // ...
  // 🚩 不要在渲染期间写入 ref
  myRef.current = 123;
  // ...
  // 🚩 不要在渲染期间读取 ref
  return <h1>{myOtherRef.current}</h1>;
}
```

**可以在 事件处理程序或者 Effect 中读取和写入 ref**✅。

```js
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ 可以在 Effect 中读取和写入 ref
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ 可以在事件处理程序中读取和写入 ref
    doSomething(myOtherRef.current);
  }
  // ...
}
```

如果不得不在渲染期间读取 或者写入，那么应该 使用 state 代替。

当打破这些规则时，组件可能仍然可以工作，但是我们为 React 添加的大多数新功能将依赖于这些预期行为。阅读 保持组件纯粹 以了解更多信息。

#### |通过 ref 操作 DOM

**当 React 创建 DOM 节点并将其渲染到屏幕时，React 将会把 DOM 节点设置为 ref 对象的 current 属性**✅。

示例：

- 第 1 个示例 共 4 个挑战: 聚焦文字输入框。
- 第 2 个示例 共 4 个挑战: 滚动图片到视图
- 第 3 个示例 共 4 个挑战: 播放和暂停视频
- 第 4 个示例 共 4 个挑战: 向组件暴露 ref

#### |避免重复创建 ref 的内容

React 会保存 ref 初始值，并在后续的渲染中忽略它。

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
}
```

**虽然 new VideoPlayer() 的结果只会在首次渲染时使用，但是依然在每次渲染时都在调用这个方法**✅。如果是创建昂贵的对象，这可能是一种浪费。

为了解决这个问题，**你可以像这样初始化 ref：**

```js
// 优化
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
}
```

**通常情况下，在渲染过程中写入或读取 ref.current 是不允许的。然而，在这种情况下是可以的，因为结果总是一样的，而且条件只在初始化时执行，所以是完全可预测的**。（初始化时，是指后续组件再重新渲染时，playerRef.current 就有值了，条件就不通过了）（又说明，在渲染过程中写入或读取 ref.current，会引起不可预测，不是程序直接报错了 ✅）

#### 避免在初始化 useRef 之后进行 null 的类型检查

如果使用了类型检查器，并且不想总是检查 null，可以尝试用这样的模式来代替：

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

在这里，playerRef 本身是可以为空的。然而，应该能够使类型检查器确信，不存在 getPlayer() 返回 null 的情况。然后在事件处理程序中调用 getPlayer()。

### |疑难解答

...

#### |无法获取自定义组件的 ref

使用 forwardRef

### |类组件中 ref（过时）

1. 可通过 React.createRef 创建 ref。
2. 可直接，将 ref 属性绑定到类组件上，通过 ref.current 能访问到类组件的实例。（需要通过 forwardRef）

## useImperativeHandle

...
