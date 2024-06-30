# React 系列教程之 Redux

李鹏周-React 系列教程之 Redux https://www.bilibili.com/video/BV1Uy4y1G7pt

## 03P-核心概念和 API

...

### Store

Store 就是保存数据的地方，你可以把它看成一个容器。整个应用只能有一个 Store。Redux 提供 createstore 这个函数，用来生成 Store。

```
import createStore from 'redux';
const store = createstore(fn);
```

### State

store 对象包含所有数据。如果想得到某个时点的数据，就要对 Store 生成快照。这种时点的数据集合，就叫做 State.
当前时刻的 State,可以通过 store.getstate()拿到。

```
import createStore from 'redux';
const store = createStore(fn);
const state = store. getState();
```

Redux 规定，一个 State 对应一个 View。只要 State 相同，View 就相同。你知道 State,就知道 View 是什么 样，反之亦然。

### Action

State 的变化，会导致 View 的变化。但是，用户接触不到 State，只能接触到 View。所以，State 的变化必须是 View 导致的。Action 就是 View 发出的通知，表示 State 应该要发生变化了。

Action 是一个对象。其中的 type 属性是必须的，表示 Action 的名称。其他属性可以自由设置。

```
const action = {
  type: 'ADD_TODO',
  payload: 'Learn Redux'
};
```

上面代码中，Action 的名称是 ADD_TODO,它携带的信息是字符串 Learn Redux。

可以这样理解，Action 描述当前发生的事情。改变 State 的唯一办法，就是使用 Action。它会运送数据到 Store✅。

### Action Creator

View 要发送多少种消息，就会有多少种 Action。如果都手写，会很麻烦。可以定义一个函数来生成 Action，这个函数就叫 Action Creator。

```
const ADD_TODO = '添加 TODO';
function addTodo(text) {
  return{
    type: ADD_TODO,
    text
  }
}

const action = addTodo( 'Learn Redux');
```

上面代码中，addTodo 函数就是一个 Action Creator。

### store.dispatch

store.dispatch（）是 View 发出 Action 的唯一方法 ✅。

```
import { createstore } from 'redux';
const store = createstore(fn);

store.dispatch({
  type: 'ADD_TODO',
  payload: 'Learn Redux'
});
```

上面代码中，store.dispatch 接受一个 Action 对象作为参数，将它发送出去。
结合 Action Creator，这段代码可以改写如下。
store.dispatch(addTodo('Learn Redux'));

### reducer

Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer.

Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。

```
const reducer function (state, action){
...
return new state;
};
```

整个应用的初始状态，可以作为 State 的默认值。下面是一个实际的例子。

```
const defaultstate = 0;

const reducer =(state defaultState, action) {
  switch (action. type) {
    case 'ADD':
    return state action. payload;
    default:
    return state;
  }
};

const state = reducer(1, {
  type: 'ADD',
  payload: 2
});
```

上面代码中，reducer 函数收到名为 ADD 的 Action 以后，就返回一个新的 State，作为加法的计算结果。其他运算的逻辑（比如减法），也可以根据 Action 的不同来实现。
实际应用中，Reducer 函数不用像上面这样手动调用，store.dispatch 方法会触发 Reducer 的自动执行。为此，Store 需要知道 Reducer 函数，做法就是在生成 Store 的时候，将 Reducer 传入 createstore 方法。

```
import createstore from 'redux';
const store = createstore(reducer);
```

上面代码中，createstore 接受 Reducer 作为参数，生成一个新的 Store。以后每当 store.dispatch 发送过来 一个新的 Action,就会自动调用 Reducer,得到新的 State。

为什么这个函数叫做 Reducer 呢？因为它可以作为数组的 reduce 方法的参数。请看下面的例子，一系列 Action 对象按照顺序作为一个数组。

```
const actions = [
{type: 'ADD', payload: 0 }
{type: 'ADD', payload: 1 }
{"payload":2,"type":"ADD"}
]
const total=actions.reduce(reducer, 0)；//3
```

