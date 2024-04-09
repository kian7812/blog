# Vue2响应式原理概述*

*一定要去console里看真实的响应数据，一目了然，去console里打印实例vm、Watcher、Dep等上面的属性*

https://v2.cn.vuejs.org/v2/guide/reactivity.html

## 结合订阅发布模式及源码，深入下响应式原理 

*重点从源码的角度并渲染流程描述下吧，并说明每个 Observer、Watcher、Dep等作用*

Vue的响应式原理主要采用了发布订阅模式（Dep Watcher）和数据观测拦截（Observe）。

### 1.（_init -> initState -> initData -> observe）

- Vue组件初始化时会将数据对象 data，进行递归观测 observe，
- 数据观测时，如果值为数据，会对数组数据进行原型链重写 value.__proto__ = arrayMethods，指向重写的数组方法对象上，然后遍历每个数组元素再进行观测，
- 如果为对象，则遍历对象属性进行 defineReactive 响应式处理，先是每个属性都会创建一个 Dep 实例，为依赖收集做准备，然后通过 Object.defineProperty 把对象 property 全部转为 getter/setter，
- 当属性被访问时触发 getter 函数，返回属性值，同时Dep 实例做依赖收集。
- 当属性值变更时，会触发setter函数，进行属性赋值和对新值进行数据观测响应式化，同时属性的依赖会通知所有订阅者Watcher进行更新update，从而使与关联的组件重新渲染，最后更新视图。
- 注意：`数据观测时，并没触发 getter和setter`。同时 defineReactive 会缓存 new Dep 依赖实例，意思属性在运行时依赖实例时不变的等

### 2. 属性依赖Dep会添加订阅者Watcher，同时Watcher也收集接触过的属性依赖，那它俩是何时互相收集的呢？

- 当组件初始化完成后，开始准备渲染时，调用挂载组件方法 mountComponent，主要是为Vue 组件生成一个渲染Watcher实例，（`每个Vue组件都会对应一个渲染Watcher实例`）
- 补充1，生成Watcher实例时，会传入一个updateComponent方法，它主要做的是通过render函数生成虚拟dom，然后通过patch方法进行比对diff，并最小粒度的更新真实dom，改变视图。由此看出渲染Watcher是更新视图的关键。

### 3. 这里插入下 一个依赖Dep，能做哪些事情呢？

- 一个Dep实例，会有一个订阅者数组，可以添加订阅者、移除订阅者，还可以通知Watcher收集依赖，同时还有个通知方法，通知这个依赖所有订阅者进行更新。

### 4. Vue 内部维护 一个全局的 targetStack 订阅者栈（栈结构），因为Vue规定同一时间只能有一个watcher实例被计算求值。

- 同时有pushTarget和popTarget两个方法来维护订阅栈进栈和出栈，并在Dep.target属性上，配置当前的Watcher实例。

### 5. 继续聊 new Watcher(...)

- 渲染Watcher生成实例过程中，主要做了：
  - 组件渲染视图（执行传入的updateComponent方法），
  - 把渲染过程中接触过的数据对象data属性，记录为依赖，同时属性依赖也会添加这个watcher为订阅者。
- 通过watcher的get方法完成：
  - 把当前watcher推进targetStack，并赋值给Dep.target
  - 执行updateComponent，执行render函数，会访问数据对象data，就会触发对象属性的 getter，此时进行依赖收集，dep.depend->Dep.target.addDep->dep.addSub
  - updateComponent执行完，targetStack推出此watcher，重新赋值Dep.target，（同时整理此Watcher的依赖）
  - 此时组件完成了初始渲染和依赖收集。
  - 最后组件挂载完成，执行mounted生命周期钩子。

### 6. update跟新视图

- 当对象属性变更时，触发属性的setter函数，属性依赖会派发通知订阅者Watcher执行更新方法，从而使与关联的组件重新渲染。

- mountComponent方法执行开始时，会触发生命周期钩子beforeMount，结束时挂载完成调用生命周期钩子mounted。

### 补充

**补充1：Object.defineProperty(obj, key, { 描述 })**

