# Vue3中的响应式

Vue3中的响应式是如何被JavaScript实现的（清风）
- https://zhuanlan.zhihu.com/p/496900151（全） https://juejin.cn/post/7085376517491916807 （不全）
- （这篇就够了~👍🏻文字描述比较适合我）
- （以下内容参考的这篇文章）

## 开始之前

源码中拥有非常多的条件分支判断和错误处理，同时源码中也考虑了数组、Set、Map 之类的数据结构。
这里，我们仅仅先考虑基础的对象，至于其他数据类型我会在之后的文章中详细和大家一一道来。

在 VueJs 中的存在一个核心的 Api Effect ，这个 Api 在 Vue 3.2 版本之后暴露给了开发者去调用，在3.2之前都是 Vuejs 内部方法并不提供给开发者使用。

简单来说我们`所有模版（组件）最终都会被 effect 包裹` ，当数据发生变化时 Effect 会重新执行，`所以 vuejs 中的响应式原理可以说是基于 effect 来实现的` 。

当然这里你仅仅需要了解，`最终组件是会编译成为一个个 effect ，当响应式数据改变时会触发 effect 函数重新执行从而更新渲染页面即可`。

之后我们也会详细介绍 effect 和 响应式是如何关联到一起的。

一些基础的目录结构：
- reactivity/src/index.ts 用于统一引入导出各个模块
- reactivity/src/reactivity.ts 用于维护 reactive 相关 Api。
- reactivity/src/effect.ts 用户维护 effect 相关 Api。

## 简单思路梳理

关于 Vuejs 是如何实现数据响应式，简单来说它内部利用了 Proxy Api 进行了访问/设置数据时进行了劫持。
对于数据访问时，需要进行依赖收集。记录当前数据中依赖了哪些 Effect ，当进行数据修改时候同样会进行触发更新，重新执行当前数据依赖的 Effect。简单来说，这就是所谓的响应式原理。

关于 Effect 你可以暂时的将它理解成为一个函数，当数据改变函数（Effect）重新执行从而函数执行导致页面重新渲染。

## 简单响应式3个点

- Proxy （类比 defineproperty）、Effect （类比 Watcher）、Weakmap （类比 Dep）
- 起始是初始化渲染 proxy getter > tracker 依赖收集 effects》
- 响应数据变更 proxy setter > trigger 触发执行依赖的 effects 执行render渲染 》
- (每一次getter都会重新收集依赖的)

## 如何把源码中的响应式说出来呢（流程+谁做了什么事情描述吧）

## reactive(obj)

- 根据传入的对象 obj 创建一个 proxy 响应式代理对象。(考点proxy与defineproperty)
- 当访问proxy对象属性时，触发 get 陷阱会track收集effect依赖，同时返回属性值；
- 当修改proxy对象属性值时，触发 set 陷阱会进行trigger依赖effects执行（effect执行如render渲染会重新触发proxy响应对象的get再重新进行依赖收集）；


## effect(fn)

- 调用ReactiveEffect(fn)创建一个的effect实例
  - ReactiveEffect(fn)
  - 存储fn
  - 定义run方法，指定全局activeEffect值为当前effect实例，同时执行fn方法
- 首次立即执行effect实例run方法
  - 执行fn，如有proxy响应式数据，会触发get，会进行track收集依赖当前的activeEffect实例。
- 当proxy响应式数据改变时，会触发set，会进行trigger执行依赖effects的run fn。
  - 执行fn，又回到上一步，触发get进行依赖收集。

- effects实例可以是：`组件、计算属性、watcher、自定义effect`

## track(target, type, key)

- 添加对应的Map和Set：
  - 局targetMap，用于存储响应式数据和Effect的关系Hash表
  - 全局的 WeakMap 存储键为proxy原始对象target，值为Map对象。
  - 这个Map对象 存储键为被使用到proxy对象属性，值为Set对象，用来存储依赖的effects。
- 收集当前activeEffect依赖。

