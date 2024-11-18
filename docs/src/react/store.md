# 状态管理

## Zustand

一个简单的，快速的状态管理解决方案，api设计基于函数式和hooks。

## Redux

https://www.yuque.com/fechaichai/qeamqf/omg1xi

Redux工作原理：
- 使用单例模式实现
- Store 一个全局状态管理对象
- Reducer 一个纯函数，根据旧state和props更新新state
- Action 改变状态的唯一方式是dispatch action

## 状态/路由

https://chodocs.cn/interview/react-summary/

## vuex 与 redux 的区别
参考答案
从使用上来说

在 Vuex 中，$store被直接注入到了组件实例中，因此可以比较灵活的使用：使用dispatch、commit提交更新，通过mapState或者直接通过this.$store 来读取数据。

在 Redux 中，我们每一个组件都需要显式的用 connect 把需要的 props 和 dispatch 连接起来。

Vuex 更加灵活一些，组件中既可以 dispatch action，也可以 commit updates，而 Redux 中只能进行 dispatch，不能直接调用 reducer 进行修改。

从实现原理来说

Redux 使用的是不可变数据，而 Vuex 的数据是可变的。

Redux 每次都是用新 state 替换旧 state，而 Vuex 是直接修改。

Redux 在检测数据变化的时候，是通过 diff 的方式比较差异的，而 Vuex 其实和 Vue 的原理一样，是通过 getter/setter 来比较的。

### flux 状态管理

Flux 是一种基于单向数据流的架构。架构如图所示：

具体流程：Store 存储了视图层所有的数据，当 Store 变化后会引起 View 层的更新。如果在视图层触发 Action，比如点击一个按钮，当前的页面数据值会发生变化。Action 会被 Dispatcher 进行统一的收发处理，传递给 Store 层。由于 Store 层已经注册过相关 Action 的处理逻辑，处理对应的内部状态变化后，会触发 View 层更新。

### 简述 redux 状态管理

**核心设计**

包含了三大原则：单一数据源、纯函数 Reducer、State 是只读的。

一个核心点是处理“副作用”。

第一类是在 Dispatch 的时候会有一个 middleware 中间件层，拦截分发的 Action 并添加额外的复杂行为，还可以添加副作用。
第二类是允许 Reducer 层中直接处理副作用，采取该方案的有 React Loop，React Loop 在实现中采用了 Elm 中分形的思想，使代码具备更强的组合能力。
AJAX 请求等异步工作，或不是纯函数产生的第三方的交互都被认为是 “副作用”

[图]

**数据流**

Redux  中整个数据流的方案与 Flux 大同小异。

首先是 dispatch 一个 action。然后 reducer 会收到这个 action, 根据这个 action 对状态进行修改。状态修改以后会被处理容器捕捉到。从而对相关的界面进行更新。

**另外一些需要知道的**
Store，Store 存放应用程序的状态，并且有帮助函数来访问这些状态。Store 可以用来聆听变化和发送 action。Store 只有一个。
Reducers，数据的状态是通过 reducer 函数来改变的。
Actions，Actions 代表的是一个对象。有两部分，一个是 action 本身，另一个就是它的 payload。简单说就是对哪些数据进行哪些操作。
React-Redux，Redux 本身和 React 没有关系，只是数据处理中心，是 React-Redux 让他们联系在一起。React-rRedux 提供两个方法：connect 和 Provider。

### mobx 和 redux 有什么区别？

核心的差异：Redux 是单向数据流，Mobx 则是通过监听数据的属性变化，直接在数据上更改来触发 UI 的渲染。
redux 是只读的，不能直接去修改它，而是应该返回一个新的状态，同时使用纯函数。mobx 中的状态是可变的，可以直接对其进行修改。
mobx 结果也难以预测，调试会比较困难。redux 提供能够进行时间回溯的开发工具，同时其纯函数以及更少的抽象，让调试变得更加的容易


## redux 有哪些异步中间件？
1、redux-thunk

源代码简短优雅，上手简单

2、redux-saga

借助 JS 的 generator 来处理异步，避免了回调的问题

3、redux-observable

借助了 RxJS 流的思想以及其各种强大的操作符，来处理异步问题

## redux 异步中间件有什么什么作用?
假如有这样一个需求：请求数据前要向 Store dispatch 一个 loading 状态，并带上一些信息；请求结束后再向Store dispatch 一个 loaded 状态


## Redux模块✅

https://juejin.cn/post/7338617055149883419


### 1.Redux的工作流程是什么？

1. 通过createStore，生成Store
2. 用户定义action行为，并使用dispatch发起action
3. 当前Store中对应的reducer会处理Action返回新的State
4. State—旦有变化，Store就会调用监听(subscribe)函数，来更新View

### 2.说一说你理解的Redux中间件机制?

