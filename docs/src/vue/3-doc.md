# 文档

✅ 每次复习都要以官方文档为准，每次会有新收获。复习时要对下面抽离内容重新核对。

- https://cn.vuejs.org/guide/introduction.html
- https://cn.vuejs.org/api/application.html

## API 风格-该选哪一个？

选项式 API 以“组件实例”的概念为中心 (即上述例子中的 this)，对于有面向对象语言背景的用户来说，这通常与基于类的心智模型更为一致。同时，它将响应性相关的细节抽象出来，并强制按照选项来组织代码，从而对初学者而言更为友好。

组合式 API 的核心思想是直接在函数作用域内定义响应式状态变量，并将从多个函数中得到的状态组合起来处理复杂问题。这种形式更加自由，也需要你对 Vue 的响应式系统有更深的理解才能高效使用。相应的，它的灵活性也使得组织和重用逻辑的模式变得更加强大。

## 模版语法

### Attribute 绑定

- 如果绑定的值是 null 或者 undefined，那么该 attribute 将会从渲染的元素上移除。（移除别与默认属性值弄混）
- 布尔型 Attribute，当 isButtonDisabled 为真值或一个空字符串 (即 `<button disabled=""`>) 时，元素会包含这个 disabled attribute。而当其为其他假值时 attribute 将被忽略。（忽略别与默认属性值弄混，正常使用就行）

### 使用 JavaScript 表达式

**调用函数**，绑定在表达式中的方法在组件每次更新时都会被重新调用，因此不应该产生任何副作用，比如改变数据或触发异步操作。

```vue
<time :title="toTitleDate(date)" :datetime="date">
  {{ formatDate(date) }}
</time>
```

## 响应式基础

### 声明响应式状态

✅ 在组合式 API 中，推荐使用 ref() 函数来声明响应式状态。

✅reactive() 的局限性：

- 有限的值类型；
- 不能替换整个对象；
- 对解构操作不友好；
- 由于这些限制，我们建议使用 ref() 作为声明响应式状态的主要 API。

### DOM 更新时机 ​

当你修改了响应式状态时，DOM 会被自动更新。但是需要注意的是，DOM 更新不是同步的。Vue 会在“next tick”更新周期中缓冲所有状态的修改，以确保不管你进行了多少次状态修改，每个组件都只会被更新一次。要等待 DOM 更新完成后再执行额外的代码，可以使用 nextTick() 全局 API。

## 计算属性

### 计算属性 vs 方法

- 方在组件每次更新时都会被重新调用，因此不应该产生任何副作用，比如改变数据或触发异步操作。
- 计算属性值会基于其响应式依赖被缓存。一个计算属性仅会在其响应式依赖更新时才重新计算。
- 相比之下，方法调用总是会在重渲染发生时再次执行函数。

## 类与样式绑定

如果你的组件有多个根元素，你将需要指定哪个根元素来接收这个 class。你可以通过组件的 $attrs 属性来指定接收的元素：

```vue
<!-- MyComponent 模板使用 $attrs 时 -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

## 条件渲染

v-if vs v-show​

- v-if 是“真实的”按条件渲染，因为它确保了在切换时，条件区块内的事件监听器和子组件都会被销毁与重建。
- v-if 也是惰性的：如果在初次渲染时条件值为 false，则不会做任何事。条件区块只有当条件首次变为 true 时才被渲染。
- 相比之下，v-show 简单许多，元素无论初始条件如何，始终会被渲染，只有 CSS display 属性会被切换。
- 总的来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要频繁切换，则使用 v-show 较好；如果在运行时绑定条件很少改变，则 v-if 会更合适。

## 列表渲染

- 在 v-for 块中可以完整地访问父作用域内的属性和变量。
- 在定义 v-for 的变量别名时使用解构，和解构函数参数类似。
- 对于多层嵌套的 v-for，作用域的工作方式和函数的作用域很类似。每个 v-for 作用域都可以访问到父级作用域。

### v-for 与 v-if

当它们同时存在于一个节点上时，v-if 比 v-for 的优先级更高。这意味着 v-if 的条件将无法访问到 v-for 作用域内定义的变量别名：

```vue
<!--
 这会抛出一个错误，因为属性 todo 此时
 没有在该实例上定义
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>

