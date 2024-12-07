# Vue 基础问题

## Vue 源码阅读 - 文件结构与运行机制 \*

https://juejin.cn/post/6844903630458486798

## Vue 双向绑定 MVVM 框架有哪些优点？

Vue 实现了数据和视图的分离解耦，以数据驱动视图，只关系数据的变化，DOM 操作被封装。

响应式双向数据绑定，组件系统，数据驱动，虚拟 dom，减少真实 dom 操作

**谈谈对组件的理解**

- 组件化开发能大幅提高应用开发效率、测试性、复用性
- 常用的组件化技术：属性、自定义事件、插槽
- 降低更新范围，值重新渲染变化的组件
- 高内聚、低耦合、单向数据流

**谈谈你对 MVVM 的理解？**

Model-View-ViewModel ，Model 表示数据模型层。 View 表示视图层，ViewModel 是 View 和 Model 层的桥梁，数据绑定到 ViewModel 层并自动渲染到页面中，视图变化通知 ViewModel 层更新数据。

View（DOM） ViewModel（DOM Listeners、Data Bindings）Model（Plain JavaScript Objects）

**MVC**

全名是 Model View Controller，是模型(model)－视图(view)－控制器(controller)

## 说说 SPA 和 MPA 分别是什么，以及它们之间的区别？

**SPA（单页面应用）（single-page application）**

只在首次进入页面时，根据入口 index.html 加载一次页面所需静态资源（JavaScript、CSS 等），之后页面跳转通过前端路由来控制。

优点：

- 用户体验好、快，页面跳转不需要重新加载整个页面及静态资源；
- 基于上面一点，SPA 相对对服务器压力小；
- 前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理；
- 页面间数据通信比较容易。

缺点：

- 初次加载耗时多，减少白屏时间，前端会做首次加载的优化；
  - 路由懒加载、UI 库、工具库等按需加载、图片懒加载（如果首页是图片列表），工程构建时相关优化（静态资源换成优化、hash、splitChunks、treeShaking 等）
- SEO 难度较大：由于所有的内容都在一个页面中动态替换显示，所以在 SEO 上其有着天然的弱势。
- 场景：对体验要求高。

**MPA（多页面应用）**

传统多页面，访问页面的内容已经再 HTML 里了，不需要再编译；

优点：

- 首屏加载比较快，
- 搜索引擎优化效果好，引擎爬虫可直接爬取内容。

缺点：

- 页面跳转需要重新加载静态资源（如果是公共资源可以访问缓存）；
- 页面跳转需要重新加载页面，体验不好；
- 页面间通信比较单一只能是 url 的参数、cookie、storage。
  场景：需要对搜索引擎友好的网站

## 组件 data 选项为什么必须是个函数？

- 避免组件中的 data 数据互相影响。
- 一个 vue 组件可以复用创建多个实例，
- 如果 data 是一个对象的话，多个实例会共用同一个 data 对象状态，改变其中一个，其它的也会受到影响。
- 为了保证组件的数据独立，每个组件都必须通过 data 函数返回一个对象作为组件的状态数据。

## methods 选项方法为什么不能是箭头函数？

注意，不应该使用箭头函数来定义 method 函数 (例如 plus: () => this.a++)。

- 理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例。

## v-if 和 v-show 的区别

- v-if 条件不满足时不渲染此节点
  - 在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建；
- v-show 不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 的 “display” 属性进行切换。

场景：
一般来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。

### 为什么 v-for 和 v-if 不建议用在一起（📢Vue3 有变化）

- 当 v-for 和 v-if 处于同一个节点时，`v-for 的优先级比 v-if 更高`，`这意味着 v-if 将分别重复运行于每个 v-for 循环中`。

如果要遍历的数组很大，而真正要展示的数据很少时，这将造成很大的性能浪费。

- 这种场景建议使用 computed，先对数据进行过滤

## v-model 是如何实现双向绑定的？

- v-model 是用来在表单控件或者组件上创建双向绑定的
- 他的本质是 v-bind 和 v-on 的语法糖
- 在一个组件上使用 v-model，默认会为组件绑定名为 value 的 prop 和名为 input 的事件

```js
<input v-model="searchText">
等价于：
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>

当用在组件上时，v-model 则会这样：// 父组件原理
 <custom-input v-model="searchText">
等价于：
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>

可以通过model选项的prop和event属性来进行自定义。
model: { prop: 'checked', event: 'change’ }

原生的v-model，会根据标签的不同生成不同的事件和属性。
* text 和 textarea 元素使用 value 属性和 input 事件；
* checkbox 和 radio 使用 checked 属性和 change 事件；
* select 字段将 value 作为 prop 并将 change 作为事件。
```