在 Redux 中，中间件的作用类似于服务器框架（如 Express 或 Koa）中的中间件。它们提供了一种方式来增强 Redux 的 dispatch 函数。通过使用中间件，我们可以在 action 被发送到 reducer 之前执行额外的操作，例如：

- 日志记录：记录每个 action 的信息和状态变化。
- 异步操作：处理异步逻辑，例如 API 请求。
- 错误处理：捕获和上报异常信息。

**中间件的实现**

中间件的基本结构是一个嵌套的三层高阶函数，这种结构允许中间件访问到 Redux 的 dispatch 和 getState 方法，以及下一个中间件。以下是一个简单的日志记录中间件的例子：
```js
function logger(store) {
  return function(next) {
    return function(action) {
      console.log('dispatching', action);
      let result = next(action);
      console.log('next state', store.getState());
      return result;
    }
  }
}
```
在这个例子中，logger 函数接收 store 对象，并返回一个函数。这个返回的函数接收下一个中间件作为参数 next，然后再返回一个新的函数，这个新函数接收 action 并进行处理。

**应用中间件**

为了在 Redux 应用中使用中间件，我们需要使用 applyMiddleware 函数。这个函数允许我们将多个中间件绑定到 Redux store。下面是如何在 Redux store 中应用中间件的例子：
```js
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
​
const store = createStore(
  rootReducer,
  applyMiddleware(logger, /* 其他中间件 */)
);
```

### 3.Redux 中异步的请求怎么处理？

**redux-thunk**

优点：
- 体积⼩: redux-thunk的实现⽅式很简单,只有不到20⾏代码
- 使⽤简单: redux-thunk没有引⼊像redux-saga或者redux-observable额外的范式,上⼿简单

缺点:
- 样板代码过多: 与redux本身⼀样,通常⼀个请求需要⼤量的代码,⽽且很多都是重复性质的。
- 耦合严重: 异步操作与redux的action偶合在⼀起,不⽅便管理。
- 功能孱弱: 有⼀些实际开发中常⽤的功能需要⾃⼰进⾏封装

例子：

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
​
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

// ...
const fetchSomeData = () => {
  return (dispatch) => {
    dispatch({ type: 'FETCH_DATA_REQUEST' });
    fetch('https://some-api.com/data')
      .then(response => response.json())
      .then(data => dispatch({ type: 'FETCH_DATA_SUCCESS', payload: data }))
      .catch(error => dispatch({ type: 'FETCH_DATA_FAILURE', error }));
  };
};
```

**redux-saga**

优点：
- 异步解耦：把异步操作单独分离出来放在saga文件中。当我们提交普通action的时候，如果匹配到了saga文件中的监听器就会被拦截下来，然后调用saga里配置的方法进行异步操作。如果没匹配上就走提交普通action的逻辑。总体来说逻辑较为清晰，但是使用成本增加。
- 异常处理: 受益于 generator function 的 saga 实现，代码异常/请求失败 都可以直接通过 try/catch 语法直接捕获处理
- 功能强⼤: redux-saga提供了⼤量的Saga 辅助函数和Effect 创建器供开发者使⽤,开发者⽆须封装或者简单封装即可使⽤。
- 灵活: redux-saga可以将多个Saga可以串⾏/并⾏组合起来,形成⼀个⾮常实⽤的异步flow

缺点：
- 额外的学习成本: redux-saga不仅在使⽤难以理解的 generator function,⽽且有数⼗个API,学习成本远超redux-thunk
- 体积庞⼤: 体积略⼤,代码近2000⾏，min版25KB左右
- 功能过剩: 实际上并发控制等功能很难⽤到,但是我们依然需要引⼊这些代码

**介绍一下redux-toolkit**

Redux Toolkit 是 Redux 官方推荐的工具集，旨在简化 Redux 应用的编写和维护。它提供了一系列工具和函数，帮助开发者以更简洁和模块化的方式编写 Redux 代码。Redux Toolkit 主要解决了 Redux 在使用过程中的一些常见问题，比如繁琐的设置、过多的样板代码以及复杂的配置。 

主要特性

- 配置 Store 简化：提供 configureStore() 方法来自动设置 store。这个方法默认集成了常见的中间件，简化了 store 的配置。
- 创建 Reducer 和 Action 简化：通过 createSlice() 方法，可以在一个函数中同时定义 reducer 和相关的 actions。这减少了样板代码，并使得逻辑更加集中。
- 不可变性管理：内置了 Immer 库，允许在 reducer 中以更直观的方式修改 state，而无需手动保证 state 的不可变性。
- 异步逻辑处理：提供 createAsyncThunk 函数用于处理异步逻辑，使得在 Redux 应用中处理异步操作变得更简单。
- 扩展性和可重用性：鼓励将 Redux 逻辑切割成更小的片段，通过提供的 API，这些片段可以轻松重用和测试。

创建Redux-Store

```js
// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
​
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
```
创建 Slice 使用 createSlice 来同时定义 reducer 和 actions：
```js
// features/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
​
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: 0,
  },
  reducers:
      {
        increment: state => {
          // Immer 让我们直接 "修改" state
          state.value += 1;
        },
        decrement: state => {
          state.value -= 1;
        },
        incrementByAmount: (state, action) => {
          state.value += action.payload;
        },
      },
  });