```
Object.defineProperty( 对象, '设置什么属性名', {
  writeable
  value
  configurable
  enumerable: 控制属性是否可枚举, 是不是可以被 for-in 取出来
  set() {} 赋值触发
  get() {} 取值触发
})
```
- 1、writeable和value 与 get和set 不能同时存在
- 2、不可枚举，打印出来属性是灰色的（与_proto_一样的颜色）
- 3、Vue2中用在 defineReactive 和 proxy 方法中

**补充2：**

- 每个属性 property 都有一个对应的依赖（new Dep 缓存在 defineReactive函数里）


**补充3：**

1、Object.defineProperty()作用于对象属性，
- vue会对每个对象进行defineProperty，包括 Object和Array，不包含File对象（并不会进行defineProperty）
- 会递归遍历data选项的对象，进行defineProperty

2、所以data选项的，每个对象属性会有个 new Dep订阅器对象（通过console得知，一个对象就一个 __ob__:Observer），原始类型和File类型没有 __ob__:Observer，
- 每个属性都会有new Dep，只是基本类型看到不到。Object和Array的属性可以看到。

3、订阅器 Dep
- Dep订阅器本身是个依赖，会被作为依赖收集到 Watcher里，通过deps可以看到[Dep...]
- Dep订阅器自身会有subs属性（subscribe订阅），用来收集订阅者Watcher（当订阅者Watcher调用时属性getter时，会被收集到属性对应的订阅器里）

4、订阅者 Watcher
- 每个组件实例都对应一个 watcher 实例，会随组件实例初始化时一起init。
- deps属性，收集依赖（Dep）
- getter

5、发布订阅模式才是 vue 响应式的核心，包括observe都是为发布订阅服务的。
- 1、发布订阅的核心是Dep和Watcher。
- 2、Watcher里又是所有渲染的入口触发地点。


## 简单描述下Watcher的种类：组件渲染watcher、computed-watcher、user-watcher

### 2. 计算属性 computed-watcher （同步）

initComputed -> defineComputed -> createComputedGetter

计算属性初始化主要做了3件事：遍历计算属性：
- 为每个属性生成Watcher实例，传入 getter 和 lazy:true，最后实例vm会收集计算属性watchers
- 把每个属性 Object.defineProperty 配置 getter 和 setter 函数，重点说下计算属性的 getter 函数 createComputedGetter
- createComputedGetter 它主要是来处理与计算属性watcher们的关联的

首先，计算属性new watcher时，并没执行watcher的get，就没进行依赖收集，但是初始dirty和lazy都为true

然后，访问到计算属性时，会执行计算属性的getter函数，主要做了：计算属性watcher和当前渲染watcher依赖收集，和返回计算属性的watcher value

具体：
```js
if (watcher.dirty) { 
  watcher.evaluate()                 
}
```
- 初始 dirty 为true
- 计算属性watcher执行get，会有计算属性watcher进出targetStack，同时computed-watcher与getter里用到data属性进行依赖收集，
- 当计算属性依赖的属性值变更时，会触发计算属性的update 把 dirty 变为 true，等再次访问计算属性时，就会重新计算新值，
- 反过来讲，就是如果依赖属性值不变，重复访问计算属性时，一直是拿的计算属性watcher里的缓存value值。这就实现了计算属性的缓存。

```js
if (Dep.target) {  
  watcher.depend() 
                   
}
return watcher.value 
```
- 前面计算属性watcher出栈，此时Dep.target有可能是访问计算属性的渲染watcher，
- 此时计算属性的watcher里的依赖们，被当前的渲染watcher收集为依赖，同时依赖们会添加渲染watcher为订阅者。
- 当依赖属性值变更时，会同时触发计算属性 watcher(dirty=true)和这个渲染watcher重新渲染组件
- 返回计算属性watcher缓存值或新值

注意：计算属性computed-watcher的update是同步计算

### 3. 用户监听器 user-watch （异步）

