# React 组件和API

## `<Fragment>`

## `<Suspense>`

## lazy

## memo

## startTransition

## flushSync 

1. 来自@react-dom
2. 使用 flushSync 是不常见的行为，并且可能损伤应用程序的性能。

flushSync(callback)，React 会立即调用这个回调函数，并同步刷新其中包含的任何更新。它也可能会刷新任何挂起的更新、Effect 或 Effect 内部的更新。如果因为调用 flushSync 而导致更新挂起（suspend），则可能会重新显示后备方案。