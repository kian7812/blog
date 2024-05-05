# React面试题

## React有什么特点

React 是一个用于构建用户界面的 JavaScript 库。

1. 声明式UI（JSX），写UI就和写普通的HTML一样
2. 组件化，组件是react中最重要的内容，通过组件的抽象可以增加复用能力和提高可维护性 
2. 数据驱动视图，UI=f(data) 通过上面这个公式得出，如果要渲染界面，不应该直接操作DOM，而是通过修改数据(state或prop)，数据驱动视图更新
3. 虚拟DOM，DOM操作是一个昂贵的操作，很耗性能，因此产生了虚拟DOM。虚拟DOM是对真实DOM的映射，React通过新旧虚拟DOM对比，得到需要更新的部分
4. 跨平台，react既可以开发web应用也可以使用同样的语法开发原生应用（react-native），比如安卓和ios应用，甚至可以使用react开发VR应用，想象力空间十足，react更像是一个 元框架  为各种领域赋能 

## JSX介绍✅

JSX 是一个 JavaScript 的语法扩展，结构类似 XML。JSX 主要用于声明 React 元素，创建HTML结构。

JSX 会在构建过程中，通过 Babel 插件编译为 React.createElement 函数调用。所以 `JSX 更像是 React.createElement 的一种语法糖`。

优势：
  1. 采用类似于HTML的语法，降低学习成本，会HTML就会JSX
  2. 充分利用JS自身的可编程能力创建HTML结构

注意：JSX 并不是标准的 JS 语法，是 JS 的语法扩展，浏览器默认是不识别的，脚手架中内置的 @babel/plugin-transform-react-jsx 包，用来解析该语法。

**为什么在文件中没有使用react，也要在文件顶部import React from “react”**

只要使用了jsx，就需要引用react

### fiber架构下，jsx怎么转换为真实dom？✅

1. JSX 到 render function 的转换：React 使用 JSX 来描述页面。在构建过程中，Babel 编译器将 JSX 转换为 render 函数。
2. 生成虚拟 DOM（VDOM） ：当 render 函数执行时，它产生虚拟 DOM（VDOM）。虚拟 DOM 是对真实 DOM 的轻量级表示，用于描述页面的结构和内容。
3. 虚拟 DOM 转换为 Fiber 节点：在 Fiber 架构中，虚拟 DOM 不会直接用于渲染。相反，它首先被转换为 Fiber 节点。这些 Fiber 节点包含了额外的信息和结构，使得 React 能够更有效地管理更新过程。
4. 协调（Reconciliation）过程：将虚拟 DOM 转换为 Fiber 节点的过程称为协调（Reconciliation）。在协调过程中，React 会比较新旧虚拟 DOM，确定实际需要在真实 DOM 上执行的更新。
5. Commit 阶段：一旦所有必要的变更被确定，React 会在 Commit 阶段一次性将这些变更应用到真实的 DOM 上。这包括创建、更新或删除 DOM 节点。
6. 中断和恢复：与早期 React 版本相比，Fiber 架构的一个关键特性是其渲染过程可以被中断和恢复。这允许 React 根据需要暂停渲染工作，以确保高优先级的任务（如用户输入）能够及时处理。

### 为React组件为什么只能有一个根元素

React组件最后会编译为render函数，函数的返回值只能是1个。

### 为什么React自定义组件首字母要大写？✅

- JSX 解析规则：在 JSX 中，React 使用首字母大小写来区分自定义组件和原生 HTML 标签。首字母大写被解释为自定义组件，而首字母小写则被视为普通的 HTML 标签。
- Babel 转换过程：当使用 Babel 转换 JSX 代码时，它根据元素的首字母大小写来决定如何转换。首字母大写的组件会被保留其名称并传递给 React.createElement，而小写字母开头的则被视为普通 HTML 标签并转换为对应的字符串。
- 组件渲染识别： 这种首字母大小写的约定让 React 可以正确识别和渲染自定义组件和原生 DOM 元素，保证了 JSX 的灵活性和表现力。
- 代码清晰和一致性： 遵循这个约定有助于维持代码的清晰性和一致性，使得代码的阅读和维护变得更加容易。

### React.createElement 的基本语法✅

