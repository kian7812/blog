# React事件系统✅

https://juejin.cn/post/7338617055149883419

## 1. react为什么需要合成事件？

- 跨浏览器兼容：合成事件首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力；
- 性能优化：对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。React 通过合成事件实现了事件委托机制， 对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象 。

## 2. react合成事件特点：

我们在 jsx 中绑定的事件(demo中的handerClick，handerChange),根本就没有注册到真实的dom上。是绑定在document上统一管理的。
真实的dom上的click事件被单独处理,已经被react底层替换成空函数。
react并不是一开始，把所有的事件都绑定在document上，而是采取了一种按需绑定，比如发现了onClick事件,再去绑定document click事件。

## 3. react事件原理：

react对事件是如何合成的: 构建初始化React合成事件和原生事件的对应关系，合成事件和对应的事件处理插件关系。 react事件是怎么绑定的（在react中，我们写了一个button，上面绑定了一个click事件，请问react是怎么处理的？）: 

第一步，会将你写的click事件，绑定到button对应的fiber树上，就像这样：

```js
// button 对应 fiber
memoizedProps = {
   onClick:function handerClick(){},
   className:'button'
}
```

第二步，进入diff阶段，会先判断该事件是不是合成事件，如果是合成事件，则会将用户写的事件向document注册。 

第三步，在注册事件监听器函数中，先找到 React 合成事件对应的原生事件集合，比如 onClick -> ['click'] , onChange -> [blur , change , input , keydown , keyup]，然后遍历依赖项的数组，绑定事件。 第四步，统一对所有事件进行处理，添加事件监听器addEventListener，绑定对应事件。 

react事件触发流程：

1. 首先通过统一的事件处理函数 dispatchEvent,进行批量更新batchUpdate。
2. 然后执行事件对应的处理插件中的extractEvents，合成事件源对象,每次React会从事件源开始，从上遍历类型为 hostComponent即 dom类型的fiber,判断props中是否有当前事件比如onClick,最终形成一个事件执行队列，React就是用这个队列，来模拟事件捕获->事件源->事件冒泡这一过程。
3. 最后通过runEventsInBatch执行事件队列，如果发现阻止冒泡，那么break跳出循环，最后重置事件源，放回到事件池中，完成整个流程。

**React事件处理流程详解**

1. 统一的事件处理函数 dispatchEvent：
    - 当一个事件（如点击）在DOM上触发时，React通过在文档的根层级上设置的统一事件监听器“dispatchEvent”来捕获这个事件。
    - 这个函数负责处理所有React管理的事件，无论它们是在哪个组件上触发的。
2. 批量更新batchUpdate：
    - 在｀dispatchEvent｀中，React可能会执行一个批量更新过程，这意味着React会将多个状态更新合并为一个单一的重渲染过程。
    - 这种方式可以优化性能，因为它减少了可能由于多次连续状态更新导致的重复渲染。
3. 执行事件处理插件的 extractEvents ：
    - React有一系列的事件处理插件，每个插件负责处理特定类型的事件。
    - 这些插件的“extractEvents”方法负责将原生事件转换为React的合成事件。这一步骤包括合成事件对象的创建，并基于原生事件的信息填充这个对象。
4. 遍历DOM树形成事件执行队列：
    - React会从事件发生的源头（即触发事件的DOM节点）开始，向上遍历DOM树。
    - 在这个过程中，React检查每个节点的 props，查看是否绑定了对应的事件处理器（如“onClick＂）。
    - 然后，React根据这些信息形成一个事件执行队列，这个队列模拟了事件的捕获、目标处理和冒泡过程。
5. 通过“runEventsInBatch”执行事件队列：
    - 这一步骤中，React遍历并执行之前建立的事件执行队列。
    - 如果在事件处理过程中遇到 event.stopPropagation()，React会停止进一步的事件传播（模拟DOM事件冒泡的停止）。
    - 完成事件处理后，合成事件对象会被放回事件池中以便重用，这有助于减少垃圾回收的负担，优化性能。

## 4.react 17对事件系统的改变：

