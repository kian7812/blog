# Vue进阶问题


## 请说明nextTick的原理。
nextTick是一个微任务。

nextTick中的回调是在下次Dom更新循环结束之后执行的延迟回调
可以用于获取更新后的Dom
Vue中的数据更新是异步的，使用nextTick可以保证用户定义的逻辑在更新之后执行

## computed和watch的区别是什么？

computed和watch都基于watcher来实现的。
computed的属性是具备缓存的，依赖的值不发生变化，对其取值时计算属性方法不会重复执行
watch是监控值的变化，当值发生改变的时候，会调用回调函数

## computed和watch的区别是什么？
* computed和watch都基于watcher来实现的。
* computed的属性是具备缓存的，依赖的值不发生变化，对其取值时计算属性方法不会重复执行
* watch是监控值的变化，当值发生改变的时候，会调用回调函数

computed：默认computed也是一个watcher具备缓存，只有当依赖的数据变化时才会计算, 当数据没有变化时, 它会读取缓存数据。如果一个数据依赖于其他数据，使用 computed
watch：每次都需要执行函数。 watch 更适用于数据变化时的异步操作。如果需要在某个数据变化时做一些事情，使用watch。
method：只要把方法用到模板上了,每次一变化就会重新渲染视图，性能开销大


FinGet|我想用大白话讲清楚watch和computed：https://segmentfault.com/a/1190000039161403
创宇前端|做面试的不倒翁：浅谈 Vue 中 computed 实现原理 https://segmentfault.com/a/1190000016387717

// 有个大概的了解了，稍微再细化下，可以用到面试了；
// 理解这块对理解源码，有很大帮助，看来是还是面试为导向的推动学习，还是挺靠谱的。


Watcher分为：渲染Watcher、用户Watcher、computedWatcher，即computed、watch、组件渲染都是通过Watcher完成的。

watcher：侦听器、观察者
dep：订阅器、依赖收集(观察者|侦听器)





## Vue2.0 响应式数据的原理
整体思路是数据劫持+观察者模式
对象内部通过 defineReactive 方法，使用 Object.defineProperty 将属性进行劫持（只会劫持已经存在的属性），数组则是通过重写数组方法来实现。当页面使用对应属性时，每个属性都拥有自己的 dep 属性，存放他所依赖的 watcher（依赖收集），当属性变化后会通知自己对应的 watcher 去更新(派发更新)。
相关代码如下

```js
class Observer {
  // 观测值
  constructor(value) {
    this.walk(value);
  }
  walk(data) {
    // 对象上的所有属性依次进行观测
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = data[key];
      defineReactive(data, key, value);
    }
  }
}
// Object.defineProperty数据劫持核心 兼容性在ie9以及以上
function defineReactive(data, key, value) {
  observe(value); // 递归关键
  // --如果value还是一个对象会继续走一遍odefineReactive 层层遍历一直到value不是对象才停止
  //   思考？如果Vue数据嵌套层级过深 >>性能会受影响
  Object.defineProperty(data, key, {
    get() {
      console.log("获取值");

      //需要做依赖收集过程 这里代码没写出来
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      console.log("设置值");
      //需要做派发更新过程 这里代码没写出来
      value = newValue;
    },
  });
}
export function observe(value) {
  // 如果传过来的是对象或者数组 进行属性劫持
  if (
    Object.prototype.toString.call(value) === "[object Object]" ||
    Array.isArray(value)
  ) {
    return new Observer(value);
  }
}
```
## Vue中如何检测数组的变化？
vue中对数组没有进行defineProperty，而是重写了数组的7个方法。
分别是：

push
shift
pop
splice
unshift
sort
reverse

因为这些方法都会改变数组本身。
数组里的索引和长度是无法被监控的。



## Vue 如何检测数组变化

数组考虑性能原因没有用 defineProperty 对数组的每一项进行拦截，而是选择对 7 种数组（push,shift,pop,splice,unshift,sort,reverse）方法进行重写(AOP 切片思想)

所以在 Vue 中修改数组的索引和长度是无法监控到的。需要通过以上 7 种变异方法修改数组才会触发数组对应的 watcher 进行更新

相关代码如下