<!-- 在外先包装一层 <template> 再在其上使用 v-for 可以解决这个问题 (这也更加明显易读)： -->
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

### 通过 key 管理状态

- Vue 默认按照“就地更新”的策略来更新通过 v-for 渲染的元素列表。当数据项的顺序改变时，Vue 不会随之移动 DOM 元素的顺序，而是就地更新每个元素，确保它们在原本指定的索引位置上渲染。
- 默认模式是高效的。
- 为了给 Vue 一个提示，以便它可以跟踪每个节点的标识，从而重用和重新排序现有的元素，你需要为每个元素对应的块提供一个唯一的 key attribute。

### 数组变化侦测

- push()
- pop()
- shift()
- unshift()
- splice()
- sort()
- reverse()

其它 filter()，concat() 和 slice() 通过替换原数组来触发更新

## 事件处理

### 在内联事件处理器中访问事件参数

有时我们需要在内联事件处理器中访问原生 DOM 事件。你可以向该处理器方法传入一个特殊的 $event 变量，或者使用内联箭头函数：

```js
<!-- 使用特殊的 $event 变量 -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- 使用内联箭头函数 -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>

function warn(message, event) {
  // 这里可以访问原生事件
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

## 表单输入绑定

### input 上 v-model

```js
<input v-model="text">

<input
  :value="text"
  @input="event => text = event.target.value">
```

## 生命周期

每个 Vue 组件实例在创建时都需要经历一系列的初始化步骤，比如设置好数据侦听，编译模板，挂载实例到 DOM，以及在数据改变时更新 DOM。在此过程中，它也会运行被称为生命周期钩子的函数，让开发者有机会在特定阶段运行自己的代码。

### 注册周期钩子

当调用 onMounted 时，Vue 会自动将回调函数注册到当前正被初始化的组件实例上。这意味着这些钩子应当在组件初始化时被同步注册。例如，请不要这样做：

```js
setTimeout(() => {
  onMounted(() => {
    // 异步注册时当前组件实例已丢失
    // 这将不会正常工作
  });
}, 100);
```

注意这并不意味着对 onMounted 的调用必须放在 setup() 或 `<script setup>` 内的词法上下文中。onMounted() 也可以在一个外部函数中调用，只要调用栈是同步的，且最终起源自 setup() 就可以。✅

## 侦听器

### watch vs. watchEffect​

- watch 和 watchEffect 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：
- watch 只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。另外，仅在数据源确实改变时才会触发回调。watch 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。
- watchEffect，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

### 停止侦听器

在 setup() 或 `<script setup>` 中用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止。因此，在大多数情况下，你无需关心怎么停止一个侦听器。

一个关键点是，侦听器必须用同步语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。如下方这个例子：

```vue
<script setup>
import { watchEffect } from "vue";

// 它会自动停止
watchEffect(() => {});

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {});
}, 100);
</script>
```

要手动停止一个侦听器，请调用 watch 或 watchEffect 返回的函数：

```js
const unwatch = watchEffect(() => {});

// ...当该侦听器不再需要时
unwatch();
```

## 模板引用

useTemplateRef() 3.5+

### v-for 中的模板引用

当在 v-for 中使用模板引用时，对应的 ref 中包含的值是一个数组，它将在元素被挂载后包含对应整个列表的所有元素。应该注意的是，ref 数组并不保证与源数组相同的顺序。

### 组件上的 ref

- 如果一个子组件使用的是选项式 API 或没有使用 `<script setup>`，被引用的组件实例和该子组件的 this 完全一致，这意味着父组件对子组件的每一个属性和方法都有完全的访问权。
- 使用了 `<script setup>` 的组件是默认私有的：一个父组件无法访问到一个使用了 `<script setup>` 的子组件中的任何东西，除非子组件在其中通过 defineExpose 宏显式暴露。

### 动态组件

:is 的值可以是以下几种：

- 被注册的组件名
- 导入的组件对象

## 组件注册

## 组件 Props

### 响应式 Props 解构 3.5+ ✅

```js
const { foo } = defineProps(["foo"]);

