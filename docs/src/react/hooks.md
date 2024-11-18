# Hooks

不全：加上18新增的

## Hooks介绍✅

从react v16.8开始，Hooks应运而生，让函数组件可以拥有自己的状态，更加匹配React的设计理念 UI = f(data)，也更有利于逻辑拆分与重用的组件表达形式。

**函数组件与类组件的区别:**

- 类组件需要声明constructor，函数组件不需要
- 类组件需要手动绑定this，函数组件不需要
- 类组件有生命周期钩子，函数组件没有
- 类组件可以定义并维护自己的state，
- 类组件需要继承class，函数组件不需要
- 类组件使用的是面向对象的方法，封装：组件属性和方法都封装在组件内部 继承:通过extends React.Component继承;函数组件使用的是函数式编程思想


Hooks的出现解决了俩个问题：

1. 组件的逻辑复用：在hooks出现之前，react先后尝试了 mixins混入，HOC高阶组件，render-props等模式；但是都有各自的问题，比如mixin的数据来源不清晰，高阶组件的嵌套问题等等 
2. class组件自身的问题：class组件就像一个厚重的‘战舰’ 一样，大而全，提供了很多东西，有不可忽视的学习成本，比如各种生命周期，this指向问题等等，而我们更多时候需要的是一个轻快灵活的'快艇' 


###  class 与 hooks 的区别/优劣

共同点是两者的功能和效果都是一样的，类组件和函数组件都可以作为基础组件展示 UI。

他们的设计理念不一样，一个是面向对象，一个是函数式。面向对象的核心是继承、生命周期等这些。而函数式 immutable（不变）、没有副作用、引用透明等这些特点。

Hooks 更优的原因：Hooks 有确定的输入输出，没有 this 指向问题，也不用 renderprops 或者 Hoc 去解决复用状态逻辑的问题，它是一个组合的思想，组合更优于继承。class 组件业务逻辑散落在生命周期中，Hooks 则淡化了生命周期的概念。Hooks 的函数组件可以提供比原先更细粒度的逻辑组织与复用，且能更好地适用于时间切片与并发模式。

### react hooks 诞生的原因是什么？为了解决什么问题

https://juejin.cn/post/7329780589061095434

React Hooks 是在 React 16.8 版本中引入的一个重要特性，它们的诞生主要是为了解决以下几个问题：

1. 复杂组件逻辑难以重用：在 Hooks 之前，如果你想在多个组件之间重用一些状态逻辑，你可能需要用到高阶组件（HOCs）或者渲染属性（render props）等模式。这些模式可以工作，但它们往往使得组件层次深且难以理解，也增加了代码的复杂度。
2. 难以理解的类组件：类组件让许多开发者感到困惑，特别是对于初学者来说，需要理解 JavaScript 中的this关键字的工作方式，以及如何正确地绑定事件处理器方法。此外，类组件的生命周期方法经常让人头疼，尤其是当需要在不同生命周期方法中进行相同逻辑处理时。
3. 副作用代码分散：在类组件中，相关的业务逻辑代码往往被分散在多个生命周期方法中（比如componentDidMount和componentDidUpdate中都需要进行数据的加载操作），这使得逻辑难以跟踪和维护。
4. 复杂的组件状态逻辑：类组件中状态逻辑经常和 UI 逻辑紧密耦合在一起，这使得状态逻辑难以测试和重用。

React Hooks 的引入旨在解决这些问题，提供了一种更简单、更直观的方式来使用 React 的特性，而不需要编写类。Hooks 允许你在不编写类的情况下使用状态和其他的 React 特性。主要的 Hooks 有：

- useState: 允许函数组件使用状态。
- useEffect: 允许函数组件执行副作用操作（如数据获取、订阅更新等）。
- useContext: 允许函数组件访问 React 的上下文系统。
- useReducer: 提供更复杂的状态逻辑管理，与 Redux 类似。
- useCallback 和 useMemo: 用于优化应用性能，避免不必要的渲染。

Hooks 的设计使得状态和相关逻辑可以更容易地打包在一起，从而更易于重用和测试，并且可以在不改变组件层次结构的情况下共享。这些特性使得开发者可以写出更简洁、更易于维护的代码。