```js
// src/obserber/array.js
// 先保留数组原型
const arrayProto = Array.prototype;
// 然后将arrayMethods继承自数组原型
// 这里是面向切片编程思想（AOP）--不破坏封装的前提下，动态的扩展功能
export const arrayMethods = Object.create(arrayProto);
let methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reverse",
  "sort",
];
methodsToPatch.forEach((method) => {
  arrayMethods[method] = function (...args) {
    //   这里保留原型方法的执行结果
    const result = arrayProto[method].apply(this, args);
    // 这句话是关键
    // this代表的就是数据本身 比如数据是{a:[1,2,3]} 那么我们使用a.push(4)  
    // this就是a  ob就是a.__ob__ 这个属性就是上段代码增加的 代表的是该数据已经被响应式观察过了指向Observer实例
    const ob = this.__ob__;

    // 这里的标志就是代表数组有新增操作
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
      default:
        break;
    }
    // 如果有新增的元素 inserted是一个数组 调用Observer实例的observeArray对数组每一项进行观测
    if (inserted) ob.observeArray(inserted);
    // 之后咱们还可以在这里检测到数组改变了之后从而触发视图更新的操作--后续源码会揭晓
    return result;
  };
});
```

~ vue2.x中如何监测数组变化？（好描述）
* 使用了函数劫持的方式，重写了数组的方法，Vue将data中的数组进行了原型链重写，指向了自己定义的数组原型方法，当调用数组api时，可以通知依赖更新。
* 如果数组中包含着引用类型，会对数组中的引用类型再次递归遍历进行监控。这样就实现了监测数组变化。

$ 数组方法如何触发响应式更新？
数组自身变更：push() pop() shift() unshift() splice() sort() reverse()
数组重新赋值：filter() concat() slice()

$ 数组自身变更的方法触发响应式更新的底层原理是什么？
Vue内部使用函数劫持方式，对数组方法进行了拦截，重写了数组方法（push、pop、shift、unshift、splice、sort、reverse）
当 Vue 对 data 选项数据进行数据观测时，会对数组数据进行原型链重写 value.__proto__ = arrayMethods，指向重写的数组方法对象上
当 data 数组调用数组方法时，可以通知依赖更新，如有新增数组元素的也会进行递归数据观测。
这样就实现了监测数组变化并进行响应式更新。
具体数组方法重写作了：
1 执行原始数组方法
2 对新增（push、unshift、splice）数组元素，进行观测
3 dep 依赖触发 notify 通知，进行响应式更新
4 返回原始执行结果

Vue内部使用函数劫持方式，对数组方法进行了拦截，重写了数组方法（push、pop、shift、unshift、splice、sort、reverse）
```js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```
0 在 arrayMethods 添加重写数组方法，重写进行了下面3步：
1 执行原始数组方法
2 对新增（push、unshift、splice）数组元素，进行观测
3 dep 依赖触发 notify 通知，进行响应式更新
4 返回原始执行结果

当 Vue 对 data 选项数据进行数据观测时，会对数组数据进行原型链重写 `value.__proto__` = arrayMethods，指向重写的数组方法对象上
继承关系: arr -> arrayMethods -> Array.prototype -> Object.prototype -> …

### Vue中如何检测数组的变化？
ue中对数组没有进行defineProperty，而是重写了数组的7个方法。 分别是：
* push
* shift
* pop
* splice
* unshift
* sort
* reverse
因为这些方法都会改变数组本身。
数组里的索引和长度是无法被监控的。

## Vue3.0 和 2.0 的响应式原理区别
Vue3.x 改用 Proxy 替代 Object.defineProperty。因为 Proxy 可以直接监听对象和数组的变化，并且有多达 13 种拦截方法。

相关代码如下

```js
import { mutableHandlers } from "./baseHandlers"; // 代理相关逻辑
import { isObject } from "./util"; // 工具方法

export function reactive(target) {
  // 根据不同参数创建不同响应式对象
  return createReactiveObject(target, mutableHandlers);
}
function createReactiveObject(target, baseHandler) {
  if (!isObject(target)) {
    return target;
  }
  const observed = new Proxy(target, baseHandler);
  return observed;
}

const get = createGetter();
const set = createSetter();

function createGetter() {
  return function get(target, key, receiver) {
    // 对获取的值进行放射
    const res = Reflect.get(target, key, receiver);
    console.log("属性获取", key);
    if (isObject(res)) {
      // 如果获取的值是对象类型，则返回当前对象的代理对象
      return reactive(res);
    }
    return res;
  };
}
function createSetter() {
  return function set(target, key, value, receiver) {
    const oldValue = target[key];
    const hadKey = hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (!hadKey) {
      console.log("属性新增", key, value);
    } else if (hasChanged(value, oldValue)) {
      console.log("属性值被修改", key, value);
    }
    return result;
  };
}
export const mutableHandlers = {
  get, // 当获取属性时调用此方法
  set, // 当修改属性时调用此方法
};

```