## Class 与 Style 如何动态绑定？

```
Class 与 Style 如何动态绑定？Class 可以通过对象语法和数组语法进行动态绑定：

对象语法：
<div v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>
data: {
  isActive: true,
  hasError: false
}

数组语法：
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}

Style 也可以通过对象语法和数组语法进行动态绑定：
对象语法：
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
data: {
  activeColor: 'red',
  fontSize: 30
}
数组语法：
<div v-bind:style="[styleColor, styleSize]"></div>
data: {
  styleColor: {
     color: 'red'
   },
  styleSize:{
     fontSize:'23px'
  }
}
```

## 如何让 CSS 只在当前组件中起作用?

在组件中的 style 前面加上 scoped

## v-html 会导致哪些问题（简单）

- XSS 攻击
- v-html 会替换标签内部的元素

## Vue 的普通 Slot 以及作用域 Slot 的区别?

普通插槽

- 普通插槽是渲染后做替换的工作。父组件渲染完毕后，替换子组件的内容。
- 在模板编译的时候，处理组件中的子节点和 slot 标签

作用域插槽

- 作用域插槽可以拿到子组件里面的属性。在子组件中传入属性然后渲染。

插槽

- 创建组件虚拟节点时，会将组件儿子的虚拟节点保存起来。当初始化组件时，通过插槽属性将儿子进行分类 `{a:[vnode],b[vnode]}`
- 渲染组件时会拿对应的 slot 属性的节点进行替换操作。（插槽的作用域为父组件）

作用域插槽

- 作用域插槽在解析的时候不会作为组件的孩子节点。会解析成函数，当子组件渲染时，会调用此函数进行渲染。
- 普通插槽渲染的作用域是父组件，作用域插槽的渲染作用域是当前子组件。

## Vue.use 是干什么的？

Vue.use 是用来使用插件的。我们可以在插件中扩展全局组件、指令、原型方法等。 会调用 install 方法将 Vue 的构建函数默认传入，在插件中可以使用 vue，无需依赖 vue 库

## 组件写 name 有啥好处？

- 增加 name 属性，会在 components 属性中增加组件本身，实现组件的递归调用。
- 可以表示组件的具体名称，方便调试和查找对应的组件。

## Vue2.x 组件通信有哪些方式？

```
* 父子组件通信
    * 事件机制(父->子props，子->父 $on、$emit)
    * 获取父子组件实例 $parent、$children
    * Ref 获取实例的方式调用组件的属性或者方法
    * Provide、inject (不推荐使用，组件库时很常用)
* 兄弟组件通信
    * eventBus 这种方法通过一个空的 Vue实例作为中央事件总线（事件中心），用它来触发事件和监听事件，从而实现任何组件间的通信，包括父子、隔代、兄弟组件
      Vue.prototype.$bus = new Vue
    * Vuex
* 跨级组件通信
    * Vuex
    * $attrs、$listeners
    * Provide、inject

补充1： $attrs和$listeners，都是当前作用域里，拿取属性和监听器。
$attrs：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 ( class 和 style 除外 )。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 ( class 和 style 除外 )，并且可以通过 v-bind="$attrs" 传入内部组件。通常配合 inheritAttrs 选项一起使用。
$listeners：包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件。

补充2：provide / inject 适用于 隔代组件通信
祖先组件中通过 provider 来提供变量，然后在子孙组件中通过 inject 来注入变量。
provide / inject API 主要解决了跨级组件间的通信问题，
不过它的使用场景，主要是子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系。

补充3：
$parent 父实例，如果当前实例有的话。
$children 当前实例的直接子组件。需要注意 $children 并不保证顺序，也不是响应式的。
$root 当前组件树的根 Vue 实例。如果当前实例没有父实例，此实例将会是其自己。
```

## vue 中使用了哪些设计模式？

- 单例模式：new 多次，只有一个实例
- 工场模式：传入参数就可以创建实例（虚拟节点的创建）
- 发布订阅模式：eventBus
- 观察者模式：watch 和 dep
- 代理模式：\_data 属性、proxy、防抖、节流
- 中介者模式：vuex
- 策略模式
- 外观模式

## Vue 的事件绑定原理