## trigger(target, type, key, value, oldValue) 

- 取出响应式属性对应 Set 中的 effects，执行effect中的run fn函数
- 重新调用effect.run()
- 重新执行清空当前Effect依赖
- 重新执行Effect中fn进行重新收集依赖以及视图更新。

## 递归函数执行是栈的形式

vue组件渲染 render函数执行也是栈的形式

## WeakMap Map Set
```
WeakMap 全局
    proxy Map
      属性 Set
          effects
              effects
```


## Vue3计算属性实现原理

https://juejin.cn/post/7137149613223444488（清风）

### 首先计算属性特性

- 懒计算，如果计算属性没有在模板或者逻辑中使用，它是不会进行任何计算的。
- 缓存，只有当计算属性中依赖的响应式数据 发生改变时，计算属性才会重新计算出新值。
- 支持任意值、值的设置。

### 在说下原理实现

1. 计算属性 computed 本身就是一个 Effect，默认情况下 computed 是不会进行计算的。
2. 同时也是一个响应式属性。
3. 计算属性内部维护了一些重要的属性：_value 缓存计算值，_dirty判断数据是否脏了，脏了就需要重新计算，（创建时为true不用计算立刻计算），dep 储存依赖该属性的Effects，effect 自身Effect实例，它依赖的响应式数据，如果有改变会触发trigger通知。

4. 当我们使用了该 computed 时，访问 computed 的 getter 属性。会发生：
  - 调用 this.effect.run() 执行当前 computed 的 getter 方法，获得返回值保存进入 this._value 记录。
  - 将 this._dirty 重置为 false，利用 _dirty 和 _value 实现缓存的特性。
  - 同时调用 trackRefValue 收集当前 activeEffect ，将当前活跃的 Effect 存储到 computed 的 dep 属性中，进行依赖收集。

5. 之后，如果 computed 依赖的响应式数据发生改变，会发生：
  - 首先，computed 中依赖的响应式数据发生改变。会重新调用当前 computed 的 effect （scheduler）通知依赖于该 computed 的 effects 重新执行。
  - 当依赖于该 computed 的 effect 重新执行时，会重新访问到 computed 的 getter 此时会重新计算 computed 中的值，得到更新后的 value 进行重新缓存。

简单来说，所谓 computed 的核心实现思路就是如此。

6. 理解补充：当依赖的属性发生变化后，不是立刻get重新计算，而是：
  - scheduler中dirty为true
  - scheduler中通知依赖该计算属性的Effects重新run，
  - 这些Effects重新run时，此时会触发计算属性的get，同时发现脏了，才会重新允许该计算属性。同时dirty置为false。
  - 注意，get触发需要（依赖该计算属性的Effects重新run）。
  - scheduler的执行相当于响应式属性setter执行。

```js
export class ComputedRefImpl<T> {
  public dep?: Dep = undefined
  private _value!: T
  public readonly effect: ReactiveEffect<T>
  public readonly __v_isRef = true
  // public readonly [ReactiveFlags.IS_READONLY]: boolean = false
  public _dirty = true
  // public _cacheable: boolean

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    // isReadonly: boolean,
    // isSSR: boolean
  ) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this)
      }
    })
    this.effect.computed = this
    // this.effect.active = this._cacheable = !isSSR
    // this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  get value() {
    // the computed ref may get wrapped by other proxies e.g. readonly() #3376
    const self = toRaw(this)
    trackRefValue(self)
    if (self._dirty || !self._cacheable) {
      self._dirty = false
      self._value = self.effect.run()!
    }
    return self._value
  }

  set value(newValue: T) {
    this._setter(newValue)
  }
}
```

补充：ReactiveEffect 中第二个函数为一个 scheduler ，不传入第二个参数时当当前 Effect 依赖的响应式数据发生变化后 Effect 中传入的第一个函数会立即执行。当传入第二个函数时，当第一个参数中依赖的响应式数据变化并不会执行传入的 getter 而是回执行对应的第二个参数 scheduler。