### Class 组件和 Function 组件的优劣对比

https://juejin.cn/post/7329780589061095434

React 中的类组件和函数组件各有优缺点，随着 React 的发展，这些差异也在不断演变。以下是它们的一些对比：

**类组件:**

优势:

状态管理: 在引入 Hook 之前，类组件是唯一可以持有状态(state)的组件。
生命周期方法: 提供丰富的生命周期方法（如componentDidMount, componentDidUpdate等），允许执行复杂的操作。
可以使用this关键字: 访问或修改组件状态和属性。

劣势:

1. 更复杂的语法: 类组件需要理解 JavaScript 中的this以及如何正确绑定事件处理函数。
2. 更大的尺寸: 类组件通常比函数组件大小要大，可能导致更大的包体积。
3. 性能开销: 类组件可能有轻微的性能开销，因为它们需要实例化。

**函数组件:**

优势:

1. 简洁性: 语法更简洁，没有this的复杂性，容易编写和理解。
2. 轻量级: 通常体积比类组件小，意味着更快的加载和解析。
3. 函数式编程: 更容易使用函数式编程范式，代码可能更清晰和易于测试。
4. Hooks: 随着 React Hooks 的引入，函数组件几乎可以做到类组件的所有事情，并且能够更好地利用 React 的特性，如状态管理和副作用。

劣势:

1. 生命周期管理: 在 Hooks 出现之前，函数组件没有直接对应于类组件生命周期方法的概念。
2. 学习成本: 对于习惯于使用类的开发者来说，切换到函数组件加上 Hooks 的模式可能需要一段时间来适应。

在性能方面，函数组件通常被视为略优于类组件，尤其是在 React Hooks 引入后。以下是一些性能方面的考虑：

1. 组件尺寸与加载时间：
函数组件通常更加轻量，因为它们不需要额外的方法和生命周期的处理，这可以减少文件的大小，使得加载时间更短。
2. 实例化开销：
类组件需要通过new关键字来实例化，这个过程略微增加了运行时开销。函数组件避免了这种实例化开销，因为它们只是函数的调用。
3. 内存占用：
函数组件通常会占用较少的内存，因为它们不需要额外的内存来存储类的实例。
4. 渲染性能：
在实际的渲染性能方面，两者之间的差异通常可以忽略不计。React 团队努力确保性能差异最小化，因此从性能角度来说，选择哪一种类型的组件主要应该基于其他因素，如开发体验和代码的可维护性。
5. 优化机制：
React 提供了一些优化机制，如React.memo和shouldComponentUpdate生命周期方法，它们都可以帮助避免不必要的渲染。对于函数组件，React.memo可以帮助你防止在 props 没有改变的情况下重新渲染。类似地，类组件可以通过实现shouldComponentUpdate方法来避免不必要的渲染。
6. Hooks 的使用：
虽然 Hooks 使函数组件变得更加强大，但是如果使用不当，也可能对性能产生负面影响。例如，如果不正确使用useEffect的依赖数组，可能导致额外的渲染或副作用执行。

总的来说，在现代 React 应用程序中，函数组件与类组件在性能上的差异非常微小，很难成为选择组件类型的决定性因素。对于大多数应用来说，其他因素，如开发体验、代码的清晰性和可维护性，以及与团队现有代码库的一致性，可能是更重要的考虑因素。选择函数组件还是类组件，最好根据团队习惯、项目需求和个人偏好来决定。

随着 React Hooks 的引入，函数组件的能力得到了极大的增强，使得之前类组件独有的功能（如状态管理和生命周期访问）现在也能在函数组件中实现。这导致了许多开发者和团队逐渐转向使用函数组件作为首选，尤其是对于新项目和新组件。

选择类组件还是函数组件通常取决于个人偏好、项目需求和团队规范。随着时间的推移和 React 的发展，函数组件加 Hooks 的模式正在成为社区中的主流写法。

## hooks 带来了哪些新的问题？编写时如何注意✅

https://juejin.cn/post/7329780589061095434