```js
// React.createElement(type, [props], [...children])
const element = React.createElement('div', { className: 'container' }, 'Hello, world!');
```
- type: 这个参数是一个字符串（对于 HTML 或 SVG 标签）或一个 React 组件（可以是类组件或函数组件）。这决定了将要创建的元素类型。
- props: 这是一个对象，包含了传递给 React 元素的属性（或“props”）。对于 HTML 标签，这些属性就是常见的 HTML 属性；对于 React 组件，这些属性将会成为组件的 props。
- children: 这些参数代表元素的子元素。它们可以是字符串、数字、React 元素，或者这些类型的数组。这里也可以传递 null 或 undefined，表示没有子元素。


## （类）组件生命周期

组件的生命周期是指组件从被创建到挂载到页面中运行起来，再到组件不用时卸载的过程。
注意，只有类组件才有生命周期（类组件需要实例化，函数组件不需要实例化）

https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

组件的生命周期可以分为挂载、更新、卸载阶段

**挂载阶段**

- constructor 组件初始化阶段，初始化的时候只执行一次；
  - 进行state和props的初始化；创建 Ref；使用 bind 解决 this 指向问题等
  - static getDerivedStateFromProps 静态方法，不能获取this
- render 创建虚拟DOM的阶段，每次组件渲染都会触发；
- componentDidMount 组件挂载（完成DOM渲染）后执行，初始化的时候执行一次；
  - 可以访问DOM，进行异步请求和定时器、消息订阅

**更新阶段**

当组件的props或state变化会触发更新：

- static getDerivedStateFromProps
- shouldComponentUpdate
- render 更新虚拟DOM
- getSnapShotBeforeUpdate 获取更新前的状态
- componentDidUpdate 组件更新后（DOM渲染完毕）
    DOM操作，可以获取到更新后的DOM内容

**卸载阶段**

- componentWillUnmount 组件卸载（从页面中消失）
  - 清除副作用（比如：清理定时器、事件监听等）

**错误捕获**

static getDerivedStateFromError 在errorBoundary中使用

componentDidCatch

**render**是class组件中唯一必须实现的方法

### 聊聊 class 与 hook 的生命周期
对于异步请求，应该放在 componentDidMount 中去操作。

constructor：可以放，但从设计上而言不推荐。constructor 主要用于初始化 state 与函数绑定，不承载业务逻辑且现在已经很少使用了。componentWillMount：已被标记废弃，在新的异步渲染架构下会触发多次渲染，容易引发 Bug。

getDerivedStateFromProps 容易编写反模式代码，使受控组件与非受控组件区分模糊。

UNSAFE_componentWillMount 被标记弃用，主要原因是新的异步渲染架构会导致它被多次调用。所以网络请求及事件绑定代码应移至 componentDidMount 中。

UNSAFE_componentWillReceiveProps 被标记弃用，被 getDerivedStateFromProps 所取代，主要原因是性能问题。

shouldComponentUpdate 通过返回 true 或者 false 来确定是否需要触发新的渲染。主要用于性能优化。

UNSAFE_componentWillUpdate 同样是由于新的异步渲染机制，而被标记废弃，原先的逻辑可结合 getSnapshotBeforeUpdate 与 componentDidUpdate 改造使用。

如果在 componentWillUnmount 函数中忘记解除事件绑定，取消定时器等清理操作，容易引发 bug。

如果没有添加错误边界处理，当渲染发生异常时，用户将会看到一个无法操作的白屏，所以一定要添加。

## 函数组件

使用 JS 的函数（或箭头函数）创建的组件，就叫做函数组件。

约定说明：

1. 组件的名称必须首字母大写，react内部会根据这个来判断是组件还是普通的HTML标签
2. 函数组件必须有返回值，表示该组件的 UI 结构；如果不需要渲染任何内容，则返回 null
3. 组件就像 HTML 标签一样可以被渲染到页面中。组件表示的是一段结构内容，对于函数组件来说，渲染的内容是函数的返回值就是对应的内容
4. 使用函数名称作为组件标签名称，可以成对出现也可以自闭合

## 类组件

使用 ES6 的 class 创建的组件，叫做类（class）组件。

约定说明：
1. 类名称也必须以大写字母开头
2. 类组件应该继承 React.Component 父类，从而使用父类中提供的方法或属性
3. 类组件必须提供 render 方法render 方法必须有返回值，表示该组件的 UI 结构

## React的状态不可变

概念：不要直接修改状态的值，而是基于当前状态创建新的状态值。
- 修改状态的时候，一定要使用新的状态替换旧的状态，不能直接修改旧的状态，尤其是引用类型

## Render Props

术语 “render prop” 是指一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术