watchEffect(() => {
  // 在 3.5 之前只运行一次
  // 在 3.5+ 中在 "foo" prop 变化时重新执行
  console.log(foo);
});
```

在 3.4 及以下版本，foo 是一个实际的常量，永远不会改变。在 3.5 及以上版本，当在同一个 `<script setup>` 代码块中访问由 defineProps 解构的变量时，Vue 编译器会自动在前面添加 props.。因此，上面的代码等同于以下代码：

```js
const props = defineProps(["foo"]);

watchEffect(() => {
  // `foo` 由编译器转换为 `props.foo`
  console.log(props.foo);
});
```

此外，你可以使用 JavaScript 原生的默认值语法声明 props 默认值。这在使用基于类型的 props 声明时特别有用。

```js
const { foo = 'hello' } = defineProps<{ foo?: string }>()
```

与使用 watch(() => props.foo, ...) 来侦听普通 prop 类似，我们也可以通过将其包装在 getter 中来侦听解构的 prop：

```js
watch(() => foo /* ... */);
```

### Prop 名字格式

`<MyComponent greeting-message="hello" />`

- 然理论上你也可以在向子组件传递 props 时使用 camelCase 形式 (使用 DOM 内模板时例外)，但实际上为了和 HTML attribute 对齐，我们通常会将其写为 kebab-case 形式。✅
- 对于组件名我们推荐使用 PascalCase✅，因为这提高了模板的可读性，能帮助我们区分 Vue 组件和原生 HTML 元素。然而对于传递 props 来说，使用 camelCase 并没有太多优势，因此我们推荐更贴近 HTML 的书写风格。

### 单向数据流

所有的 props 都遵循着单向绑定原则，props 因父组件的更新而变化，自然地将新的状态向下流往子组件，而不会逆向传递。这避免了子组件意外修改父组件的状态的情况，不然应用的数据流将很容易变得混乱而难以理解。✅

另外，每次父组件更新后，所有的子组件中的 props 都会被更新到最新值，这意味着你不应该在子组件中去更改一个 prop。若你这么做了，Vue 会在控制台上向你抛出警告。

导致你想要更改一个 prop 的需求通常来源于以下两种场景：

1. prop 被用于传入初始值；而子组件想在之后将其作为一个局部数据属性。在这种情况下，最好是新定义一个局部数据属性，从 props 上获取初始值即可：

```js
const props = defineProps(["initialCounter"]);

// 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const counter = ref(props.initialCounter); // ✅
```

2. 需要对传入的 prop 值做进一步的转换。在这种情况中，最好是基于该 prop 值定义一个计算属性：

```js
const props = defineProps(["size"]);

