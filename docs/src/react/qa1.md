# React 问题

## React组件重新渲染优化✅

结合 https://mp.weixin.qq.com/s/RBK0cvI4zt-dvyefLMYS-w
- *何遇er-讲清楚 React 的重新渲染 https://juejin.cn/post/7168257213738254344


### 一、引起重新渲染的方式都有哪些

初始化渲染之后，下面的这些原因会让React重新渲染组件：

1. 类组件
- 调用 this.setState 方法。
- 调用this.forceUpdate方法。

2. 函数组件
- 调用 useState 返回的 setState。
- 调用 useReducer 返回的 dispatch。


3. 其他
- 组件订阅的 context value 发生变更
- 重新调用 ReactDOM.render(`<AppRoot>`)

4. **默认情况，如果父组件重新渲染，那么 React 会重新渲染它所有的子组件**。

```
 A
| |
B C
  |
  D
当用户点击组件 A 中的按钮，使 A 组件 count 状态值加1，将发生如下的渲染流程：
1. React将组件A添加到重新渲染队列中。
2. 从组件树的顶部开始遍历，快速跳过不需要更新的组件。
3. React发生A组件需要更新，它会渲染A。A返回B和C
4. B没有被标记为需要更新，但由于它的父组件A被渲染了，所以React会渲染B
5. C没有被标记为需要更新，但由于它的父组件A被渲染了，所以React会渲染C，C返回D
6. D没有标记为需要更新，但由于它的父组件C被渲染了，所以D会被渲染。
```
**在默认渲染流程中，React 不关心子组件的 props 是否改变了，它会无条件地渲染子组件**。很可能上图中大多数组件会返回与上次完全相同的结果，因此 React 不需要对DOM 做任何更改，但是，React 仍然会要求组件渲染自己并对比前后两次渲染输出的结果，这两者都需要时间。

### 二、如何优化组件重新渲染，提高渲染性能

重点是，**减少不必要的重新渲染**，即前后渲染的输出结果没有改变，它对应的DOM节点也不需要更新。这样的重新渲染就可以跳过。

**React组件的输出结果始终基于当前 props 和 state 的值，因此，如果我们知道组件的 props 和 state 没有改变，那么我们可以无后顾之忧地让组件跳过重新渲染**。（如果输入的（props、state 与 上下文）都是一样的，那么就应该返回一样的 JSX。）

React 提供了 3 个主要的API让我们跳过重新渲染:

1. **React.Component 的 shouldComponentUpdate**：这是类组件可选的生命周期函数，它在组件 render 阶段早期被调用，如果返回false，React 将跳过重新渲染该组件，使用它最常见的场景是检查组件的 props 和 state 是否自上次以来发生了变更，如果没有改变则返回false。

2. **React.PureComponent**：它在 React.Component 的基础上添加默认的 shouldComponentUpdate 去比较组件的 props 和 state 自上次渲染以来是否有变更。

3. **React.memo()**：它是一个高阶组件，接收自定义组件作为参数，返回一个被包裹的组件，被包裹的组件的默认行为是检查 props 是否有更改，如果没有，则跳过重新渲染。

上述方法都通过‘浅比较’来确定值是否有变更，如果通过 mutable 的方式修改状态，**这些 API 会认为状态没有变**。

4. 如果组件在其渲染过程中使用的元素的引用与上一次渲染时的引用完全相同，那么 React 不会重新渲染引用相同的组件。示例如下：

```js
function ShowChildren(props: {children: React.ReactNode}) {
  const [count, setCount] = useState<number>(0)

  return (
    <div>
      {count} <button onClick={() => setCount(c => c + 1)}>click</button>
      {/* 写法一 */}
      {props.children}
      {/* 写法二 */}
      {/* <Children/> */}
    </div>
  )
}
```
上述 ShowChildren 的 props.children 对应 Children 组件，因此写法一和写法二在浏览器中呈现一样。点击按钮不会让写法一的 Children 组件重新渲染，但是会使写法二的 Children 组件重新渲染。

上述4种方式跳过重新渲染意味着 React 会跳过整个子树的重新渲染。

5. 补充：Props 对渲染优化的影响，结合 React.memo 和 useCallback 改善

默认情况，只要组件重新渲染，React 会重新渲染所有被它嵌套的后代组件，即便组件的 props 没有变更。如果试图通过 React.memo 和  React.PureComponent 优化组件的渲染性能，那么要注意每个 prop 的引用是否有变更。下面的示例试图使用 React.memo 让组件不重新渲染，但事与愿违，组件会重新渲染，代码如下：

```js
const MemoizedChildren = React.memo(Children)

function Parent() {
  const onClick = () => { /** todo*/}
  return <MemoizedChildren onClick={onClick}/>
}
```
上述代码中，**Parent 组件重新渲染会创建新的 onClick 函数**，**所以对 MemoizedChildren 而言，props.onClic k的引用有变化，最终被 React.memo 包裹的Children 会重新渲染，如果让组件跳过重新渲染对你真的很重要，那么在上述代码中将 React.memo 与 useCallback 配合使用才能达到目的。
```js
function Parent() {
  const onClick = useCallBack(() => { /** todo*/}, [])
  return <MemoizedChildren onClick={onClick}/>
}
```

6. 补充：下面写法不推荐，正确的做法是将 ChildCom 放在ParentCom 的外面。
```js
function ParentCom() {
  // 每一次渲染 ParentCom 时，都会创建新的ChildCom组件
  function ChildCom() {/**do something*/}
  
  return <ChildCom />
}
```