虽然 React Hooks 提供了许多优势，它们的使用也引入了一些新的问题和挑战。这里是一些常见的问题，以及如何在编写时注意这些问题：


1. 遵守 Hooks 规则：
    - Hooks 必须在函数组件的最顶层调用，不得在循环、条件判断或嵌套函数中调用，以确保 Hooks 在每次组件渲染时都按相同的顺序被调用。
    - 只能在 React 的函数组件或自定义 Hooks 中调用 Hooks。

为了避免违反这些规则，可以使用 ESLint 插件eslint-plugin-react-hooks来检查代码。

2. 过度使用 useEffect：
  - useEffect可以带来副作用管理上的便利，但过度使用它可能导致组件逻辑变得混乱。应当根据副作用的性质（比如 DOM 修改、数据订阅等）合理安排useEffect的使用。

3. 复杂的依赖关系：
  - useEffect和一些其他的 Hooks 允许你声明依赖项，以决定何时重新运行。不正确地声明依赖项可能导致无限循环或者过期的闭包。
  - 确保列出所有使用到的外部变量作为依赖项，以此来避免这些问题。

4. 性能问题：
- useState和useEffect在默认情况下在每次渲染后都会执行，这可能导致性能问题，特别是在渲染大型列表或复杂交互时。
- 使用useMemo和useCallback来优化渲染性能，避免不必要的计算和渲染。

5. 自定义 Hooks 的管理：
  - 自定义 Hooks 是一种强大的抽象方式，它可以让你提取组件逻辑。但如果没有合理的组织策略，可能导致复用代码变得困难。
  - 合理组织和命名自定义 Hooks，保持它们的纯净和独立性，以便于管理和复用。

6. 测试挑战：
  - 使用 Hooks 的组件可能需要不同的测试策略，因为与类组件相比，它们可能没有实例方法也没有易于访问的内部状态。
  - 使用适合 Hooks 的测试库（如 React Testing Library），它鼓励更多的行为驱动测试，而不是依赖组件内部实现细节。

通过理解 Hooks 的工作原理并遵循最佳实践，可以最大限度地减少这些问题。始终关注 React 的官方文档和社区，以获取关于 Hooks 使用的最新指南和技巧。



## hooks 为什么不能放在条件判断里？✅

以 useState 为例，在 react 内部，每个组件(Fiber)的 hooks 都是以链表的形式存在 memoizeState 属性中：

update 阶段，每次调用 useState，链表就会执行 next 向后移动一步。如果将 useState 写在条件判断中，假设条件判断不成立，没有执行里面的 useState 方法，会导致接下来所有的 useState 的取值出现偏移，从而导致异常发生。

为什么不能将hooks写到if else语句中了把？

react 用链表来严格保证hooks的顺序。

因为这样可能会导致顺序错乱，导致当前 hooks 拿到的不是自己对应的 Hook 对象。

## React Hook 的使用限制有哪些？为什么要加这些限制？✅

限制:

- 只能在函数组件的最顶层调用 Hooks： 不能在循环、条件语句或嵌套函数内调用 Hooks。这是为了确保 Hooks 在每次组件渲染时都以相同的顺序被调用，这对于 React 正确地追踪 Hook 状态非常重要。
- 只能在 React 函数组件或自定义 Hooks 中调用 Hooks： 不应在普通的 JavaScript 函数中调用 Hooks。这是为了确保你只在 React 的上下文中使用 Hooks，从而使得状态管理和副作用的处理符合 React 的模式。

为什么要加这些限制？ 

React中每个组件都有一个对应的 FiberNode对象，这个对象上有个属性叫 memoizedState，在函数组件中，fiber.memoizedState存储的就是Hooks单链表，单链表中每个hook节点没有名字和key，只能通过顺序来记录他们的唯一性。 如果在循环、条件或者嵌套中使用hook，当组件更新时，这个hooks顺序会乱套，单链表的稳定性就破坏了。 

总结：

- 无命名和 Key: Hooks 在单链表中是没有名字和 key 的，它们完全依赖于声明的顺序来维持唯一性和状态的连续性。
- 顺序依赖: React 依赖于 Hooks 被调用的顺序来正确地映射和更新状态。这个顺序在组件的多次渲染之间应该是一致的。