// 该 prop 变更时计算属性也会自动更新
const normalizedSize = computed(() => props.size.trim().toLowerCase());
```

**更改对象 / 数组类型的 props​**

当对象或数组作为 props 被传入时，虽然子组件无法更改 props 绑定，但仍然可以更改对象或数组内部的值。这是因为 JavaScript 的对象和数组是按引用传递，对 Vue 来说，阻止这种更改需要付出的代价异常昂贵。✅

这种更改的主要缺陷是它允许了子组件以某种不明显的方式影响父组件的状态，可能会使数据流在将来变得更难以理解。在最佳实践中，你应该尽可能避免这样的更改，除非父子组件在设计上本来就需要紧密耦合。在大多数场景下，子组件应该抛出一个事件来通知父组件做出改变。

### Prop 校验

**一些补充细节：**

- 所有 prop 默认都是可选的，除非声明了 required: true。
- 除 Boolean 外的未传递的可选 prop 将会有一个默认值 undefined。
- Boolean 类型的未传递 prop 将被转换为 false。这可以通过为它设置 default 来更改——例如：设置为 default: undefined 将与非布尔类型的 prop 的行为保持一致。
- 如果声明了 default 值，那么在 prop 的值被解析为 undefined 时，无论 prop 是未被传递还是显式指明的 undefined，都会改为 default 值。✅

**可为 null 的类型：**

如果该类型是必传但可为 null 的，你可以用一个包含 null 的数组语法：

```js
defineProps({
  id: {
    type: [String, null],
    required: true,
  },
});
```

注意如果 type 仅为 null 而非使用数组语法，**它将允许任何类型**。

## 组件事件

像组件与 prop 一样，事件的名字也提供了自动的格式转换。注意这里我们触发了一个以 camelCase 形式命名的事件，但在父组件中可以使用 kebab-case 形式来监听。与 prop 大小写格式一样，在模板中我们也推荐使用 kebab-case 形式来编写监听器。✅

## 组件 v-model

- 在组件上使用以实现双向绑定，推荐的实现方式是使用 defineModel() 宏（确实很方便看文档吧 ✅）
- 多个 v-model 绑定（看文档吧 ✅）
- v-model 支持自定义的修饰符

## 透传 Attributes

- 对 class 和 style 的合并
- v-on 监听器继承，这个监听器和从父组件继承的监听器都会被触发（看文档）
- $attrs 对象包含了除组件所声明的 props 和 emits 之外的所有其他 attribute，例如 class，style，v-on 监听器等等 ✅
- 改变透传属性到非根元素上，通过设定 inheritAttrs: false 和使用 v-bind="$attrs" 来实现 ✅
- 多个根节点的组件没有自动 attribute 透传行为，如果 $attrs 没有被显式绑定，将会抛出一个运行时警告。
- 在 `<script setup>` 中使用 useAttrs() API 来访问一个组件的所有透传 attribute
- 需要注意的是，虽然这里的 attrs 对象总是反映为最新的透传 attribute，但它并不是响应式的 (考虑到性能因素)。你不能通过侦听器去监听它的变化。如果你需要响应性，可以使用 prop。或者你也可以使用 onUpdated() 使得在每次更新时结合最新的 attrs 执行副作用。

## 插槽 Slots

- `<slot>` 元素是一个插槽出口 (slot outlet)，标示了父元素提供的插槽内容 (slot content) 将在哪里被渲染。
- 插槽内容可以访问到父组件的数据作用域，因为插槽内容本身是在父组件模板中定义的。
- 具名插槽
- 条件插槽，可以结合使用 $slots 属性与 v-if 来实现

```vue
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>

    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

- 动态插槽名
- 作用域插槽
- 具名作用域插槽
- 无渲染组件，一些组件可能只包括了逻辑而不需要自己渲染内容，视图输出通过作用域插槽全权交给了消费者组件。我们将这种类型的组件称为无渲染组件。虽然这个模式很有趣，但大部分能用无渲染组件实现的功能都可以通过组合式 API 以另一种更高效的方式实现，并且还不会带来额外组件嵌套的开销。✅

## 依赖注入

- Provide (提供)
- Inject (注入)，如果提供的值是一个 ref，注入进来的会是该 ref 对象，而不会自动解包为其内部的值。这使得注入方组件能够通过 ref 对象保持了和供给方的响应性链接。
- 和响应式数据配合使用，当提供 / 注入响应式的数据时，建议尽可能将任何对响应式状态的变更都保持在供给方组件中。这样可以确保所提供状态的声明和变更操作都内聚在同一个组件内，使其更容易维护。✅

## 异步组件

ES 模块动态导入也会返回一个 Promise，所以多数情况下我们会将它和 defineAsyncComponent 搭配使用。类似 Vite 和 Webpack 这样的构建工具也支持此语法 (并且会将它们作为打包时的代码分割点)

## 组合式函数

- 在 Vue 应用的概念中，“组合式函数”(Composables) 是一个利用 Vue 的组合式 API 来封装和复用有状态逻辑的函数。
- 组合式函数约定用驼峰命名法命名，并以“use”作为开头。
- 如果你的组合式函数在输入参数是 ref 或 getter 的情况下创建了响应式 effect，为了让它能够被正确追踪，请确保要么使用 watch() 显式地监视 ref 或 getter，要么在 watchEffect() 中调用 toValue()。
- 返回值
- 使用限制，组合式函数只能在 `<script setup>` 或 setup() 钩子中被调用。在这些上下文中，它们也只能被同步调用。✅ 这些限制很重要，因为这些是 Vue 用于确定当前活跃的组件实例的上下文。访问活跃的组件实例很有必要，这样才能：
  - 将生命周期钩子注册到该组件实例上；
  - 将计算属性和监听器注册到该组件实例上，以便在该组件被卸载时停止监听，避免内存泄漏。