上面代码中，数组 actions 表示依次有三个 Action，分别是加 0、加 1 和加 2。数组的 reduce 方法接受 Reducer 函数作为参数，就可以直接得到最终的状态 3。

### 纯函数

Reducer 函数最重要的特征是，它是一个纯函数。也就是说，只要是同样的输入，必定得到同样的输出。纯函数是函数式编程的概念，必须遵守以下一些约束。

- 不得改写参数
- 不能调用系统 I/O 的 API
- 不能调用 Date.now（）或者 Math.random（）等不纯的方法，因为每次会得到不一样的结果

由于 Reducer 是纯函数，就可以保证同样的 State，必定得到同样的 View。但也正因为这一点，Reducer 函数里面不能改变 State，必须返回一个全新的对象，请参考下面的写法。

```
//State 是一个对象
function reducer(state, action){
return Object.assign({}, state, {thingToChange })；
// 或者
return {...state, ...newState }
}

//State 是一个数组
function reducer(state, action){
return [...state, newItem];
}
```

最好把 State 对象设成只读。你没法改变它，要得到新的 State，唯一办法就是生成一个新对象。这样的好处是，任何时候，与某个 View 对应的 State 总是一个不变的对象。

### store.subscribe()

Store 允许使用 store.subscribe 方法设置监听函数，一旦 State 发生变化，就自动执行这个函数。

```
import { createstore } from 'redux';
const store = createstore(reducer);

store.subscribe(listener);
```

显然，只要把 View 的更新函数（对于 React 项目，就是组件的 render 方法或 setState 方法）放入 listen, 就会实现 View 的自动渲染 ✅。

store.subscribe 方法返回一个函数，调用这个函数就可以解除监听。

```
let unsubscribe = store.subscribe(()=>
console. log(store. getstate())
);

unsubscribe();
```

### 示例

```js
import ReactDOM from "react-dom/client";
import { createStore } from "redux"; // 不推荐了，强烈反对

// 1. 定语 reducer
// 参数 state 容器的初始状态
// 参数 action 是修改 state 的行为类型，type 行为类型，payload 可选的其它数据 ✅
function Reducer(state = 10, action) {
  const { type } = action;
  if (type === "INCREMENT") {
    return state + 1;
  } else if (type === "DECREMENT") {
    return state - 1;
  } else {
    return state;
  }
}

// 2. 基于 reducer 创建 Store
const store = createStore(Reducer, 100);

// 3. 获取 store 的状态
console.log(store.getState());

// 4. 更新 store 的状态
// store.dispatch({type: 行为类型, 额外参数...})
// 发起 dispatch 就是在调用 reducer
// dispatch 接受的参数叫做 action ✅
setTimeout(() => {
  store.dispatch({
    type: "INCREMENT",
  });
}, 1000);

// 5. 监测 store 中 state 变化，驱动视图更新
store.subscribe(() => {
  // console.log(store.getState())
  render();
});

const Counter = (props) => {
  return (
    <div>
      <h1>{props.value}</h1>
      <button>Increment</button>
      <button>Decrement</button>
    </div>
  );
};

render();

function render() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <Counter value={store.getState()} />
  );
}
```

## 04P-拆分 Reducer

...

### Reducer 的拆分

Reducer 函数负责生成 State。由于整个应用只有一个 State 对象，包含所有数据，对于大型应用来说，这个 State 必然十分庞大，导致 Reducer 函数也十分庞大。
请看下面的例子。

```
const chatReducer = (state = defaultstate, action = {})=> {
    const { type, payload } = action;
    switch (type){
        case ADD_CHAT:
            return Object.assign({}, state, {
                chatLog: state.chatLog.concat(payload)
            })
        case CHANGE_STATUS:
            return Object.assign({}, state,{
                statusMessage: payload
            });
        case CHANGE_USERNAME:
            return Object.assign({}, state, {
                userName: payload
        })
        default: return state;
    }
};
```

上面代码中，三种 Action 分别改变 State 的三个属性。