- initWatch -> createWatcher
- 用户监听器的类型有：字符串、函数、数组、对象
- 遍历watch选项，会根据不同类型，进行createWatcher或再遍历
- 最后 vm.$watch(expOrFn, handler, options)，vm.$watch只要做了4件事：
  - 1 options.user = true // user-watcher标识
  - 2 const watcher = new Watcher(vm, expOrFn, cb, options) // 生成user watcher实例，并返回expOrFn值
  - 3 如 options.immediate = true 立即callback，并传入expOrFn值
  - 4 返回 unwatchFn 函数，用来执行watcher的卸载 watcher.teardown()

user监听器Watcher实例化过程：

- 1 watcher 的 deep和user 属性赋值
- 2 执行 watcher的get方法，进行 watcher 与 访问属性之间的依赖收集与整理和依赖订阅，如果deep=true会进行深度监听，最后返回求值给watcher的value
- 3 当依赖属性变更时，触发user-watcher的update，把user-watcher推到 queueWatcher 执行队列（目前看user-watcher也是异步的），最后执行run方法
- this.cb.call(this.vm, value, oldValue)。
- 注意：user-watcher的update同渲染watcher是异步执行的

补充1：深度监听 traverse

deep属性的意思是深度遍历，会在对象一层层往下遍历，在每一层都加上监听器。

源码：
- traverse方法递归每一个对象或者数组，触发它们的getter，使得对象或数组的每一个成员都被依赖收集，形成一个“深（deep）”依赖关系。
- 关键：触发它们的getter，通过 val[keys[i]]，与当前的user-watcher进行依赖收集订阅添加。
- 优化：遍历过程中会把子响应式对象通过它们的 dep.id 记录到 seenObjects，避免以后重复访问，递归遍历完会clear掉。

补充2：

但是使用deep属性会给每一层都加上监听器，性能开销可能就会非常大了。这样我们可以用字符串的形式来优化：直到遇到'obj.a'属性，才会给该属性设置监听函数，提高性能。
```js
watch: {
  'obj.a': {
    handler(val) {
     console.log('obj.a changed')
    },
    immediate: true
    // deep: true
  }
}
```

### vm.$watch( expOrFn, callback, [options] )

* 参数：
  * expOrFn // exp或Fn是用来传入Watcher类生成实例时，收集依赖和求值。
  * callback // 回调函数得到的参数为新值和旧值。
  * options
    * deep
    * immediate
* 返回值：unwatch

观察 Vue 实例上的一个表达式（exp）或者一个函数（fn）计算结果的变化，表达式只接受简单的键路径。对于更复杂的表达式，用一个函数取代。


## 图解 Vue 响应式原理（可选）

