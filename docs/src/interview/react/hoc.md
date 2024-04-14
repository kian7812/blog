

# HOC 高阶组件

https://chodocs.cn/interview/react-summary/

高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

在我们的应用程序中，我们经常希望在多个组件中使用相同的逻辑。此逻辑可以包括将特定样式应用于组件、要求授权或添加全局状态。

能够在多个组件中重用相同逻辑的一种方法就是使用高阶组件模式。这种模式允许我们在整个应用程序中重用组件逻辑。

具体而言，高阶组件是参数为组件，返回值为新组件的函数。HOC 包含我们想要应用于作为参数传递的组件的某些逻辑。应用该逻辑后，HOC 返回带有附加逻辑的元素。

```jsx
// HOC模式例子
function withStyles(Component) {
  return (props) => {
    const style = { padding: '0.2rem', margin: '1rem' }
    return <Component style={style} {...props} />
  }
}

function Button() {
  return <button>Click me!</button>
}
function Text() {
  return <p>Hello World!</p>
}

const StyledButton = withStyles(Button)
const StyledText = withStyles(Text)
```