// 自动生成 action creators
export const { increment, decrement, incrementByAmount } = userSlice.actions;
​
export default userSlice.reducer;
```
在这个示例中，`createSlice` 自动为每个 reducer 函数生成对应的 action creator 和 action type。这样可以减少需要编写和维护的代码量。

**在组件中使用 Redux Toolkit**
然后，可以在 React 组件中使用这些 slices 和生成的 actions：
```js

// App.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from './features/userSlice';
​
function App() {
  const count = useSelector(state => state.user.value);
  const dispatch = useDispatch();
​
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(incrementByAmount(2))}>Increment by 2</button>
    </div>
  );
}
​
export default App;
```

### 4.Redux 请求中间件如何处理并发？

使用redux-Saga处理并发 Redux-Saga 使用 ES6 Generator 函数来管理副作用（如数据获取、访问浏览器缓存等）。对于并发请求，可以使用 all 效果指令（Effect）来同时触发多个任务。

```js
import { call, put, all } from 'redux-saga/effects';
​
// 模拟两个异步请求的函数
function fetchUser() {
  return fetch('/api/user').then(response => response.json());
}
​
function fetchPosts() {
  return fetch('/api/posts').then(response => response.json());
}
​
// Saga 处理两个并发请求
function* fetchUserAndPosts() {
  try {
    // 使用 all 同时发起请求
    const [user, posts] = yield all([
      call(fetchUser),
      call(fetchPosts)
    ]);
​
    // 当两个请求都完成时，dispatch actions
    yield put({ type: 'FETCH_USER_SUCCESS', payload: user });
    yield put({ type: 'FETCH_POSTS_SUCCESS', payload: posts });
  } catch (error) {
    // 如果任何一个请求失败，dispatch 一个失败的 action
    yield put({ type: 'FETCH_FAILED', error });
  }
}
```

### 5.Redux 和 Vuex 有什么区别，它们的共同思想？

Redux Redux 是一个用于 JavaScript 应用的状态管理库，广泛用于 React（也可以用于其他框架或库）：

- 单一状态树（Store）：Redux 使用一个单一的、不可变的状态树来存储整个应用的状态。
- Action：状态更改是通过发送（dispatch）action 来表示的。Action 是描述“发生了什么”的普通 JavaScript 对象。
- Reducer：Reducer 函数决定如何根据 action 更改状态。Reducer 必须是纯函数，它接收前一个状态和一个 action，返回新状态。
- 中间件：Redux 支持中间件，用于处理副作用（如异步操作或日志记录）。

Vuex Vuex 是专为 Vue.js 设计的状态管理模式和库：

- 状态管理（State）：Vuex 也使用单一状态树，存储整个应用的状态。
- Mutation：更改 Vuex 的状态的唯一方法是通过提交（commit）mutation。Mutation 必须是同步函数。
- Action：Action 类似于 Redux 中的 action，用于提交 mutation。不同的是，它们可以包含异步操作。
- Module：Vuex 允许将 store 分割成模块，每个模块可以拥有自己的状态、mutation、action 和 getter。

共同思想 尽管 Redux 和 Vuex 的实现细节有所不同，但它们在状态管理方面有着共同的理念：

- 集中式状态管理：它们都提倡将应用的状态集中存储在单一的状态树中，这使得状态更容易追踪和调试。
- 可预测性：通过明确的规则和模式（如 Redux 的 reducer 或 Vuex 的 mutation）来管理状态更改，使得应用的状态变得可预测和一致。
- 维护性和组织性：通过提供一种清晰的方式组织代码和管理数据流，帮助开发者构建大型、复杂的应用程序。

主要区别

- 框架依赖：Redux 是一个独立的库，可以与任何 UI 层一起使用，但通常与 React 一起使用；Vuex 专为 Vue.js 设计。
- 异步操作：Redux 本身不支持异步操作，需要中间件（如 redux-thunk 或 redux-saga）；Vuex 的 action 支持异步操作。
- API 和设计哲学：Redux 倾向于函数式编程风格，Vuex 更紧密地集成了 Vue.js 的响应式系统。

### 6.Redux的缺点：

1. 繁重的代码模板:修改一个state可能要动四五个文件，可谓牵一发而动全身。 
2. store 里状态残留:多组件共用 store 里某个状态时要注意初始化清空问题。 
3. 无脑的发布订阅:每次 dispatch 一个 action 都会遍历所有的reducer，重新计算 connect，这无疑是一种损耗; 
4. 交互频繁时会有卡顿:如果 store 较大时，且频繁地修改 store，会明显看到页面卡顿。 
5. 不支持Typescript。