## 说一下 hooks 的闭包问题✅

https://mp.weixin.qq.com/s/zCx7jnjdDc7OVs7lPt4eOA

在使用 React Hooks 时，闭包问题是需要注意的一种情况，特别是在使用 useEffect 和自定义 Hook 中。

当在 useEffect 中引用了某些值时，它们会形成闭包。闭包是指一个函数引用了函数外部的变量，即使外部函数执行完毕，这些变量仍然存在于内存中，并且可以被内部函数访问。在 React 组件中，由于 useEffect 的回调函数是在组件渲染时创建的，因此它可以访问到组件作用域中的任何变量。这可能会导致一些意想不到的结果，特别是在依赖数组中使用了外部的状态值。

```js
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(count); // 闭包中引用了外部的 count 变量
      setCount(count + 1); // 此处的 count 并不会是最新的值
    }, 1000);

    return () => clearInterval(intervalId);
  }, []); // 注意这里的依赖数组为空

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  );
}

export default Counter;
```
在这个例子中，我们希望每秒钟增加一次计数器。然而，由于 useEffect 中的回调函数形成了闭包，它引用了组件作用域中的 count 变量。而这个 count 变量是在组件函数每次渲染时创建的闭包，而不是在 useEffect 中创建的。因此，即使 count 更新了，useEffect 中的回调函数仍然使用的是更新前的旧值，导致计数器不会按预期工作。

要解决这个问题，可以通过在 useEffect 的依赖数组中添加 count 来更新 useEffect 的执行时机，确保每次 count 发生变化时都会重新执行 useEffect 中的回调函数，从而获取到最新的 count 值。
上面的代码中，setInterval的回调函数引用的count值是useEffect运行时的count的值，而当你点击按钮更新count时，定时器中的闭包并不会获取到更新后的count值。

```js
useEffect(() => {
  const intervalId = setInterval(() => {
    console.log(count);
    setCount(prevCount => prevCount + 1); // 使用函数式更新确保获取到最新的 count 值
  }, 1000);

  return () => clearInterval(intervalId);
}, [count]); // 依赖数组中添加了 count
```

通过这种方式，可以避免由于闭包引起的问题，确保在 useEffect 中始终使用到最新的状态值。

也可以使用引用（useRef）。


## 常用的 React Hooks

状态钩子 (useState): 用于定义组件的 State，类似类定义中 this.state 的功能
useReducer：用于管理复杂状态逻辑的替代方案，类似于 Redux 的 reducer。
生命周期钩子 (useEffect): 类定义中有许多生命周期函数，而在 React Hooks 中也提供了一个相应的函数 (useEffect)，这里可以看做componentDidMount、componentDidUpdate和componentWillUnmount的结合。
useLayoutEffect：与 useEffect 类似，但在浏览器完成绘制之前同步执行。
useContext: 获取 context 对象，用于在组件树中获取和使用共享的上下文。
useCallback: 缓存回调函数，避免传入的回调每次都是新的函数实例而导致依赖组件重新渲染，具有性能优化的效果；
useMemo: 用于缓存传入的 props，避免依赖的组件每次都重新渲染；
useRef: 获取组件的真实节点；用于在函数组件之间保存可变的值，并且不会引发重新渲染。
useImperativeHandle：用于自定义暴露给父组件的实例值或方法。
useDebugValue：用于在开发者工具中显示自定义的钩子相关标签。

## useRef✅

定义：我们可以把 useRef 看作是在函数组件之外创建的一个容器空间。在这个容器上，我们可以通过唯一的 current 属设置一个值，从而在函数组件的多次渲染之间共享这个值。

- 创建一个 ref 引用，包含一个 ref.current 属性。
- 

- *useRef 返回的 ref 对象在组件的生命周期内保持不变
- 使用 useRef 保存的数据一般是和 UI 的渲染无关的，当 ref 的值发生变化时，是不会触发组件的重新渲染的，这也是 useRef 区别于 useState 的地方。
- 除了存储跨渲染的数据之外，useRef 还有一个重要的功能，就是保存某个 DOM 节点的引用。