- 通过抽取组合式函数改善代码结构，组合式 API 会给予你足够的灵活性，让你可以基于逻辑问题将组件代码拆分成更小的函数 ✅
- 和无渲染组件的对比，组合式函数相对于无渲染组件的主要优势是：组合式函数不会产生额外的组件实例开销。当在整个应用中使用时，由无渲染组件产生的额外组件实例会带来无法忽视的性能开销。我们推荐在纯逻辑复用时使用组合式函数，在需要同时复用逻辑和视图布局时使用无渲染组件。
- 和 Mixin 的对比：不清晰的数据来源、命名空间冲突、隐式的跨 mixin 交流

### 注册周期钩子

注意这并不意味着对 onMounted 的调用必须放在 setup() 或 `<script setup>` 内的词法上下文中。onMounted() 也可以在一个外部函数中调用，只要调用栈是同步的，且最终起源自 setup() 就可以。 ✅ https://cn.vuejs.org/guide/essentials/lifecycle

### 组合式函数 (composable)

https://cn.vuejs.org/glossary/#composable

- 组合式函数是一个函数。
- 组合式函数用于封装和重用有状态的逻辑。
- 函数名通常以 use 开头，以便让其他开发者知道它是一个组合式函数。
- 函数通常在组件的 setup() 函数 (或等效的 `<script setup>` 块) 的同步执行期间调用。这将组合式函数的调用与当前组件的上下文绑定，例如通过调用 provide()、inject() 或 onMounted()。
- 通常来说，组合式函数返回的是一个普通对象，而不是一个响应式对象。这个对象通常包含 ref 和函数，并且预期在调用它的代码中进行解构。

### 组合式 API：setup()

https://cn.vuejs.org/api/composition-api-setup.html

### `<script setup>`

https://cn.vuejs.org/api/sfc-script-setup.html

- 基本语法
  - 里面的代码会被编译成组件 setup() 函数的内容。与普通的 `<script>` 只在组件被首次引入的时候执行一次不同，`<script setup>` 中的代码会在每次组件实例被创建的时候执行。
  - 顶层的绑定会被暴露给模板（最外层）
- 使用组件
  - 递归组件，如果有具名的导入和组件自身推导的名字冲突了，可以为导入的组件添加别名：`import { FooBar as FooBarChild } from './components'`
  - 命名空间组件，`import * as Form from './form-components'`（看文档）
- 使用自定义指令
  - 不需要显式注册，但他们必须遵循 vNameOfDirective 这样的命名规范
- defineProps() 和 defineEmits() 只能在 `<script setup>` 中使用的编译器宏
  - 响应式 Props 解构 3.5+，Vue 的编译器会自动在前面添加 props.
  - 使用 JavaScript 原生的默认值语法声明 props 的默认值
- defineModel()
- defineExpose()
- defineOptions()
- defineSlots() 它还返回 slots 对象，该对象等同于在 setup 上下文中暴露或由 useSlots() 返回的 slots 对象。
- useSlots() 和 useAttrs()
  - 在 `<script setup>` 使用 slots 和 attrs 的情况应该是相对来说较为罕见的，因为可以在模板中直接通过 $slots 和 $attrs 来访问它们。
- 顶层 await，会被编译成 async setup()。async setup() 必须与 Suspense 组合使用，该特性目前仍处于实验阶段。

## 自定义指令

- 自定义指令主要是为了重用涉及普通元素的底层 DOM 访问的逻辑。
- 一个自定义指令由一个包含类似组件生命周期钩子的对象来定义。（看文档）
- 在 `<script setup>` 中，任何以 v 开头的驼峰式命名的变量都可以被用作一个自定义指令。
- 钩子参数（看文档）
- 简化形式，仅仅需要在 mounted 和 updated 上实现相同的行为，可以直接用一个函数来定义指令。

## 插件

- 插件 (Plugins) 是一种能为 Vue 添加全局功能的工具代码
- 一个插件可以是一个拥有 install() 方法的对象
- 安装函数会接收到安装它的应用实例和传递给 app.use() 的额外选项作为参数
- 插件没有严格定义的使用范围，但是插件发挥作用的常见场景主要包括以下几种：
  - 通过 app.component() 和 app.directive() 注册一到多个全局组件或自定义指令。
  - 通过 app.provide() 使一个资源可被注入进整个应用。
  - 向 app.config.globalProperties 中添加一些全局实例属性或方法
  - 一个可能上述三种都包含了的功能库 (例如 vue-router)。