## Vue.set方法是如何实现的？
1. vue给对象和数组本身都增加了dep属性
3. 当给对象新增不存在的属性的时候，就会触发对象依赖的watcher去更新
3. 当修改数组索引的时候，就调用数组本身的splice方法去更新数组

## vm.$set 的实现原理

```
// 棒
function set(target, key, val) {
    const ob = target.__ob__
    defineReactive(ob.value, key, val)
    ob.dep.notify()
    return val
}
```

1. 当向一个响应式对象新增属性的时候，需要对这个属性重新进行响应式的设置，即使用 defineReactive 将新增的属性转换成 getter/setter。
2. 我们在前面讲过每一个对象是会通过 Observer 类型进行包装的，并在 Observer 类里面创建一个属于这个对象的依赖收集存储对象 dep， 
3. 最后在新增属性的时候就通过这个依赖对象进行通知相关 Watcher 进行变化更新。

## Vue.set 方法原理

了解 Vue 响应式原理的同学都知道在两种情况下修改数据 Vue 是**不会**触发视图更新的
1. 在实例创建之后添加新的属性到实例上（给响应式对象新增属性）
2. 直接更改数组下标来修改数组的值

Vue.set 或者说是$set 原理如下: 因为响应式数据 我们给对象和数组本身都增加了__ob__属性，代表的是 Observer 实例。当给对象新增不存在的属性 首先会把新的属性进行响应式跟踪 然后会触发对象__ob__的 dep 收集到的 watcher 去更新，当修改数组索引时我们调用数组本身的 splice 方法去更新数组

```js
export function set(target: Array | Object, key: any, val: any): any {
  // 如果是数组 调用我们重写的splice方法 (这样可以更新视图)
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  // 如果是对象本身的属性，则直接添加即可
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  const ob = (target: any).__ob__;

  // 如果不是响应式的也不需要将其定义成响应式属性
  if (!ob) {
    target[key] = val;
    return val;
  }
  // 将属性定义成响应式的
  defineReactive(ob.value, key, val);
  // 通知视图更新
  ob.dep.notify();
  return val;
}

```


## 参考

- https://juejin.cn/post/6961222829979697165
- https://juejin.cn/post/7043074656047202334

##

下面是笔记里的

## Vue2 响应式/双向绑原理

Vue 数据双向绑定是指：数据变化更新视图，视图变化更新数据。

Vue 响应式原理是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发更新。

~ Vue响应式原理？Vue双向绑定的原理？

原理1：

vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持（组件data选项的）各个属性的setter、getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

原理2：

1、Vue 将遍历此data对象所有的 property，并使用 Object.defineProperty 把这些 property 全部转为 getter/setter。

2、每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。

## 简述，如何追踪变化

* Vue 将遍历数据对象所有的 property，并使用 Object.defineProperty 把这些 property 全部转为 getter/setter，同时进行依赖收集。
* 每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。

## 谈谈你对Vue中响应式数据的理解？

数组和对象类型的值变化的时候，通过defineReactive方法，借助了defineProperty，将所有的属性添加了getter和setter。用户在取值和设置的时候，可以进行一些操作。
缺陷：只能监控最外层的属性，如果是多层的，就要进行全量递归。
get里面会做依赖搜集（dep[watcher, watcher]） set里面会做数据更新（notify，通知watcher更新）


## Vue中如何进行依赖收集的？
Vue初始化的时候，挂载之后会进行编译。生成renderFunction。
当取值的时候，就会搜集watcher，放到dep里面。
当用户更改值的时候，就会通知watcher，去更新视图。

## 计算属性缓存 vs 方法

```
计算属性是基于它们的响应式依赖进行缓存的，computed的值在getter执行后是会缓存，只有在它依赖的响应式属性值改变之后，下一次获取computed的值时才会重新调用对应的getter来计算。

而模板里的方法或是模板里的表达式，每当触发重新渲染时，将总会再次执行方法和表达式。还有filters

补充：
只要模板的渲染watcher，依赖的属性，发生改变，就触发重新渲染，概率还是很高的，
每当触发渲染时，都会执行组件模板里所有的方法和表达式，
而计算属性依赖的属性没改变，会直接返回缓存值（computed-watcher的value），这将很大概率提高计算速度。
应用场景：适用于重新计算比较费时不用重复数据计算的环境。
补充：计算属性是个宝，相比于方法、表达式计算，由此引出组件拆分粒度要合适的小就可以更小粒度的触发渲染
```