具有 render prop 的组件接受一个返回 React 元素的函数，并在组件内部通过调用此函数来实现自己的渲染逻辑。

```js
// Render Props模式例子
<DataProvider render={data => <h1>Hello {data.target}</h1>} />
```

## 受控组件和非受控组件✅

受控组件：只能通过 React 修改数据或状态的组件，就是受控组件；

非受控组件：与受控组件相反，如 input, textarea, select, checkbox 等组件，本身控件自己就能控制数据和状态的变更，而且 React 是不知道这些变更的；


## 组件通信的方式有哪些？✅

1. 父子关系 - 子组件中通过 props 接收父组件中传过来的数据 
    1. props是只读对象（readonly）根据单项数据流的要求，子组件只能读取props中的数据，不能进行修改。
    2. props可以传递任意数据，数字、字符串、布尔值、数组、对象、函数、JSX。
    3. 父组件给子组件传递回调函数，子组件调用。
2. 兄弟关系 - 通过共同的父组件通信
    - 通过状态提升机制，利用共同的父组件实现兄弟通信
4. 跨组件通信Context
3. 其它关系 -  mobx / redux / zustand / 自定义事件模式 eventBus 
5. ref、useRef


## children属性

表示该组件的子节点，只要组件内部有子节点，props中就有该属性。

children可以是：

1. 普通文本
2. 普通标签元素
3. 函数 / 对象
4. JSX

## 哪些方法会触发 React 重新渲染以及如何避免不必要的重新渲染？✅

触发 React 重新渲染：

- setState() 、useState被调用
- props发生变化
- 组件依赖的上下文 context 发生变化
- 自定义hook发生变化
- forceUpdate强制组件重新渲染


如何避免不必要的重新渲染：

- React.memo：包裹函数式组件，react渲染之前会先做属性值的对比，如果没有变化，则不重新渲染。
- useMemo：缓存计算结果，只有在依赖项变化时才重现计算结果，而不是每次都渲染，避免因为计算开销大会导致渲染时间长。
- useCallback：缓存函数，只有在依赖项变化时才重现创建函数，而不是每次都创建。
- React.PureComponent/shouldComponentUpdate：控制是否重新渲染类组件。
- key：增加key，提升就进复用率。

## 对 React context 的理解

当你不想在组件树中通过逐层传递props或者state的方式来传递数据时，可以使用Context来实现跨层级的组件数据传递。 当React组件提供的Context对象其实就好比一个提供给子组件访问的作用域，而 Context对象的属性可以看成作用域上的活动对象。由于组件 的 Context 由其父节点链上所有组件通 过 getChildContext（）返回的Context对象组合而成，所以，组件通过Context是可以访问到其父组件链上所有节点组件提供的Context的属性。

## 常用组件

Portal

Portal提供了让子组件渲染在除了父组件之外的DOM节点的方式,它接收两个参数，第一个是需要渲染的React元素，第二个是渲染的地方(DOM元素)

用途：弹窗、提示框等

Fragment

- Fragment提供了一种将子列表分组又不产生额外DOM节点的方法
- 在React中，组件返回的元素只能有一个根元素，Fragment它允许组件返回多个元素而不需要额外的父DOM元素来包裹它们。
- 在渲染列表时，Fragment可以用来避免额外的包裹元素，同时仍然可以在列表项周围添加key属性，这对于React的列表渲染性能优化是重要的。

Suspense

Suspense使组件允许在某些操作结束后再进行渲染，比如接口请求,一般与React.lazy一起使用

Transition

Transition是React18引入的一个并发特性，允许操作被中断，避免回到可见内容的Suspense降级方案

## 什么是高阶组件？✅

概念：高阶组件（HOC）就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件，它只是一种组件的设计模式，这种设计模式是由react自身的组合性质必然产生的。我们将它们称为纯组件，因为它们可以接受任何动态提供的子组件，但它们不会修改或复制其输入组件中的任何行为。

适用场景：

- 代码复用，逻辑抽象：当多个组件有相似的逻辑时，可以使用高阶组件来共享这些逻辑。
- 渲染劫持： 高阶组件可以读取、修改、甚至替换被包裹组件的元素树，React中权限封装，无权限返回替换。
- State和Props的抽象、更改：连接 Redux 或 MobX，高阶组件可以用来包裹组件并连接到应用的状态管理库。

## React 中，Element、Component、Node、Instance 是四个重要的概念