- ADD_CHAT: chatLog 属性
- CHANGE_STATUS: statusMessage 属性
- CHANGE_USERNAME: userName 性
  这三个属性之间没有联系，这提示我们可以把 Reducer 函数拆分。不同的函数负责处理不同属性，最终把它们合并成一个大的 Reducer 即可 ✅。

（ 注意：传给子 reducer 的是对应的子 state，combineReducers 也是这样的 ✅）

```
export default function (state = defaultstate, action = {}) {
  return {
    chatLog: chatLog(state.chatLog, action),
    statusMessage: statusMessage(state.statusMessage, action),
    userName: userName(state.userName, action),
  }
}
```

上面代码中，Reducer 函数被拆成了三个小函数，每一个负责生成对应的属性。

这样一拆，Reducer 就易读易写多了。而且，这种拆分与 React 应用的结构相吻合：一个 React 根组件由很多子组件构成。这就是说，子组件与子 Reducer 完全可以对应。

Redux 提供了一个 combineReducers 方法，用于 Reducer 的拆分。你只要定义各个子 Reducer 函数，然后用这 个方法，将它们合成一个大的 Reducer。✅

```
// 属性名 与 子reducer 同名（简写）
export default combineReducers({
  chatLog,
  statusMessage,
  userName,
})

// 属性名 与 子reducer 不同名
export default combineReducers({
  chatLog: changeChatLog,
  statusMessage: changeStatusMessage,
  userName: changeUserName,
})
```

总之，combineReducers()做的就是产生一个整体的 Reducer 函数。该函数根据 State 的 key 去执行相应的子 Reducer，并将返回结果合并成一个大的 State 对象。

### 示例

```js
// src/reducers/chatLog.js
export default function chatLog (state = [], action) {
  const { type, payload } = action

  switch (type) {
    case "ADD_CHAT":
      return [...state, payload]

    default:
      return state
  }
}
// src/reducers/statusMessage.js
export default function statusMessage (state = '', action) {
  const { type, payload } = action

  switch (type) {
    case "CHANGE_STATUS":
      return payload
    default:
      return state
  }
}
// src/reducers/userName.js
export default function userName (state = '', action) {
  const { type, payload } = action

  switch (type) {
    case "CHANGE_USERNAME":
      return payload

    default:
      return state
  }
}

// src/reducers/index.js
import { combineReducers } from "redux"
import chatLog from "./chatLog"
import statusMessage from "./statusMessage"
import userName from "./userName"

// export default function (state = {}, action = {}) {
//   return {
//     chatLog: chatLog(state.chatLog, action),
//     statusMessage: statusMessage(state.statusMessage, action),
//     userName: userName(state.userName, action),
//   }
// }

// 属性名 与 子reducer 同名（简写）
export default combineReducers({
  chatLog,
  statusMessage,
  userName,
})

// 属性名 与 子reducer 不同名
// export default combineReducers({
//   chatLog: changeChatLog,
//   statusMessage: changeStatusMessage,
//   userName: changeUserName,
// })

// main.jsx
import { createStore } from 'redux' // 不推荐了，强烈反对
import rootReducer from './reducers'

// 2. 基于 reducer 创建 Store
const store = createStore(
  rootReducer
)

```

## 05P-中间件概念

...

### 中间件（middleware）

中间件的概念
举例来说，要添加日志功能，把 Action 和 State 打印出来，可以对 store.dispatch 进行如下改造。

```
const dispatch = store.dispatch;
store.dispatch = function(action) {
  console.log('dispatching', action); // 日志✅
  dispatch(action)
  console.log('state', store.getState()); // 日志✅
}
```

上面代码中，对 store.dispatch 进行了重定义，在发送 Action 前后添加了打印功能。这就是中间件的雏形。

中间件就是一个函数，对 store.dispatch 方法进行了改造，在发出 Action 和执行 Reducer 这两步之间，添加了其他功能。

（中间件-定制 dispatch 方法，加入一些自定义逻辑）✅。

（redux 中间件概念和 nodejs 的应该类似，都是注册到全局）✅