## computed 和 watch 的区别和运用的场景？
* computed：
计算属性是依赖其它属性值，并且具有缓存特性，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值；
计算属性可配置一个get和一个set方法，当依赖的响应式数据变化时调用get方法，当计算属性被赋值时调用set方法。
计算属性是同步。

* watch：
没有缓存性，更多的是观察作用；
当监听的数据变化时会执行回调；
监听的函数接收两个参数，第一个参数是最新的值；第二个参数是输入之前的值；
当我们需要深度监听对象中的属性时，可以配置deep：true选项，这样便会对对象中的每一项进行监听。
监听属性支持异步操作。

* 运用场景：
computed：当我们需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算；
  // 重点是触发重新渲染时，如果依赖属性没变，计算属性直接取缓存，不需要重新计算的，因为有组件重新渲染是频发的。
watch：当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch。

## watch-deep 使用字符串形式监听，优化深度监听？
deep的意思就是深入观察，监听器会一层层的往下遍历，给对象的所有属性都加上这个监听器，
但是这样性能开销就会非常大了，任何修改obj里面任何一个属性都会触发这个监听器里的 handler
watch: {
  obj: {
    handler(newName, oldName) {
      console.log('obj.a changed');
    },
    immediate: true,
    deep: true
  }
}

优化：我们可以使用字符串的形式监听
watch: {
  'obj.a': {
    handler(newName, oldName) {
      console.log('obj.a changed');
    },
    immediate: true,
    // deep: true
  }
}

这样Vue.js才会一层一层解析下去，直到遇到属性a，然后才给a设置监听函数。

如果没有写到组件中，不要忘记使用unWatch手动注销哦。


```
## 四 检测变化的注意事项

~ 为什么 `vm.a` 是响应的， `vm.b` 是非响应的？
@对于对象：
* Vue 无法检测根级 property 的添加或移除，
* 由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 data 对象上存在才能让 Vue 将它转换为响应式的。
* 对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property。但是，可以使用 Vue.set(object, propertyName, value) 方法向嵌套对象添加响应式 property。还可以使用 vm.$set 实例方法，这也是全局 Vue.set 方法的别名：this.$set(this.someObject,'b',2)

~ 直接给一个数组项通过索引赋值，Vue 能检测到变化吗？
~ Vue不能检测数组的哪些变动？

@对于数组：
* Vue 不能检测以下数组的变动：
1. 当你利用索引直接设置一个数组项时，例如：vm.items[indexOfItem] = newValue
2. 当你修改数组的长度时，例如：vm.items.length = newLength
为了解决第一类问题，以下两种方式都可以实现和 vm.items[indexOfItem] = newValue 相同的效果，同时也将在响应式系统内触发状态更新：
Vue.set(vm.items, indexOfItem, newValue) // Vue.set
vm.items.splice(indexOfItem, 1, newValue) // Array.prototype.splice
你也可以使用 vm.$set 实例方法，该方法是全局方法 Vue.set 的一个别名：vm.$set(vm.items, indexOfItem, newValue)
为了解决第二类问题，你可以使用 splice：vm.items.splice(newLength)

为什么数组长度不能被 getter/setter ？
在知乎上找了一个答案：如果你知道数组的长度，理论上是可以预先给所有的索引设置 getter/setter 的。但是一来很多场景下你不知道数组的长度，二来，如果是很大的数组，预先加 getter/setter 性能负担较大。

@声明响应式 property // 算是个规范
由于 Vue 不允许动态添加根级响应式 property，所以你必须在初始化实例前声明所有根级响应式 property，哪怕只是一个空值。
这样的限制在背后是有其技术原因的，它消除了在依赖项跟踪系统中的一类边界情况，也使 Vue 实例能更好地配合类型检查系统工作。
但与此同时在代码可维护性方面也有一点重要的考虑：data 对象就像组件状态的结构 (schema)。提前声明所有的响应式 property，可以让组件代码在未来修改或给其他开发人员阅读时更易于理解。

```