- 编写一个插件，一个简单的 i18n 插件（看文档）

## Transition

（看文档）

## KeepAlive

`<KeepAlive>` 是一个内置组件，它的功能是在多个组件间动态切换时缓存被移除的组件实例。

- 包含/排除
- 最大缓存实例数，通过传入 max prop 来限制可被缓存的最大组件实例数。`<KeepAlive>` 的行为在指定了 max 后类似一个 LRU 缓存：如果缓存的实例数量即将超过指定的那个最大数量，则最久没有被访问的缓存实例将被销毁，以便为新的实例腾出空间。
- 缓存实例的生命周期

## Teleport

- `<Teleport>` 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。
- `<Teleport>` 只改变了渲染的 DOM 结构，它不会影响组件间的逻辑关系。也就是说，如果 `<Teleport>` 包含了一个组件，那么该组件始终和这个使用了 `<teleport>` 的组件保持逻辑上的父子关系。传入的 props 和触发的事件也会照常工作。
- 这也意味着来自父组件的注入也会按预期工作，子组件将在 Vue Devtools 中嵌套在父级组件下面，而不是放在实际内容移动到的地方。

## Suspense

`<Suspense>` 是一个内置组件，用来处理组件异步渲染时的状态，**重点是能获得他们的状态**。

- 有两个插槽：#default 和 #fallback。
- 有三个事件：pending、resolve 和 fallback。
- 可以等待的异步依赖有两种：
  - 带有异步 setup() 钩子的组件。这也包含了使用 `<script setup>` 时有顶层 await 表达式的组件。
  - 异步组件。

## 单文件组件

- Vue 的单文件组件 (即 \*.vue 文件，英文 Single-File Component，简称 SFC)
- Vue SFC 是一个框架指定的文件格式，因此必须交由 @vue/compiler-sfc 编译为标准的 JavaScript 和 CSS，一个编译后的 SFC 是一个标准的 JavaScript(ES) 模块

## 路由

单页应用中，“路由”是在客户端执行的。一个客户端路由器的职责就是利用诸如 History API 或是 hashchange 事件这样的浏览器 API 来管理应用当前应该渲染的视图。

从头开始实现一个简单的路由：

```vue
<script setup>
import { ref, computed } from "vue";
import Home from "./Home.vue";
import About from "./About.vue";
import NotFound from "./NotFound.vue";
const routes = {
  "/": Home,
  "/about": About,
};
const currentPath = ref(window.location.hash);
window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});
const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"] || NotFound;
});
</script>
<template>
  <a href="#/">Home</a> | <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>
```

## 状态管理

它是一个独立的单元，由以下几个部分组成：

- 状态：驱动整个应用的数据源；
- 视图：对状态的一种声明式映射；
- 交互：状态根据用户在视图中的输入而作出相应变更的可能方式。

“单向数据流”这一概念的简单图示（文档）

**全局状态和局部状态**，非常好的解释：

```js
import { ref } from "vue";

// 全局状态，创建在模块作用域下
const globalCount = ref(1);

export function useCount() {
  // 局部状态，每个组件都会创建
  const localCount = ref(1);

  return {
    globalCount,
    localCount,
  };
}
```

## 服务端渲染 (SSR)

- Vue 也支持将组件在服务端直接渲染成 HTML 字符串，作为服务端响应返回给浏览器，最后在浏览器端*将静态的 HTML“激活”(hydrate) *为能够交互的客户端应用。
- 也可以使用 Node.js Stream API 或者 Web Streams API 来执行流式渲染。
- 组件生命周期钩子，你应该避免在 setup() 或者 `<script setup>` 的根作用域中使用会产生副作用且需要被清理的代码。这类副作用的常见例子是使用 setInterval 设置定时器。
- 激活不匹配

## 性能优化

首先，让我们区分一下 web 应用性能的两个主要方面：