## 06P-使用 redux-logger 中间件

中间件的用法
日志中间件，redux-logger 模块。

```
import { createStore, applyMiddleware } from 'redux'
import logger, {createLogger} from 'redux-logger'

// or 看文档
// const logger = createLogger(...)

const store = createStore(
  rootReducer,
  applyMiddleware(logger)
)

```

上面代码中，redux-logger 提供一个生成器 createLogger,可以生成日志中间件 logger。然后，将它放 在 applyMiddleware 方法之中，传入 createStore 方法，就完成了 store.dispatch()的功能增强。

这里有两点需要注意：

```
(1)createStore 方法可以接受整个应用的初始状态作为参数，那样的话，applyMiddleware 就是第三个参数了。
const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(logger)
)

（2）中间件的次序有讲究。
const store =  createstore(
  reducer,
  applyMiddleware(thunk, promise, logger)
);
```

上面代码中 applyMiddleware 方法的三个参数，就是三个中间件，有的中间件有次序要求，使用前要查一下文。✅。

### 示例

```js
import { createStore, applyMiddleware } from "redux"; // 不推荐了，强烈反对
import rootReducer from "./reducers";
import logger, { createLogger } from "redux-logger";

// 2. 基于 reducer 创建 Store
const store = createStore(rootReducer, applyMiddleware(logger));
```

## 07P-使用 redux-thunk 中间件

```
import { thunk } from 'redux-thunk';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)
```

一般 action creator 返回对象，且不能有任何逻辑的，if else 等判断也不行。

```
function increment() {
  return {
    type: "INCREMENT"
  }
}
```

- 中间件 action creator 返回函数，参数 dispatch，getState 都来自 store。
- 如果没有配置 thunk 返回函数是不对的，不会生效。
- 配置了 thunk 就可以返回函数，中间件 thunk 帮你调用这个返回函数。
- action creator 可接受参数，及判断逻辑，可停止 dispatch。

```
function asyncIncrement(params) {
  // if (params === true) {
  //   return
  // }

  return function (dispatch, getState) {
    const state = getState()

    if (state % 2 === 0) {
      return
    }

    setTimeout(() => {
      dispatch(increment())
    }, 1000);
  }
}
```

### 示例

```js
// src/main.jsx
import ReactDOM from "react-dom/client";
import { createStore, applyMiddleware } from "redux"; // 不推荐了，强烈反对
import { thunk } from "redux-thunk";

function rootReducer(state = 0, action) {
  const { type } = action;
  if (type === "INCREMENT") {
    return state + 1;
  } else if (type === "DECREMENT") {
    return state - 1;
  } else {
    return state;
  }
}

const store = createStore(rootReducer, applyMiddleware(thunk));

// 5. 监测 store 中 state 变化，驱动视图更新
store.subscribe(() => {
  render();
});

const Counter = (props) => {
  return (
    <div>
      <h1>{props.value}</h1>
      <div>
        <button onClick={props.increment}>Increment</button>
      </div>
      <div>
        <button onClick={props.asyncIncrement}>AsyncIncrement</button>
      </div>
    </div>
  );
};

// 一般 action creator 返回对象，且不能有任何逻辑的，if else 等判断也不行。
function increment() {
  return {
    type: "INCREMENT",
  };
}

// action creator 返回函数，参数dispatch，getState都来自store
// 如果没有配置thunk返回函数是不对的，不会生效。
// 配置了thunk就可以返回函数，中间件thunk帮你调用这个返回函数。
// action creator 可接受参数，及判断逻辑，可停止dispatch。
function asyncIncrement(params) {
  // if (params === true) {
  //   return
  // }

  return function (dispatch, getState) {
    const state = getState();

    if (state % 2 === 0) {
      return;
    }

    setTimeout(() => {
      dispatch(increment());
    }, 1000);
  };
}

render();

function render() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <Counter
      value={store.getState()}
      increment={() => store.dispatch(increment())}
      asyncIncrement={() => store.dispatch(asyncIncrement())}
    />
  );
}
```