- 原生事件绑定是通过 addEventListener 绑定给真实元素的，
- 组件事件绑定是通过 Vue 自定义的$on 实现的。
- 如果要在组件上使用原生事件，需要加.native 修饰符，这样就相当于在父组件中把子组件当做普通 html 标签，然后加上原生事件。
- $on、$emit 是基于发布订阅模式的，维护一个事件中心，on 的时候将事件按名称存在事件中心里，称之为订阅者，然后 emit 将对应的事件进行发布，去执行事件中心里的对应的监听器

## 为什么在 HTML 中监听事件？

你可能注意到这种事件监听的方式违背了关注点分离 (separation of concern) 这个长期以来的优良传统。但不必担心，因为所有的 Vue.js 事件处理方法和表达式都严格绑定在当前视图的 ViewModel 上，它不会导致任何维护上的困难。实际上，使用 v-on 有几个好处：

1. 扫一眼 HTML 模板便能轻松定位在 JavaScript 代码里对应的方法。
2. 因为你无须在 JavaScript 里手动绑定事件，你的 ViewModel 代码可以是非常纯粹的逻辑，和 DOM 完全解耦，更易于测试。
3. 当一个 ViewModel 被销毁时，所有的事件处理器都会自动被删除。你无须担心如何清理它们。

## 什么是异步组件？

```
异步组件就是只在组件需要渲染（组件第一次显示）的时候进行加载渲染，并缓存以备下次访问。
在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。

Vue实现按需加载原理
Vue实现按需加载，官方推荐使用结合webpack的代码分割功能进行（动态引入）。定义为异步加载的组件，
在打包的时候，会打包成单独的js文件存储在static/js文件夹里面，

Vue.component(
  'async-webpack-example',
  // 这个动态导入会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)

项目中如何引入编译后的异步组件？
采用jsonp的方式进行加载。

异步组件原理
先渲染异步占位符节点 -> 组件加载完毕后调用forceUpdate强制更新。

```

## 怎样理解 Vue 的单向数据流？

数据总是从父组件传到子组件，子组件没有权利修改父组件传过来的数据，只能请求父组件对原始数据进行修改。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。

子组件想修改时，只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改。

这里有两种常见的试图变更一个 prop 的情形：