Element：Element 是 React 应用中最基本的构建块，它是一个普通的 JavaScript 对象，用来描述 UI 的一部分。Element 可以是原生的 DOM 元素，也可以是自定义的组件。它的作用是用来向 React 描述开发者想在页面上 render 什么内容。Element 是不可变的，一旦创建就不能被修改。

Component：Component 是 React 中的一个概念，它是由 Element 构成的，可以是函数组件或者类组件。Component 可以接收输入的数据（props），并返回一个描述 UI 的 Element。Component 可以被复用，可以在应用中多次使用。分为 Class Component 以及 Function Component。

Node：Node 是指 React 应用中的一个虚拟节点，它是 Element 的实例。Node 包含了 Element 的所有信息，包括类型、属性、子节点等。Node 是 React 内部用来描述 UI 的一种数据结构，它可以被渲染成真实的 DOM 元素。
（从 render 方法返回的不可变 React 元素树通常称为“虚拟 DOM”。）

Instance：Instance 是指 React 应用中的一个组件实例，它是 Component 的实例。每个 Component 在应用中都会有一个对应的 Instance，它包含了 Component 的所有状态和方法。Instance 可以被用来操作组件的状态，以及处理用户的交互事件等。

## 错误边界是什么？在react中如何处理异常？✅

https://zhuanlan.zhihu.com/p/304213203
https://juejin.cn/post/7338617055149883419

在React中处理异常主要依赖于错误边界（Error Boundary）。错误边界是React组件，它可以捕获其子组件树中发生的JavaScript错误，并记录这些错误，并显示一个备用UI，而不是使整个组件树崩溃。 错误边界是一个使用了static getDerivedStateFromError() 或 componentDidCatch() 这两个生命周期方法的类组件。

```js
class ErrorBoundary extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // 更新状态，以便下一次渲染能够显示备用UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('组件奔溃 Error', error);
    console.log('组件奔溃 Info', errorInfo);
    // 你也可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以渲染任何自定义的备用UI
      return this.props.content;
    }
    return this.props.children;
  }
}
```
```js
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

错误边界主要用于捕获以下类型的错误：
- 渲染期间的错误。
- 生命周期方法中的错误。
- 构造函数中的错误（在渲染树中）

## 为什么 React 元素有一个 $$typeof 属性？

目的是为了防止 XSS 攻击。因为 Synbol 无法被序列化，所以 React 可以通过有没有 $$typeof 属性来断出当前的 element 对象是从数据库来的还是自己生成的。

如果没有 $$typeof 这个属性，react 会拒绝处理该元素。



## React 懒加载的实现原理？✅

**React.lazy**
React 16.6 之后，React 提供了 React.lazy 方法来支持组件的懒加载。配合 webpack 的 code-splitting 特性，可以实现按需加载。

```js
import React, { Suspense } from 'react';
const OtherComponent = React.lazy(() => import('./OtherComponent'));
function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

如上代码中，通过 import()、React.lazy 和 Suspense 共同一起实现了 React 的懒加载，也就是我们常说了运行时动态加载，即 OtherComponent 组件文件被拆分打包为一个新的包（bundle）文件，并且只会在 OtherComponent 组件渲染时，才会被下载到本地。

`React.lazy 需要配合 Suspense 组件一起使用，在 Suspense 组件中渲染 React.lazy 异步加载的组件。如果单独使用 React.lazy，React 会给出错误提示`。

**Webpack 动态加载**
import() 函数是由 TS39 提出的一种动态加载模块的规范实现，其返回是一个 promise。
webpack 检测到这种import() 函数语法会自动代码分割。使用这种动态导入语法代替以前的静态引入，可以让组件在渲染的时候，再去加载组件对应的资源，

webpack 通过创建 script 标签来实现动态加载的，找出依赖对应的 chunk 信息，然后生成 script 标签来动态加载 chunk，每个 chunk 都有对应的状态：未加载、加载中、已加载。

**Suspense 组件**
Suspense 内部主要通过捕获组件的状态去判断如何加载，React.lazy 创建的动态加载组件具有 Pending、Resolved、Rejected 三种状态，当这个组件的状态为 Pending 时显示的是 Suspense 中 fallback 的内容，只有状态变为 resolve 后才显示组件。

### 使用 React.lazy 和 Suspense：