- 页面加载性能：首次访问时，应用展示出内容与达到可交互状态的速度。这通常会用 Google 所定义的一系列 Web 指标 (Web Vitals) 来进行衡量，如最大内容绘制 (Largest Contentful Paint，缩写为 LCP) 和首次输入延迟 (First Input Delay，缩写为 FID)。
- 更新性能：应用响应用户输入更新的速度。比如当用户在搜索框中输入时结果列表的更新速度，或者用户在一个单页面应用 (SPA) 中点击链接跳转页面时的切换速度。

### 分析选项:

为了提高性能，我们首先需要知道如何衡量它。在这方面，有一些很棒的工具可以提供帮助：

用于生产部署的负载性能分析：

- PageSpeed Insights
- WebPageTest

用于本地开发期间的性能分析：

- Chrome 开发者工具“性能”面板
  - app.config.performance 将会开启 Vue 特有的性能标记，标记在 Chrome 开发者工具的性能时间线上。
- Vue 开发者扩展也提供了性能分析的功能。

### 页面加载优化

- 包体积与 Tree-shaking 优化
- 代码分割-懒加载

### 更新优化

- 计算属性稳定性

### 通用优化

- 减少大型不可变数据的响应性开销，通过使用 shallowRef() 和 shallowReactive() 来绕开深度响应。

## 无障碍访问

## 安全

Vue 自身的安全机制：

- HTML 内容，无论是使用模板还是渲染函数，内容都是自动转义的。
- Attribute 绑定，同样地，动态 attribute 的绑定也会被自动转义。

潜在的危险

- 注入 HTML
- URL 注入
- 样式注入

## 组合式 API 常见问答

### 更灵活的代码组织

用组合式 API 重构这个组件，将会变成下面右边这样 ✅（这种代码组织方式很有意思，或许是不错的最佳实践）现在与同一个逻辑关注点相关的代码被归为了一组。
https://github.com/vuejs-translations/docs-zh-cn/blob/main/assets/FileExplorer.vue

备注：组合 api 只要保持在`<script setup>`同步执行一次就行，组合 api 可放在条件里、函数里、函数逻辑组里。✅

### 深入响应式系统

`WeakMap<target, Map<key, Set<effect>>>`

## 渲染机制

### 模板 vs. 渲染函数

那么为什么 Vue 默认推荐使用模板呢？有以下几点原因：

- 模板更贴近实际的 HTML。
- 由于其确定的语法，更容易对模板做静态分析。这使得 Vue 的模板编译器能够应用许多编译时优化来提升虚拟 DOM 的性能表现 ✅
- 在实践中，模板对大多数的应用场景都是够用且高效的。渲染函数一般只会在需要处理高度动态渲染逻辑的可重用组件中使用。

### 带编译时信息的虚拟 DOM（编译时优化）

- 静态提升 ✅
  - foo 和 bar 这两个 div 是完全静态的，没有必要在重新渲染时再次创建和比对它们。Vue 编译器自动地会提升这部分 vnode 创建函数到这个模板的渲染函数之外，并在每次渲染时都使用这份相同的 vnode，渲染器知道新旧 vnode 在这部分是完全相同的，所以会完全跳过对它们的差异比对。
  - 此外，当有足够多连续的静态元素时，它们还会再被压缩为一个“静态 vnode”
- 更新类型标记(patch flag)✅
- 树结构打平 ✅
  - 当这个组件需要重渲染时，只需要遍历这个打平的树而非整棵树。这也就是我们所说的树结构打平，这大大减少了我们在虚拟 DOM 协调时需要遍历的节点数量。模板中任何的静态部分都会被高效地略过。
- 对 SSR 激活的影响，更新类型标记和树结构打平都大大提升了 Vue SSR 激活的性能表现

## 渲染函数 & JSX

在绝大多数情况下，Vue 推荐使用模板语法来创建应用。然而在某些使用场景下，我们真的需要用到 JavaScript 完全的编程能力。这时渲染函数就派上用场了。

- 创建 Vnodes
  - Vue 提供了一个 h() 函数用于创建 vnodes，一个更准确的名称应该是 createVnode()

## 动画技巧

- 基于 CSS class 的动画
- 状态驱动的动画
- 基于侦听器的动画，示例：gsap