## 08P-让 redux 和 React 连接起来

pnpm add react-redux

Redux 默认并不包含 React 绑定库，需要单独安装。

npm install --save react-redux

Redux 的 React 绑定库是基于容器组件和展示组件相分离的开发思想 ✅。

React-Redux 将所有组件分成两大类：UI 组件(presentational component)和容器组件(container component).

UI 组件有以下几个特征：✅

- 只负责 UI 的呈现，不带有任何业务逻辑
- 没有状态（即不使用 this.state 这个变量）
- 所有数据都由参数（this.props）提供.不使用任何 Redux 的 API

下面就是一个 UI 组件的例子。

```
const Title= (value) => <h1>(value)</h1>;
```

因为不含有状态，UI 组件又称为“纯组件”，即它纯函数一样，纯粹由参数决定它的值。

容器组件的特征恰恰相反: ✅

- 负责管理数据和业务逻辑，不负责 UI 的呈现
- 带有内部状态
- 使用 Redux 的 APl

总之，只要记住一句话就可以了：UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑 ✅。

你可能会问，如果一个组件既有 UI 又有业务逻辑，那怎么办？回答是，将它拆分成下面的结构：
外面是一个容器组件，里面包了一个 UI 组件。前者负责与外部的通信，将数据传给后者，由后者渲染出视图 ✅。

React—Redux 规定，所有的 UI 组件都由用户提供，容器组件则是由 React—Redux 自动生成。也就是说，用户负责视觉层，状态管理则是全部交给它 ✅。

### conncect

React—Redux 提供 connect 方法，用于从 UI 组件生成容器组件。connect 的意思，就是将这两种组件连起来。

```
import connect from 'react-redux'
const VisibleTodoList = connect()(TodoList);
```

上面代码中，TodoList 是 UI 组件，VisibleTodoList 就是由 React-Redux 通过 connect 方法自动生成的容器 组件。

但是，因为没有定义业务逻辑，上面这个容器组件毫无意义，只是 UI 组件的一个单纯的包装层。为了定义业务逻辑，需要给出下面两方面的信息。

- （问题 1）输入逻辑：外部的数据（即 state 对象）如何转换为 UI 组件的参数。
- （问题 2）输出逻辑：用户发出的动作如何变为 Action 对象，从 UI 组件传出去。
  因此，connect 方法的完整 API 如下。

```
import connect from 'react-redux'
const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)
```

上面代码中，connect 方法接受两个参数：mapStateToProps 和 mapDispatchToProps。它们定义了 UI 组件的 业务逻辑。前者负责输入逻辑，即将 state 映射到 UI 组件的参数（props），后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Action✅。

### 示例

```js
// 1. src/components/Counter.jsx
export default function Counter(props) {
  return (
    <div>
      <h1>Counter Component</h1>
      <h2>{props.value}</h2>

      <button onClick={props.handleIncrement}>点击+1</button>
      <button onClick={props.handleDecrement}>点击-1</button>
    </div>
  )
}

// 2. src/containers/CounterContainer.jsx
import { connect } from 'react-redux'
import Counter from '../components/Counter'


const mapStateToProps = (state) => {
  return {
    foo: 'bar',
    value: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClick() {
      window.alert('hello')
    },
    handleIncrement() {
      dispatch({
        type: "INCREMENT"
      })
    },
    handleDecrement() {
      dispatch({
        type: "DECREMENT"
      })
    }
  }
}

const CounterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)

export default CounterContainer


// 3. src/store/index.js
import { createStore } from 'redux'

function Reducer(state = 0, action) {
  const { type } = action
  if (type === "INCREMENT") {
    return state + 1
  } else if (type === "DECREMENT") {
    return state - 1
  } else {
    return state
  }
}

const store = createStore(Reducer)

export default store

//4. src/App.jsx
import CounterContainer from './containers/CounterContainer'
function App() {

  return (
    <div>
      <CounterContainer />
    </div>
  )
}

export default App

//5. src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {Provider} from 'react-redux'
import store from './store/index.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)

```