- 事件绑定到根容器上: 事件统一绑定container上，ReactDOM.render(app， container);而不是document上，有利于多个 React 版本共存，例如微前端的场景。 
- 2.原生捕获事件的支持: 支持了原生捕获事件的支持， 对齐了浏览器原生标准。同时 onScroll 事件不再进行事件冒泡。onFocus 和 onBlur 使用原生 focusin， focusout 合成。
- 取消事件池 React 17 取消事件池复用，也就解决了在setTimeout打印，找不到e.target的问题。


## React事件机制

什么是合成事件
React基于浏览器的事件机制实现了一套自身的事件机制，它符合W3C规范，包括事件触发、事件冒泡、事件捕获、事件合成和事件派发等
React事件的设计动机(作用)：

在底层磨平不同浏览器的差异，React实现了统一的事件机制，我们不再需要处理浏览器事件机制方面的兼容问题，在上层面向开发者暴露稳定、统一的、与原生事件相同的事件接口
React把握了事件机制的主动权，实现了对所有事件的中心化管控
React引入事件池避免垃圾回收，在事件池中获取或释放事件对象，避免频繁的创建和销毁

React事件机制和原生DOM事件流有什么区别
虽然合成事件不是原生DOM事件，但它包含了原生DOM事件的引用，可以通过e.nativeEvent访问

DOM事件流是怎么工作的，一个页面往往会绑定多个事件，页面接收事件的顺序叫事件流
W3C标准事件的传播过程：

事件捕获
处于目标
事件冒泡

常用的事件处理性能优化手段：事件委托
把多个子元素同一类型的监听函数合并到父元素上，通过一个函数监听的行为叫事件委托
我们写的React事件是绑定在DOM上吗，如果不是绑定在哪里

React16的事件绑定在document上， React17以后事件绑定在container上,ReactDOM.render(app,container)

React事件机制总结如下：
事件绑定 事件触发

React所有的事件绑定在container上(react17以后),而不是绑定在DOM元素上（作用：减少内存开销，所有的事件处理都在container上，其他节点没有绑定事件）
React自身实现了一套冒泡机制，不能通过return false阻止冒泡
React通过SytheticEvent实现了事件合成

React实现事件绑定的过程

1.建立合成事件与原生事件的对应关系

registrationNameModule, 它建立了React事件到plugin的映射，它包含React支持的所有事件的类型，用于判断一个组件的prop是否是事件类型

```js
{
   onBlur:SimpleEventPlugin,
   onClick:SimpleEventPlugin,
   onClickCapture:SimpleEventPlugin,
   onChange:ChangeEventPlugin,
   onChangeCapture:ChangeEventPlugin,
   onMouseEnter:EnterLeaveEventPlugin,
   onMouseLeave:EnterLeaveEventPlugin,
   ...  
}
```

registrationNameDependencies， 这个对象记录了React事件到原生事件的映射

```js
{
  onBlur: ['blur'],
  onClick: ['click'],
  onClickCapture: ['click'],
  onChange: ['blur', 'change', 'click', 'focus', 'input', 'keydown', 'keyup', 'selectionchange'],
  onMouseEnter: ['mouseout', 'mouseover'],
  onMouseLeave: ['mouseout', 'mouseover'],
}

```

plugins对象, 记录了所有注册的插件列表

```js
plugins = [LegacySimpleEventPlugin, LegacyEnterLeaveEventPlugin, ...]

```

为什么针对同一个事件，即使可能存在多次回调，document（container）也只需要注册一次监听
因为React注册到document(container)上的并不是一个某个DOM节点具体的回调逻辑，而是一个统一的事件分发函数dispatchEvent - > 事件委托思想
dispatchEvent是怎么实现事件分发的
事件触发的本质是对dispatchEvent函数的调用

React事件处理为什么要手动绑定this
react组件会被编译为React.createElement,在createElement中，它的this丢失了，并不是由组件实例调用的，因此需要手动绑定this
为什么不能通过return false阻止事件的默认行为
因为React基于浏览器的事件机制实现了一套自己的事件机制，和原生DOM事件不同，它采用了事件委托的思想，通过dispatch统一分发事件处理函数
React怎么阻止事件冒泡

阻止合成事件的冒泡用e.stopPropagation()
阻止合成事件和最外层document事件冒泡，使用e.nativeEvent.stopImmediatePropogation()
阻止合成事件和除了最外层document事件冒泡，通过判断e.target避免