1. React.lazy: 这是一个函数，允许你定义一个动态加载的组件。它接收一个函数，这个函数必须调用 import() ，返回一个 Promise，该 Promise 需要 resolve 一个 default export 的 React 组件。
2. Suspense: Suspense 组件用于包裹懒加载的组件。它允许你指定一个加载指示器（比如一个 spinner），这个指示器会在懒加载的组件被加载和渲染之前显示。
```js
import React, { Suspense } from 'react';
const LazyComponent = React.lazy(() => import('./LazyComponent'));
​
function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}
```

### React动态import怎么实现？

**动态 Import() 与 ESM**

ESM（ECMAScript Modules）：
- ESM是ECMAScript（JavaScript标准）的官方模块系统。
- import语句用于导入模块中的绑定（函数、对象、原始值等）。

动态 Import()：
- 动态import()是一种异步加载ESM模块的方式。
- 它返回一个Promise对象，该对象解析为一个模块命名空间对象，加载完成后获取 Module 并在 then 中注册回调函数,其中包含了导入模块的所有导出。
- 与静态import声明不同，动态import()可以在代码的任何地方调用，提供更灵活的加载方式。

**Webpack中的Code-Splitting**

检测动态 Import()：
- 当Webpack构建过程中检测到import()语句时，它会自动将相关模块作为一个新的代码块（chunk）进行处理。
- 这意味着该模块会被分离到独立的文件中，而非包含在主bundle文件中。

优化加载：
- 这种代码分割的技术允许应用仅在需要时加载某些代码块，而不是一开始就加载整个应用的所有代码。
- 这对于提高应用的初始加载速度和整体性能非常有帮助，尤其是对于大型应用。

实例：
```js
import("./moduleA").then(moduleA => {
  // 使用模块A的代码
  moduleA.doSomething();
});
```
在这个例子中，moduleA只有在import()调用时才会被加载。

**实践中的应用**

在React等前端框架中，结合React.lazy和Suspense使用动态import()，可以实现组件级别的懒加载，从而进一步优化应用的性能。

**注意事项**
- 确保使用的构建工具（如Webpack）和环境支持ESM和动态import()。
- 动态导入的模块可能不会立即可用，需要处理好异步加载的状态，如加载中、加载失败等。

## React 与 Vue 的区别主要在哪呢？✅

https://chodocs.cn/interview/react-summary/

**1、各自推崇的/核心思想**

- React 推崇函数式编程（纯组件），数据不可变以及单向数据流。函数式编程最大的好处是其无副作用（稳定性）和确定的输入输出（可测试性），所以通常说 React 适合大型应用。

- Vue 推崇灵活易用（渐进式开发体验），数据可变，双向数据绑定。尽可能的降低了前端开发的门槛。

**3、数据流**

- React 提倡的是单向数据流，数据不可变，需要 setState 驱动新的 State 替换老的 State。

- Vue 数据被观测是双向绑定的，省去了数据手动处理更加便捷。

**4、Render（渲染过程）**

- React 在应用的状态被改变时，全部子组件都会重新渲染。

- Vue 可以更快地计算出 Virtual DOM 的差异，这是由于它在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。

**6、diff 算法实现**

- `React 主要使用 diff 队列保存需要更新哪些 DOM，得到 patch 树，再统一操作批量更新 DOM`。

- `Vue Diff 使用双向链表，边对比，边更新 DOM`。

**7、社区和未来发展**

- React 只关注底层，上层应用解决方案交给社区，造就了 React 社区繁荣，同时 React 团队有更多时间专注底层。未来 React 的发展依然会在 函数式编程 这个核心思想的下进行升级。

- Vue 提供了一揽子全家桶解决方案，比如 Vuex、Vue-Router、Vue-CLI、Vutur 工具等。减少选择困难症，只需认准官方给出的解决方案即可。Vue 依然会定位简单易上手（渐进式开发），依然是考虑通过依赖收集来实现数据可变。


### react 和 vue 对比，优劣势是什么？你会如何选择

https://juejin.cn/post/7329780589061095434

React 和 Vue 都是目前非常受欢迎的前端 JavaScript 框架，各有其优势和劣势，选择哪一个通常取决于项目需求、团队熟悉度以及个人偏好。以下是 React 和 Vue 的一些对比点：

React:

优势:

- 更大的生态系统和社区：React 有更多的用户和贡献者，以及更多的第三方库和工具。
- 更灵活的架构：React 提供了灵活的方式来构建应用，不过这也意味着需要开发者做出更多架构决策。
- Facebook 背景：由 Facebook 开发和维护，确保了其长期的稳定性和更新。
- 广泛的就业机会：由于其受欢迎程度高，掌握 React 技能的开发者通常有更多的就业选择。