```js
本文将从以下两个方面进行探索：
* 从 Vue 初始化，到首次渲染生成 DOM 的流程。
* 从 Vue 数据修改，到页面更新 DOM 的流程。

Vue 初始化
我们从源头：new Vue 的地方开始分析：
// 执行 new Vue 时会依次执行以下方法
// 1. Vue.prototype._init(option)
// 2. initState(vm)
// 3. observe(vm._data)
// 4. new Observer(data)
// 5. 调用 walk 方法，遍历 data 中的每一个属性，监听数据的变化。
function walk(obj) {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i]);
  }
}

// 6. 执行 defineProperty 监听数据读取和设置。
function defineReactive(obj, key, val) {
  // 为每个属性创建 Dep（依赖搜集的容器，后文会讲）
  const dep = new Dep(); // 所有被 Vue reactive 化的属性来说都有一个 Dep 对象与之对应，
  // 绑定 get、set
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() { // 此时 getter 和 setter 函数并不会执行, 他们只是被绑定在了 data 的属性上，所以我们先不看 getter 和 setting 函数里的内容。
      const value = val;
      // 如果有 target 标识，则进行依赖搜集
      if (Dep.target) {
        dep.depend();
      }
      return value;
    },
    set(newVal) {
      val = newVal;
      // 修改数据时，通知页面重新渲染
      dep.notify();
    },
  });
}

Dep 对象用于依赖收集，它实现了一个发布订阅模式，完成了数据 Data 和渲染视图 Watcher 的订阅，我们一起来剖析一下:
class Dep {
  // 根据 ts 类型提示，我们可以得出 Dep.target 是一个 Watcher 类型。
  static target: ?Watcher;
  // subs 存放搜集到的 Watcher 对象集合
  subs: Array<Watcher>;
  constructor() {
    this.subs = [];
  }
  addSub(sub: Watcher) {
    // 搜集所有使用到这个 data 的 Watcher 对象。
    this.subs.push(sub);
  }
  depend() {
    if (Dep.target) {
      // 搜集依赖，最终会调用上面的 addSub 方法
      Dep.target.addDep(this);
    }
  }
  notify() {
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      // 调用对应的 Watcher，更新视图
      subs[i].update();
    }
  }
}

了解 Data 和 Dep 之后，我们来继续揭开 Watcher 的面纱：
class Watcher {
  constructor(vm: Component, expOrFn: string | Function) {
    // 将 vm._render 方法赋值给 getter。
    // 这里的 expOrFn 其实就是 vm._render，后文会讲到。
    this.getter = expOrFn;
    this.value = this.get();
  }
  get() {
    // 给 Dep.target 赋值为当前 Watcher 对象
    Dep.target = this;
    // this.getter 其实就是 vm._render
    // vm._render 用来生成虚拟 dom、执行 dom-diff、更新真实 dom。
    const value = this.getter.call(this.vm, this.vm);
    return value;
  }
  addDep(dep: Dep) {
    this.newDeps.push(dep) // 这里 Watcher 把这个 dep 对象存了下来
    // 将当前的 Watcher 添加到 Dep 收集池中
    dep.addSub(this);
  }
  update() {
    // 开启异步队列，批量更新 Watcher
    queueWatcher(this);
  }
  run() {
    // 组件更新时，run方法被条用
    // 和初始化一样，会调用 get 方法，更新视图
    const value = this.get();
  }
}
源码中我们看到，Watcher 实现了渲染方法 _render 和 Dep 的关联（这里就是渲染关键）， 
初始化 Watcher 的时候，打上 Dep.target 标识，然后调用 get 方法进行页面渲染。

小结响应式原理：
Vue 通过 defineProperty 完成了 Data 中所有数据的代理，
当数据触发 get 查询时，会将当前的 Watcher 对象加入到依赖收集池 Dep 中，
当数据 Data 变化时，会触发 set 通知所有使用到这个 Data 的 Watcher 对象去 update 视图。


模板渲染
其实 new Vue 执行到最后，会调用 mount 方法，将 Vue 实例渲染成 dom：// 渲染的开始都是mount方法或是$mount
// new Vue 执行流程。
// 1. Vue.prototype._init(option)
// 2. vm.$mount(vm.$options.el)
// 3. render = compileToFunctions(template) ，编译 Vue 中的 template 模板，生成 render 方法。
// 4. Vue.prototype.$mount 调用上面的 render 方法挂载 dom。

// 5. function mountComponent {
// 6. 创建 Watcher 实例
const updateComponent = () => {
  vm._update(vm._render());
};
// 结合上文，我们就能得出，updateComponent 就是传入 Watcher 内部的 getter 方法。
new Watcher(vm, updateComponent); // 每一个 Vue 实例来说都有一个 Watcher 与之对应，updateComponent是组件更新函数

// 7. new Watcher 会执行 Watcher.get 方法
// 8. Watcher.get 会执行 this.getter.call(vm, vm) ，也就是执行 updateComponent 方法
// 9. updateComponent 会执行 vm._update(vm._render())
    * vm._render 的作用，可以简单的理解为把 Vue 对象渲染成虚拟 Dom 的过程。
    * vm._update 方法，可以简单的理解为根据虚拟 Dom 去创建或更新真是 Dom 的过程。

// 10. 调用 vm._render 生成虚拟 dom
Vue.prototype._render = function (): VNode {
  const vm: Component = this;
  const { render } = vm.$options;
  let vnode = render.call(vm._renderProxy, vm.$createElement);
  return vnode;
};
// 11. 调用 vm._update(vnode) 渲染虚拟 dom
Vue.prototype._update = function (vnode: VNode) {
  const vm: Component = this;
  if (!prevVnode) {
    // 初次渲染
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false);
  } else {
    // 更新
    vm.$el = vm.__patch__(prevVnode, vnode);
  }
};
// 12. vm.__patch__ 方法就是做的 dom diff 比较，然后更新 dom，这里就不展开了。

备注：这块主要是Watcher与render建立关系初始/更新渲染都是在这里发生，
创建 Watcher 里会 updateComponent(渲染函数render) 方法，最终将 Vue 代码渲染成真实的 DOM。

好了，探索到这里，Vue 的响应式原理，已经被我们分析透彻了。


组件渲染 // 从这里可以看出组件渲染是递归执行的
render函数里如果有组件参数，那 Vue 组件又是怎么渲染的呢？

// 从模板编译开始，当发现一个自定义组件时，会执行以下函数
// 1. compileToFunctions(template)
// 2. compile(template, options);
// 3. const ast = parse(template.trim(), options)
// 4. const code = generate(ast, options)
// 5. createElement

// 6. createComponent
export function createComponent(
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // $options._base 其实就是全局 Vue 构造函数，在初始化时 initGlobalAPI 中定义的：Vue.options._base = Vue
  const baseCtor = context.$options._base;
  // Ctor 就是 Vue 组件中 <script> 标签下 export 出的对象
  if (isObject(Ctor)) {
    // 将组件中 export 出的对象，继承自 Vue，得到一个构造函数
    // 相当于 Vue.extend(YourComponent)
    Ctor = baseCtor.extend(Ctor);
  }
  const vnode = new VNode(`vue-component-${Ctor.cid}xxx`);
  return vnode;
}

// 7. 实现组件继承 Vue，并调用 Vue._init 方法，进行初始化
Vue.extend = function (extendOptions: Object): Function {
  const Super = this;
  const Sub = function VueComponent(options) {
    // 调用 Vue.prototype._init，之后的流程就和首次加载保持一致
    this._init(options);
  };
  // 原型继承，相当于：Component extends Vue
  Sub.prototype = Object.create(Super.prototype);
  Sub.prototype.constructor = Sub;
  return Sub;
};

再一个小结响应式原理：
1. 从 new Vue 开始，首先通过 get、set 监听 Data 中的数据变化，同时创建 Dep 用来搜集使用该 Data 的 Watcher。
2. 组件渲染，创建 Watcher，并将 Dep.target 标识为当前 Watcher。
3. 组件渲染时，如果使用到了 Data 中的数据，就会触发 Data 的 get 方法，然后调用 Dep.addSub 将 Watcher 搜集起来。
4. 数据更新时，会触发 Data 的 set 方法，然后调用 Dep.notify 通知所有使用到该 Data 的 Watcher 去更新 DOM。

再来个响应式总结：
1. Vue init 阶段，对所有的属性做了 reactive 化，为每一个属性绑定了 getter 函数, setter 函数以及一个 Dep 对象。
  - // reactive 化的属性和 Dep 实例是一一对应的
2. Vue 组件 mount 阶段里调用了 mountComponent 方法，此方法中为 Vue 组件创建了一个 Watcher 对象。
  - // (render) Watcher 和 Vue 组件实例是一一对应的
3. Watcher 对象创建的时候，顺带执行了 Vue 的更新函数，这触发了 Vue reactive 化的属性 的 get 方法, 并调用了 dep.depend()。
4. Vue reactive 化的属性方法setter执行的时候, 页面会得到刷新, 即和这个属性相关的 Vue 组件的更新函数会被调用。

* defineReactive: 此时 getter 和 setter 函数并不会执行, 
  - 他们只是被绑定在了 data 的属性上，所以我们先不看 getter 和 setting 函数里的内容。
* vm._render 的作用，可以简单的理解为把 Vue 对象渲染成虚拟 Dom 的过程。
* vm._update 方法，可以简单的理解为根据虚拟 Dom 去创建或更新真是 Dom 的过程。
* 当然 Watcher 有多种，我们只讨论是渲染 Watcher, 也只列举了我们涉及的几个属性。
```