- ref.current 发生变化并不会造成 re-render，不会触发组件的重新渲染的; 
- useRef的应用场景主要是：函数组件需有访问 dom 元素的场景。 

**创建 ref**

https://juejin.cn/post/7243435843146498107

有两种方式创建 ref，分别为 React.createRef 和 useRef。useRef 是一种 React Hook，只能在函数组件中使用。React.createRef 的使用位置不限，但不要在函数组件中使用它，如果在函数组件中用它创建 ref，那么函数组件每一次重新渲染都会创建新的 ref。


## useContext：定义全局状态

Context 提供了一个方便在多个组件之间共享数据的机制。 缺点：

- 会让调试变得困难，因为你很难跟踪某个 Context 的变化究竟是如何产生的。
- 让组件的复用变得困难，因为一个组件如果使用了某个 Context，它就必须确保被用到的地方一定有这个 Context 的 Provider 在其父组件的路径上。


##  function 组件每次渲染都会生新执行，useRef 如何保存值不被清除

useRef Hook 可以创建一个可变的引用对象，该对象在组件的整个生命周期内保持不变。useRef返回的对象包含一个名为current的属性，可以存储任何值，而且这个值在组件的每次渲染之间都会保持不变。React 会将这个引用对象附加到组件的 Fiber 节点上，因此在整个组件生命周期内，无论组件渲染多少次，useRef返回的对象都是同一个。

与useState不同，useRef不会触发组件的重新渲染，而是提供了一个在渲染之间能够持久化的容器。这对于存储任何可变值都是有用的，例如保存对 DOM 节点的引用或存储上一次渲染时的数据。

```js
const myRef = useRef(initialValue); // myRef.current将在渲染间保持不变
```

## React.memo() 和 useMemo()

React.memo() 随 React v16.6 一起发布。

虽然类组件已经允许您使用 PureComponent 或 shouldComponentUpdate 来控制重新渲染，但 React 16.6 引入了对函数组件执行相同操作的能力。

React.memo() 是一个高阶组件 (HOC)，它接收一个组件 A 作为参数并返回一个组件 B，如果组件 B 的 props（或其中的值）没有改变，则组件 B 会阻止组件 A 重新渲染 。

useMemo() 是一个 React Hook。

React.memo() 和 useMemo() 之间的主要区别：
- React.memo() 是一个高阶组件，可以使用它来包装不想重新渲染的组件，除非其中的 props 发生变化
- useMemo() 是一个 React Hook，可以使用它在组件中包装函数。 可以使用它来确保该函数中的值仅在其依赖项之一发生变化时才重新计算。

虽然 memoization 似乎是一个可以随处使用的巧妙小技巧，但只有在绝对需要这些性能提升时才应该使用它。 Memoization 会占用运行它的机器上的内存空间，因此可能会导致意想不到的效果。

## useMemo

- useMemo 用于对复杂的计算结果进行记忆化。当你有一段计算逻辑，但只希望在特定的依赖项改变时才重新计算时，可以使用 useMemo。
- 它接受一个“创建”函数和一个依赖项数组。只有当依赖项发生变化时，这个“创建”函数才会被执行。
- useMemo 返回的是“创建”函数的返回值。
```js
const computedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

## useCallback

- useCallback 用于对函数本身进行记忆化。当你将函数作为 props 传递给子组件，或者在依赖于函数的 useEffect 中使用函数时，使用 useCallback 可以防止组件不必要的重新渲染。
- 它接受一个内联函数和一个依赖项数组。只有当依赖项发生变化时，这个函数才会被重新创建。
- useCallback 返回的是记忆化的函数本身。
- 缓存回调函数，避免传入的回调每次都是新的函数实例而导致依赖组件重新渲染，具有性能优化的效果；

```js
const memoizedCallback = useCallback(() => {
 return doSomething(a, b);
}, [a, b]);