```
~ vm.$set 的实现原理是：
~ Vue 怎么用 vm.$set() 解决对象新增属性不能响应的问题 ？（不错）
受现代 JavaScript 的限制 ，Vue 无法检测到对象属性的添加或删除。由于 Vue 会在初始化实例时对属性执行 getter/setter 转化，所以属性必须在 data 对象上存在才能让 Vue 将它转换为响应式的。但是 Vue 提供了 Vue.set (object, propertyName, value) / vm.$set (object, propertyName, value) 来实现为对象添加响应式属性，那框架本身是如何实现的呢？
我们查看对应的 Vue 源码：vue/src/core/instance/index.js
export function set (target: Array<any> | Object, key: any, val: any): any {
  // target 为数组
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 修改数组的长度, 避免索引>数组长度导致splcie()执行有误
    target.length = Math.max(target.length, key)
    // 利用数组的splice变异方法触发响应式
    target.splice(key, 1, val)
    return val
  }
  // 这里 key 就是对象了，且 key 已经存在，直接修改属性值
  if (key in target && !(key in Object.prototype)) {
    target[key] = val // 对象 key 存在，说明已经经过了响应化处理了
    return val
  }
  const ob = (target: any).__ob__
  // target 本身就不是响应式数据, 直接赋值
  if (!ob) {
    target[key] = val
    return val
  }
  // 对属性进行响应式处理，对新增的 key defineReactive，同时触发通知
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
我们阅读以上源码可知，vm.$set 的实现原理是：「👍」
* 如果目标是数组，直接使用数组的 splice 方法触发相应式；
* 如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 defineReactive 方法进行响应式处理（ defineReactive 方法就是 Vue 在初始化对象时，给对象属性采用 Object.defineProperty 动态添加 getter 和 setter 的功能所调用的方法）
```
```
名词解释，有助于理解
Dep 依赖的意思，依赖收集，两层意思：Dep这个依赖去收集Watcher观察者，同时Watcher也在做addDep添加依赖，互相的，互相收集。
depend 依赖
addDep 添加依赖的意思
watcher 观察者
subscribe 订阅
```

```
Vue双向绑定原理简单版？

# 下面的只是模拟Vue响应式过程 ——————
DocumentFragment（文档片段）可以看做是节点容器
*使用：
它可以包含多个子节点，可以把它插入到DOM中，
只有它的子节点会插入目标节点，所以可以把它看做是一组节点容器。
*Vue中：
Vue进行编译的时候就是将挂载目标的所有子节点劫持到DocumentFragment中，
经过处理后再将DocumentFragment整体返回到挂载目标。
*优点：
使用DocumentFragment处理节点速度和性能优于直接操作DOM。

observe 方法
遍历vue实例中data的属性，逐一调用defineReactive方法，把他们定义为访问器属性

defineReactive 方法
给vue实例中的data的单个属性重新定义为访问器属性getter、setter，并在set方法中将新的值更新到对应的属性上，
在这里生成一个dep实例，每一个data的属性生成主题对象Dep，
getter中，如果主题对象类的静态属性target有值（此时因为Watcher的get方法被调用），给主题对象添加订阅者Watcher实例，dep.addSub(Dep.target)，完成依赖收集，Dep.target就是Watcher实例，
setter中，配置dep.notify()，该属性值被重复赋值时，会触发这个主体对象dep通知，它里面添加的各个Watcher，每个Watcher都会触发自己的updata，重新编译更新视图等。

nodeToFragment 方法
遍历节点，为每个子节点执行compile，
compile好的节点，劫持到DocumentFragment中，这个过程称为编译。

compile 方法 // 隐藏这会形成render函数
监听input值变化，并给vue实例中相应data的访问器属性赋值，这里会触发对应data属性的setter，
在编译方法compile中，劫持子节点的时候，为每个与数据绑定相关的节点生成一个订阅者new Watcher，// 在vue里每个组件生成一个Watcher实例

Watcher
每个与数据绑定相关的节点生成一个订阅者new Watcher，// 在vue里每个组件生成一个Watcher实例
Dep.target = this 将实例自己赋值给Dep静态属性target，也是watcher与dep关联的唯一桥梁，
get() {} 通过属性名获取data属性值，触发data属性getter，触发依赖收集，
update () {} 中给虚拟节点赋值。

Dep
data的每一个属性生成主题对象Dep，收集订阅者、定义notify通知，用来执行所有订阅，可以收集关联多个组件Watcher实例。// 在vue里每个组件生成一个Watcher实例
this.subs = []
addSub: this.subs.push(sub)
notify: this.subs.forEach(function (sub) {
          sub.update();
        });
————————
```