7. 补充：
https://juejin.cn/post/7244818537776136247

只要 context value 被更新，那么订阅该 context 的组件一定会重新渲染，而不管 context value中更新的那部分值是否被它使用，也不管它的祖先组件是否跳过重新渲染，所以推荐将不同职责的数据保存到不同的 context 中，以减少不必要的重新渲染。

如果 Context.Provider 的 value 属性传递了一个对象字面量，那么 Context.Provider 的父组件每一次重新渲染都会使 context value 更新，进而导致订阅该 context 的组件重新渲染，所有应该避免给 Context.Provider 的 value 传对象字面量。


### 三、为什么要重新渲染

简单讲就是 双缓存 fiber树，
详细的可以看 setSate 流程。


## React 状态的不变性 immutable

*何遇er-React 状态的不变性 https://juejin.cn/post/7165338973806526501  *React 渲染密切相关的还有另一个概念，即Immutability*。

**1. 总结（为什么要不可改变）**

在 react 应用中，更新 state 必须满足 Immutability 原则，👍**因为 React.memo、PureComponent shouldComponentUpdate 和 React Hooks 通过浅比较确定 state 是否发生变更，如果变更 state 的方式不满足 Immutability 原则，它们会认为 state 的值没有变化**。

在更新 state 并重新渲染时，React 会将类组件的 this.setState 与函数组件的 useState、useReducer hooks 区别对待。在函数组件中，React 要求所有 hooks 更新状态必须返回一个新的引用作为状态值，如果 React 发现状态更新来自 hook，👍**它会检查该值的引用是否与以前的引用相同，如果相同，它将退出该函数组件的渲染流程，最终用户界面不更新**。👍**使用 this.setState 更新类的 state，React 并不关心状态的引用是否变化，只要在类组件中调用 this.setState，该组件一定会重新渲染**。

**2. 什么是 immutable**

immutable 指不发生变化，这意味着创建新的值去替换原来的值，而非改变原来的值，与 immutable 相反的概念是 mutable，下面用代码演示 mutable 和 immutable。

```js

function addAgeMutable(user: User) {
    user.age = 12 // 修改原来的
    return user
}

function addAgeImmutable(user: User) {
    const other = Object.assign({}, user) // 创建新的
    other.age = 12
    return other
}

let user1Original = {name: 'Bella'}
let user1New = addAgeMutable(user1Original) // 用 mutable 的方式

let user2Original = {name: 'Bella'}
let user2New = addAgeImmutable(user2Original) // 用 immutable 的方式

console.log('user1Original 与 user1New 相同吗?',user1Original === user1New) // true
console.log('user2Original 与 user2New 相同吗?',user2Original === user2New) // false
```

上述 addAgeMutable 函数直接在入参上新增 age 属性，但 addAgeImmutable 函数没有改变入参，而是新建了一个对象，在新对象上添加age属性。

👍总结一下，immutable 是指不修改原来的；mutable 是指在原来的基础上修改。通过 mutable 的方式修改变量会导致修改前后变量的引用不变。某些操作数组的方法会让原来的数组发生变化，比如：push/pop/shift/unshift/splice，这些方法是 mutable 的，而有一些操作数组的方法不会让原来的数组发生变化，而是返回一个新组件，比如：slice/concat，这些函数是 immutable 的。字符串、布尔值和数值操作都不改变原来的值，而是创建一个新的值。

**3. React 与 Immutability**

在 React 程序中，组件的 state 必须具备不变性，接下来演示修改state的正确与不正确的方式。为了说明state的组成结构，先定义个State接口，代码如下：

```ts
interface State {
  user: User
  hobbies: string[]
  time: string
}
```

从上述接口可以看出，组件有三个状态，分别为：user、hobbies 和 time，它们的数据类型各不相同。

**修改 state 的错误案例**

下面罗列的案例试图用 mutable 的方式修改 state，这些做法全部是错误的。

```ts
// 案例一
this.state.user.age = 13
// 案例二
this.setState({
    user: Object.assign(this.state.user, {age: 13})
})
// 案例三
this.setState({
    hobbies: this.state.hobbies.reverse(),
})
// 案例四
this.state.hobbies.length = 0
this.setState({
    hobbies: this.state.hobbies,
})
```

案例一: 直接修改 user 的内部结构，修改前后 user 的引用不变。

案例二: 错误使用 Object.assign，Object.assign 将第二个参数的属性合并到第一个参数上，然后将第一个参数返回，这意味着案例二还是修改了user的内部结构，修改前后user的引用不变。

案例三: 使用reverse将数组翻转，它翻转的是原数组，翻转前后数据的引用不变。

案例四: 修改hobbies的长度，修改前后hobbies的引用一样。

上述四个案例都不符合数据一旦创建就不发生变化的原则，由于调用了 setState 方法，所以对于用 React.Component 创建的组件而言，不会发生故障，对于用 React.PureComponent 创建的组件，会引发故障，即：界面不更新。

**修改 state 的正确案例**

下面罗列的案例与错误案例一一对应，它们通过 immutable 的方式修改 state。
```js
// 案例一
this.setState({
    user: {...this.state.user, age: 13}
})
// 案例二
this.setState({
    user: Object.assign({},this.state.user, {age: 13})
})
// 案例三
this.setState({
    hobbies: [...this.state.hobbies].reverse()
})
// 案例四
this.setState({
    hobbies: []
})
```
上述案例都是新建一个值，用新的值替换原来的值，符合数据一旦创建就不发生变化的原则。