```

## 为什么 useState 返回的是数组而不是对象？✅

- 如果useState返回的是数组，你可以按照自己的想法对变量进行命名，代码看起来也会更加干净。
- 而如果是对象，你的命名必须要和useState 内部实现返回的对象同名，比较麻烦，而且如果你要多次使用 useState ，就必须得重命名返回值。 
- `避免解构时的命名冲突`、灵活的命名避免记忆负担、遵循 Hooks 设计的简洁性


## 对 useReducer 的理解
useReducer 是 React Hooks 中的一个函数，用于管理和更新组件的状态。它可以被视为 useState 的一种替代方案，适用于处理更复杂的状态逻辑。
相比于 useState，useReducer 在处理复杂状态逻辑时更有优势，因为它允许我们将状态更新的逻辑封装在 reducer 函数中，并根据不同的动作类型执行相应的逻辑。这样可以使代码更具可读性和可维护性，并且更容易进行状态追踪和调试。

## useState和useReducer有啥区别？✅

- useState和useReducer都是用于函数组件内部定义状态的，区别在于，useState用于简单的状态管理和局部状态更新，而useReducer用于复杂的状态逻辑和全局状态管理。
- useState实际是一个自带了reducer功能的useReducer语法糖。
- 当你使用useState时，如果state没有发生变化，那么组件就不会更新。而`使用了useReducer时，在state没有发生变化时，组件依然会更新`。大家在使用时候，千万要注意这点的区别。

```js
import React, { useReducer } from 'react';
​
// 定义 reducer 函数
const countReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
};
​
function Counter() {
  // 使用 useReducer 初始化状态和派发动作函数
  const [state, dispatch] = useReducer(countReducer, { count: 0 });
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>增加</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>减少</button>
    </div>
  );
}
​
export default Counter;
```



## 说下 useInsertionEffect、useEffect、useLayoutEffect 区别✅

- https://juejin.cn/post/7329780589061095434
- https://juejin.cn/post/7338617055149883419


在 React 中，useEffect、useLayoutEffect和useInsertionEffect都是用于在组件渲染过程中处理副作用的 Hooks，但它们在何时执行以及用途方面有所不同。

**useEffect**

- useEffect是最常用的副作用 Hook。它在组件渲染到屏幕之后的某个时间点异步执行，不会阻塞浏览器的绘制工作。这个 Hook 适用于大多数副作用场景，如数据抓取、设置订阅以及手动更改 DOM 等。
- useEffect中的延迟执行，指的是effect会在组件渲染任务调度函数结束后，再单独调用一次任务调度函数，好处是，effect的调用可以单独进行，不会加长组件渲染的任务时间，也就不会阻碍组件的渲染了。

```js
useEffect(() => {
  // 这里的副作用将在组件渲染后异步执行
  console.log("Effect has run");

  return () => {
    // 清理副作用的逻辑，例如取消订阅
  };
}, [dependencies]); // 依赖数组，只有依赖变化了才会重新执行
```

**useLayoutEffect**

- useLayoutEffect与useEffect类似，但它是在所有的 DOM 变更之后同步调用的。这意味着你可以使用它来读取或更改 DOM，而不会有闪烁的问题。由于useLayoutEffect会同步执行，可能会影响页面性能，所以建议仅在需要与 DOM 相关的更新时使用。
- useLayoutEffect的同步，但它在 DOM 更新完成后立即同步执行，也就是在浏览器进行任何绘制之前。这意味着你可以在浏览器绘制前读取布局并同步重新渲染。由于 useLayoutEffect 会阻塞浏览器的绘制，不当使用可能会导致性能问题。

```js
useLayoutEffect(() => {
  // 这里的副作用将在所有的 DOM 变更之后同步执行
  console.log("Layout effect has run");

  return () => {
    // 清理副作用的逻辑
  };
}, [dependencies]); // 依赖数组
```

总结来说，两者的主要区别在于执行时机：useEffect 在所有的 DOM 更改之后异步执行，不会阻塞页面渲染，而 useLayoutEffect 则在 DOM 更新之后立即同步执行，适用于对 DOM 布局和样式有影响的操作。在大多数情况下，useEffect 已足够使用，但在需要同步更改 DOM 或者避免闪烁时，应该使用 useLayoutEffect。

**useInsertionEffect (New in React 18)**

useInsertionEffect 是 React 18 中引入的新钩子函数。它会在组件插入到 DOM 树之前执行。

场景:
1. 解决在使用 CSS-in-JS 库时的样式闪烁问题。
2. 在组件插入到 DOM 树之前执行一些操作，例如设置滚动位置或获取 DOM 元素的尺寸。
```js
function MyComponent() {
  const ref = useRef();

  useInsertionEffect(() => {
    // 在组件插入到 DOM 树之前，将滚动位置设置为顶部
    window.scrollTo(0, 0);

    // 获取 DOM 元素的尺寸
    const { width, height } = ref.current.getBoundingClientRect();

    // 使用尺寸进行一些操作
  }, []);

  return (
    <div ref={ref}>
      <h1>Hello, world!</h1>
    </div>
  );
}
```

**总结**

- useEffect用于处理大多数副作用，它在组件渲染到屏幕后异步执行。
- useLayoutEffect用于处理需要同步执行的副作用，以避免可能的布局闪烁。
- useInsertionEffect是 React 18 新增的 Hook，用于处理样式注入，在样式计算之前同步执行。

在编写组件时，大多数副作用应该使用useEffect。只有当你需要同步读取或更改 DOM，或者当你需要在绘制前注入样式时，才考虑使用useLayoutEffect或useInsertionEffect。

### useEffect 执行副作用✅

**什么是副作用**
副作用是相对于主作用来说的，一个函数除了主作用，其他的作用就是副作用。对于 React 组件来说，主作用就是根据数据（state/props）渲染 UI，除此之外都是副作用（比如，手动修改 DOM）

useEffect函数的作用就是为react函数组件提供副作用处理的。

使用方法：

- 副作用函数：在组件渲染到屏幕之后执行。
- 依赖项数组：指定了 useEffect 执行的依赖。如果依赖项没有改变，副作用函数在重新渲染时不会再次执行。

```js
useEffect(() => {
  fetch('some-api').then(response => {
    // 处理响应
  });
}, []); // 空数组表示只在组件挂载时执行一次
```
- 如果不传递第二个参数（依赖项数组），副作用函数将在每次渲染后都执行。
- 如果依赖项数组为空（[]），这意味着副作用函数仅在组件第一次渲染（挂载）后执行一次，并且在组件卸载时执行清理（如果提供了清理函数）
- 如果依赖项数组中包含变量或属性，副作用函数将在这些依赖项改变时执行。

依赖项：
1. 不添加依赖项
    - 组件首次渲染执行，以及不管是哪个状态更改引起组件更新时都会重新执行。
2. 添加空数组
    - 组件只在首次渲染时执行一次
3. 添加特定依赖项
    - 副作用函数在首次渲染时执行，在依赖项发生变化时重新执行
4. 清理副作用
    - 如果想要清理副作用 可以在副作用函数中的末尾return一个新的函数，在新的函数中编写清理副作用的逻辑
    - 注意执行时机为：
      1. 组件卸载时自动执行
      2. 组件更新时，下一个useEffect副作用函数执行之前自动执行

### useEffect 是怎么判断依赖项变化的？✅

- useEffect的依赖项是使用了 === 全等符号来进行判断的，
- 如果依赖项是数组或者对象，即使值没有变化，引用地址也会变化，所以每次判断的结果都不一样，就会每次都会调用回调函数了。 
- 由于这种浅比较的机制，当使用对象或数组作为依赖项时，需要特别注意。如果这些对象或数组在每次组件渲染时都被重新创建，即使它们包含的数据实际上没有变化，useEffect 也会重复执行。
- 为了避免这种情况，可以使用 useMemo 或 useCallback 来缓存这些对象或函数，以确保它们的引用在渲染之间保持不变。

### ## 让 useEffect 支持 async/await ?
```js
useEffect(() => {
  const asyncFun = async () => {
    setPass(await mockCheck());
  };
  asyncFun();
}, []);

// 也可以使用 IIFE，如下所示：
useEffect(() => {
  (async () => {
    setPass(await mockCheck());
  })();
}, []);
```