```
1. 定义一个本地的 data property 并将这个 prop 用作其初始值，作为一个本地数据来使用：
props: ['initialCounter'],
data: function () {
  return {
    counter: this.initialCounter
  }
}
2. 使用这个 prop 的值来定义一个计算属性：
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

子组件为什么不可以修改父组件传递的 Prop？

Vue 提倡单向数据流

## Vue 组件生命周期有哪些？

- beforeCreate 在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。在当前阶段 data、methods、computed 以及 watch 上的数据和方法都不能被访问
- created 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。这里没有$el,如果非要想与 Dom 进行交互，可以通过 vm.$nextTick 来访问 Dom
- beforeMount 在挂载开始之前被调用：相关的 render 函数首次被调用。
- mounted 在挂载完成后发生，在当前阶段，真实的 Dom 挂载完毕，数据完成双向绑定，可以访问到 Dom 节点
- beforeUpdate 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁（patch）之前。可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程
- updated 发生在更新完成之后，当前阶段组件 Dom 已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新，该钩子在服务器端渲染期间不被调用。
- beforeDestroy 实例销毁之前调用。在这一步，实例仍然完全可用。我们可以在这时进行善后收尾工作，比如清除计时器。
- destroyed Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。 该钩子在服务器端渲染期间不被调用。
- activated keep-alive 专属，组件被激活时调用
- deactivated keep-alive 专属，组件被销毁时调用

**异步请求在哪一步发起？**

可以在钩子函数 created、beforeMount、mounted 中进行异步请求，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。
如果异步请求不需要依赖 Dom 推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

能更快获取到服务端数据，减少页面 loading 时间；
ssr 不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；

- 可以在钩子函数 created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。
- 但是推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：
  - 更早获取到服务端数据，减少页面 loading 时间；
  - ssr 不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；

### Vue 的父子组件生命周期钩子函数执行顺序

加载渲染过程

父 beforeCreate->父 created->父 beforeMount->子 beforeCreate->子 created->子 beforeMount->子 mounted->父 mounted

子组件更新过程

父 beforeUpdate->子 beforeUpdate->子 updated->父 updated

父组件更新过程

父 beforeUpdate->父 updated

销毁过程

父 beforeDestroy->子 beforeDestroy->子 destroyed->父 destroyed

### 父子组件渲染顺序

https://www.jianshu.com/p/89209a981aa3

Vue 中组件生命周期调用顺序是什么样的？

- 渲染顺序：先父后子，完成顺序：先子后父
- 更新顺序：父更新导致子更新，子更新完成后父
- 销毁顺序：先父后子，完成顺序：先子后父

父子组件渲染过程是怎样的？

Vue 的子组件引入有两中方式：同步和异步，因此父子组件加载的顺序是不一样的。

- 1、同步引入
  - 例子： import Page from '@/components/page'
- 2、异步引入
  - 例子：const Page = () => import('@/components/page')
  - 或者： const Page = resolve => require(['@/components/page'], page)

同步引入时生命周期顺序 // 组件渲染是递归执行的

- 加载渲染过程：// 注意：所有子组件都 mounted 了，才会父组件的 mounted，这个与组件注册的执行有关
- 父组件的 beforeCreate、created、beforeMount --> 所有子组件的 beforeCreate、created、beforeMount --> 所有子组件的 mounted --> 父组件的 mounted
- 子组件更新过程：
- 父 beforeUpdate --> 子 beforeUpdate --> 子 updated --> 父 Uupdated
- 父组件更新过程：
- 父 beforeUpdate -> 父 updated
- 销毁过程：
- 父 beforeDestroy --> 子 beforeDestroy --> 子 destroyed --> 父 destroyed

**异步引入时生命周期顺序**：// 注意：父子组件都异步走自己的生命周期，不会互相干扰

- 父组件的 beforeCreate、created、beforeMount、mounted --> 子组件的 beforeCreate、created、beforeMount、mounted

同步组件注册是引入的一个对象，
异步组件注册是有很多种。

### 在什么阶段才能访问操作 DOM？

mounted 里或之后可以访问操作 dom，可使用$refs 属性对 Dom 进行操作。

1. 所以操作 dom 至少在 mounted 里。
2. 在 created 想操作 dom 需使用 vm.$nextTick( [callback] )
3. 数据更新后，要立刻操作 dom，最好使用 vm.$nextTick( [callback] )

### vue 在哪些情况下会执行生命周期中的销毁这个钩子？

```
能触发销毁周期的有：v-if、<component>、<router-link>
当然也能触发创建。
注意 v-show 指令不销毁元素而只是隐藏，故不会触发这个钩子。
```

### 在使用生命周期时有几点注意事项：

1. 第一点就是上文曾提到的 created 阶段的 ajax 请求与 mounted 请求的区别：前者页面视图未出现，如果请求信息过多，页面会长时间处于白屏状态。
2. 除了 beforeCreate 和 created 钩子之外，其他钩子均在服务器端渲染期间不被调用（ssr 客户端不触发 created）。
3. 上文曾提到过，在 updated 的时候千万不要去修改 data 里面赋值的数据，否则会导致死循环。
4. Vue 的所有生命周期函数都是自动绑定到 this 的上下文上。所以，你这里使用箭头函数的话，就会出现 this 指向的父级作用域，就会报错。原因下面源码部分会讲解。

生命周期钩子的 this 上下文指向调用它的 Vue 实例。

### 组件运行阶段的生命周期函数只有：beforeUpdate 和 updated。

beforeCreate、created、beforeMount、mounted 整个组件或实例只会调用一次。

## Vue 修饰符有哪些

事件修饰符

.stop 阻止事件继续传播
.prevent 阻止标签默认行为
.capture 使用事件捕获模式,即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理
.self 只当在 event.target 是当前元素自身时触发处理函数
.once 事件将只会触发一次
.passive 告诉浏览器你不想阻止事件的默认行为

v-model 的修饰符

.lazy 通过这个修饰符，转变为在 change 事件再同步

.number 自动将用户的输入值转化为数值类型

.trim 自动过滤用户输入的首尾空格

键盘事件的修饰符

.enter
.tab
.delete (捕获“删除”和“退格”键)
.esc
.space
.up
.down
.left
.right

系统修饰键

.ctrl
.alt
.shift
.meta

鼠标按钮修饰符

.left
.right
.middle

## 说说你对 SSR 的了解

- SSR 也就是服务端渲染，也就是将 Vue 在客户端把标签渲染成 HTML 的工作放在服务端完成，然后再把 html 直接返回给客户端
- SSR 的优势

  - 更好的 SEO
  - 首屏加载速度更快

- SSR 的缺点
  - 开发条件会受到限制，服务器端渲染只支持 beforeCreate 和 created 两个钩子
  - 当我们需要一些外部扩展库时需要特殊处理，服务端渲染应用程序也需要处于 Node.js 的运行环境
  - 更多的服务端负载

## 参考

https://juejin.cn/post/6961222829979697165