劣势:

- 学习曲线：由于需要了解更多的概念（如 JSX、Hooks 等），React 的学习曲线可能比 Vue 稍陡峭。
- 更多的样板代码：尤其在使用类组件的时候，React 可能需要更多的样板代码。

Vue:

优势:

- 简洁的 API 和设计：Vue 的设计更简单直观，易于上手，特别是对于初学者。
- 更少的样板代码：Vue 通过其模板系统和简易的双向数据绑定减少了样板代码。
- 良好的文档：Vue 的官方文档在社区中被广泛认为是非常清晰和全面的，这有助于新手学习。
- 渐进式框架：Vue 被设计成可以逐步采用，你可以只用它的一部分功能，然后逐渐深入。

劣势:

- 社区和生态系统较小：尽管 Vue 的社区正在快速增长，但相比 React，它还是较小。
- 国内以外的市场认可度：虽然 Vue 在国内非常流行，但在北美等市场，React 和 Angular 的受欢迎程度更高。

在选择 React 还是 Vue 时，我会考虑以下因素：

1. 项目需求：如果项目需要大量的灵活性和复杂度，或者与现有的 React 生态系统集成，我可能会选择 React。如果项目需要快速原型开发和较低的初始学习门槛，Vue 可能是更好的选择。
2. 团队经验：选择团队成员更熟悉的框架通常会提高开发效率和减少成本。
3. 社区和生态：根据项目中可能会用到的库和工具，社区和生态系统的大小和激活度可能会影响我的选择。
4. 长期维护和更新：考虑到长期的项目维护和更新，选择一个有良好支持和更新记录的框架是重要的。
5. 性能需求：虽然两者在性能上都很优秀，根据具体的性能需求和优化可能性，我可能会对这两个框架进行更深入的比较。

总的来说，没有绝对的“最好”，只有最适合当前情境的选择。

### Vue和React的区别

https://juejin.cn/post/7338617055149883419
https://juejin.cn/post/7109104086049357861

**相同点：**

- 都使用Virtural DOM。
- 都使用组件化思想，流程基本一致。
- 都是响应式，数据驱动视图。
- 都有成熟的社区，都支持服务端渲染。

**不同点：**

核心思想不同：

- Vue推崇灵活易用（渐进式开发体验），数据可变，双向数据绑定（依赖收集）。
- React推崇函数式编程（纯组件），数据不可变以及单向数据流。

响应式原理不同：
- vue:
    - Vue依赖收集，自动优化，数据可变。
    - Vue递归监听data的所有属性,直接修改。
    - 当数据改变时，自动找到引用组件重新渲染。

- react:
  - React基于状态机，手动优化，数据不可变，需要setState驱动新的State替换老的State。
  - 当数据改变时，以组件为根目录，默认全部重新渲染。

diff算法不同：
- 相似点:
    - 都是基于两个假设（使得算法复杂度降为O(n)）：
    - 不同的组件产生不同的 DOM 结构。当type不相同时，对应DOM操作就是直接销毁老的DOM，创建新的DOM。
    - 同一层次的一组子节点，可以通过唯一的 key 区分。

- 源码实现不同:
  - Vue基于snabbdom库，它有较好的速度以及模块机制。Vue Diff使用双向链表，边patch，边更新DOM。（v2使用双向链表，v3使用最长递增子序列）
  - React主要使用diff队列保存需要更新哪些DOM，得到patch树，再统一操作批量更新DOM。(仅向右移动)

### 为什么React不能像Vue一样，渲染时候精确到当前组件的粒度？✅

- 在react中，组件的状态是不能被修改的，setState没有修改原来那块内存中的变量，而是去新开辟一块内存； 而vue则是直接修改保存状态的那块原始内存。(不可变数据VS可变数据)
- react中，调用setState方法后，会自顶向下重新渲染组件，自顶向下的含义是，该组件以及它的子组件全部需要渲染；而vue使用Object.defineProperty（vue@3迁移到了Proxy）对数据的设置（setter）和获取（getter）做了劫持，也就是说，vue能准确知道视图模版中哪一块用到了这个数据，并且在这个数据修改时，告诉这个视图，你需要重新渲染了。
- 所以当一个数据改变，react的组件渲染是很消耗性能的——父组件的状态更新了，所有的子组件得跟着一起渲染，它不能像vue一样，精确到当前组件的粒度。




