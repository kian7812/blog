# Lifecycle

## 

https://medium.com/@colliethecocky/react-%E9%9D%A2%E8%A9%A6%E9%A1%8C%E6%95%B4%E7%90%86-c24b3ef0e787

Mounting/ Updating/ Unmounting

1. Mounting: 元件被創建並插入到 DOM

constructor(): 用於初始化 state 和綁定 methods。
static getDerivedStateFromProps(): 傳回新的 state 對象，或在 props 變更時傳回更新 state 的物件。
render(): 根據 props 和 state 傳回 JSX，用於渲染元件的 UI。
componentDidMount(): 執行需要 DOM 的初始化操作、訂閱外部資料等。

2. Updating: props 或 state 改變觸發 re-render

static getDerivedStateFromProps()
shouldComponentUpdate(): 控制元件是否需要 re-render
render()
getSnapshotBeforeUpdate(): 捕獲更新前的信息
componentDidUpdate(): 執行更新後的 DOM 操作、網路請求等。

3. Unmounting: 元件從 DOM 移除

componentWillUnmount(): 清理操作，如取消定時器、網路請求、訂閱。

## 官方

https://zh-hans.react.dev/reference/react/Component