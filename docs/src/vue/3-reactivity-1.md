# Vue3 中的响应式是如何被 JavaScript 实现的（清风）

- https://zhuanlan.zhihu.com/p/496900151 （全）
- https://juejin.cn/post/7085376517491916807 （不全）
- 源码手写跟着他的也行
- 这篇就够了~👍🏻 解释比较到位，我能看懂
- 下面内容是源码比较多版本，适合理解，不用面试

## 响应式原理

上边我们对于构建稍稍花费了一些篇幅，接下来终于我们要步入正题进行响应式原理部分了。

首先，在开始之前我会稍微强调一些。文章中的代码并不是一比一对照源码来实现响应式原理，但是实现思想以及实现过程是和源码没有出入的。

这是因为源码中拥有非常多的条件分支判断和错误处理，同时源码中也考虑了数组、Set、Map 之类的数据结构。

这里，我们仅仅先考虑基础的对象，至于其他数据类型我会在之后的文章中详细和大家一一道来。

同时我也会在每个步骤的结尾贴出对应的源代码地址，提供给大家参照源码进行对比阅读。

## 开始之前

在我们开始响应式原理之前，我想和大家稍微阐述下对应背景。因为可能有部分同学对应 Vue3 中的源码并不是很了解。

在 VueJs 中的存在一个核心的 Api Effect ，这个 Api 在 Vue 3.2 版本之后暴露给了开发者去调用，在 3.2 之前都是 Vuejs 内部方法并不提供给开发者使用。

简单来说我们所有模版（组件）最终都会被 effect 包裹 ，当数据发生变化时 Effect 会重新执行，所以 vuejs 中的响应式原理可以说是基于 effect 来实现的 。

当然这里你仅仅需要了解，`最终组件是会编译成为一个个 effect ，当响应式数据改变时会触发 effect 函数重新执行从而更新渲染页面即可`。

之后我们也会详细介绍 effect 和 响应式是如何关联到一起的。

## 基础目录结构

首先我们来创建一些基础的目录结构：

- reactivity/src/index.ts 用于统一引入导出各个模块
- reactivity/src/reactivity.ts 用于维护 reactive 相关 Api。
- reactivity/src/effect.ts 用户维护 effect 相关 Api。

## reactive 基础逻辑处理

接下来我们首先进入相关的 reactive.ts 中去。

### 思路梳理

关于 Vuejs 是如何实现数据响应式，简单来说它内部利用了 Proxy Api 进行了访问/设置数据时进行了劫持。

对于数据访问时，需要进行依赖收集。记录当前数据中依赖了哪些 Effect ，当进行数据修改时候同样会进行触发更新，重新执行当前数据依赖的 Effect。简单来说，这就是所谓的响应式原理。

关于 Effect 你可以暂时的将它理解成为一个函数，当数据改变函数（Effect）重新执行从而函数执行导致页面重新渲染。

### Target 实现目标

在开始书写代码之前，我们先来看看它的用法。我们先来看看 reactive 方法究竟是如何搭配 effect 进行页面的更新：

```html
<body>
  <div id="app"></div>
  <script src="https://unpkg.com/vue@next"></script>
  <script>
    const { reactive, effect } = Vue;

    const obj = {
      name: "19Qingfeng",
    };

    // 创建响应式数据
    const reactiveData = reactive(obj);

    // 创建effect依赖响应式数据
    effect(() => {
      app.innerHTML = reactiveData.name;
    });

    // 0.5s 后更新响应式数据
    setTimeout(() => {
      reactiveData.name = "wang.haoyu";
    }, 500);
  </script>
</body>
```

不太了解 Effect 和响应式数据的同学可以将这段代码放在浏览器下执行试试看。

首先我们使用 reactive Api 创建了一个响应式数据 reactiveData 。

之后，我们创建了一个 effect，它会接受一个 fn 作为参数 。这个 effect 内部的逻辑非常简单：它将 id 为 app 元素的内容置为 reactiveData.name 的值。

注意，这个 effect 传入的 fn 中依赖了响应式数据 reactiveData 的 name 属性，这一步通常成为依赖收集。

当 effect 被创建时，fn 会被立即执行所以 app 元素会渲染对应的 19Qingfeng 。

当 0.5s 后 timer 达到时间，我们修改了 reactiveData 响应式数据的 name 属性，此时会触发改属性依赖的 effct 重新执行，这一步同样通常被称为触发更新。

所以页面上看起来的结果就是首先渲染出 19Qingfeng 在 0.5s 后由于响应式数据的改变导致 effect 重新执行所以修改了 app 的 innerHTML 导致页面重新渲染。

这就是一个非常简单且典型的响应式数据 Demo ，之后我们会一步一步基于结果来逆推实现这个逻辑。

### 基础 Reactive 方法实现 （reactive 是独立的，所以 fn 的可以是非 vue 的）

接下来我们先来实现一个基础版的 Reactive 方法，具体使用 API 你可以参照 👉 这里。

上边我们提到过 VueJs 中针对于响应式数据本质上就是基于 Proxy & Reflect 对于数据的劫持，那么自然我们会想到这样的代码：

```js
// reactivity/src/reactivity.ts
export function isPlainObj(value: any): value is object {
  return typeof value === 'object' && value !== null;
}

const reactive = (obj) => {
  // 传入非对象
  if (!isPlainObj(obj)) {
    return obj;
  }

  // 声明响应式数据
  const proxy = new Proxy(obj, {
      get() {
          // dosomething
      },
      set() {
          // dosomething
      }
  });

  return proxy;
};
```

上边的代码非常简单，我们创建了一个 reactive 对象，它接受传入一个 Object 类型的对象。

我们会对于函数传入的 obj 进行校验，如果传入的是 object 类型那么会直接返回。

接下来，我们会根据传入的对象 obj 创建一个 proxy 代理对象。并且会在该代理对象上针对于 get 陷阱（访问对象属性时）以及 set （修改代理对象的值时）进行劫持从而实现一系列逻辑。

### 依赖收集

之前我们提到过针对于 reactive 的响应式数据会在触发 get 陷阱时会进行依赖收集。

这里你可以简单将依赖收集理解为记录当前数据被哪些 Effect 使用到，之后我们会一步一步来实现它。

```js
// reactivity/src/reactivity.ts
export function isPlainObj(value: any): value is object {
  return typeof value === 'object' && value !== null;
}

const reactive = (obj) => {
  // 传入非对象
  if (!isPlainObj(obj)) {
    return obj;
  }

  // 声明响应式数据
  const proxy = new Proxy(obj, {
    get(target, key, receiver) {
      // 依赖收集方法 track
      track(target, 'get', key);

      // 调用 Reflect Api 获得原始的数据 你可以将它简单理解成为 target[key]
      let result = Reflect.get(target, key, receiver);
      // 依赖为对象 递归进行reactive处理
      if (isPlainObj(result)) {
        return reactive(result);
      }

      // 配合Reflect解决当访问get属性递归依赖this的问题
      return result;
    },
    set() {
      // dosomething
    }
  });

  return proxy;
};
```

上边我们填充了在 Proxy 中的 get 陷阱的逻辑：

- 当访问响应式对象 proxy 中的属性时，首先会针对于对应的属性进行依赖收集。主要依靠的是 track 方法。
- 之后如果访问该响应式对象 key 对应的 value 仍为对象时，会再次递归调用 reactive 方法进行处理。

需要注意的是递归进行 reactive 时是一层懒处理，换句话说只有访问时才会递归处理并不是在初始化时就会针对于传入的 obj 进行递归处理。

当然这里的依赖收集主要依靠的就是 track 方法，我们会在稍后详解实现这个方法。

### 依赖执行

接下来我们来看看 set 陷阱中的逻辑，当触发对于 proxy 对象的属性修改时会触发 set 陷阱从而进行触发对应 Effect 的执行。

我们来一起看看对应的 set 陷阱中的逻辑：

```js
// reactivity/src/reactivity.ts
export function isPlainObj(value: any): value is object {
  return typeof value === 'object' && value !== null;
}

const reactive = (obj) => {
  // 传入非对象
  if (!isPlainObj(obj)) {
    return obj;
  }

  // 声明响应式数据
  const proxy = new Proxy(obj, {
    get(target, key, receiver) {
      // 依赖收集方法 track
      track(target, 'get', key);

      // 调用 Reflect Api 获得原始的数据 你可以将它简单理解成为 target[key]
      let result = Reflect.get(target, key, receiver);
      // 依赖为对象 递归进行reactive处理
      if (isPlainObj(result)) {
        return reactive(result);
      }

      // 配合Reflect解决当访问get属性递归依赖this的问题
      return result;
    },
    // 当进行设置时进行触发更新
    set(target, key, value, receiver) {
      const oldValue = target[key];
      // 配合Reflect解决当访问get属性递归依赖this的问题
      const result = Reflect.set(target, key, value, receiver);
      // 如果两次变化的值相同 那么不会触发更新
      if (value !== oldValue) {
        // 触发更新
        trigger(target, 'set', key, value, oldValue);
      }

      return result;
    },
  });

  return proxy;
};
```

同样，我们在上边填充了对应 set 陷阱之中的逻辑，当设置响应式对象时会触发对应的 set 陷阱。我们会在 set 陷阱中触发对应的 trigger 逻辑进行触发更新：将依赖的 effect 重新执行。

关于为什么我们在使用 Proxy 时需要配合 Refelct ，我在这篇文章有详细讲解。感兴趣的朋友可以查看这里 👉 [为什么 Proxy 一定要配合 Reflect 使用？]。

上边我们完成了 reactive.ts 文件的基础逻辑，遗留了两个核心方法 track & trigger 方法。

在实现着两个方法之前，我们先来一起看看 effect 是如何被实现的。

## effect 文件

### effect 基础使用

让我们把视野切到 effcet.ts 中，我们稍微来回忆一下 effect Api 的用法：

```js
const { reactive, effect } = Vue;

const obj = {
  name: "19Qingfeng",
};

// 创建响应式数据
const reactiveData = reactive(obj);

// 创建effect依赖响应式数据
effect(() => {
  app.innerHTML = reactiveData.name;
});
```

### effect 基础原理

上边我们看到，effect Api 有以下特点：

- effect 接受一个函数作为入参。
- 当调用 effect(fn) 时，内部的函数会直接被调用一次。
- 其次，当 effect 中的依赖的响应式数据发生改变时。我们期望 effect 会重新执行，比如这里的 effect 依赖了 reactiveData.name 上的值。

接下来我们先来一起实现一个简单的 Effect Api：

```js
function effect(fn) {
  // 调用Effect创建一个的Effect实例
  const _effect = new ReactiveEffect(fn);

  // 调用Effect时Effect内部的函数会默认先执行一次
  _effect.run();

  // 创建effect函数的返回值：_effect.run() 方法（同时绑定方法中的this为_effect实例对象）
  const runner = _effect.run.bind(_effect);
  // 返回的runner函数挂载对应的_effect对象
  runner.effect = _effect;

  return runner;
}
```

这里我们创建了一个基础的 effect Api，可以看到它接受一个函数 fn 作为参数。

当我们运行 effect 时，会创建一个 const \_effect = new ReactiveEffect(fn); 对象。

同时我们会调用 \_effect.run() 这个实例方法立即执行传入的 fn ，之所以需要立即执行传入的 fn 我们在上边提到过：当代码执行到 effect(fn) 时，实际上会立即执行 fn 函数。

我们调用的 \_effect.run() 实际内部也会执行 fn ，我们稍微回忆下上边的 Demo 当代码执行 effect(fn) 时候相当于执行了:

```js
// ...
effect(() => {
  app.innerHTML = reactiveData.name;
});
```

会立即执行传入的 fn 也就是 () => { app.innerHTML = reactiveData.name } 会修改 app 节点中的内容。

同时，我们之前提到过因为 reactiveData 是一个 proxy 代理对象，当我们访问它的属性时实际上会触发它的 get 陷阱。

```js
// effect.ts
export let activeEffect;
export function effect(fn) {
  // 调用Effect创建一个的Effect实例
  const _effect = new ReactiveEffect(fn);

  // 调用Effect时Effect内部的函数会默认先执行一次
  _effect.run();

  // 创建effect函数的返回值：_effect.run() 方法（同时绑定方法中的this为_effect实例对象）
  const runner = _effect.run.bind(_effect);
  // 返回的runner函数挂载对应的_effect对象
  runner.effect = _effect;

  return runner;
}

/**
 * Reactive Effect
 */
export class ReactiveEffect {
  private fn: Function;
  constructor(fn) {
    this.fn = fn;
  }

  run() {
    try {
         activeEffect = this; // 用作依赖收集
        // run 方法很简单 就是执行传入的fn
        return this.fn(); // 会触发 getter
    } finally {
        activeEffect = undefined
    }

  }
}
```

这是一个非常简单的 ReactiveEffect 实现，它的内部非常简单就是简单的记录了传入的 fn ，同时拥有一个 run 实例方法当调用 run 方法时会执行记录的 fn 函数。

同时，我们在模块内部声明了一个 activeEffect 的变量。当 我们调用运行 effect(fn) 时，实际上它会经历以下步骤：

- 首先用户代码中调用 effect(fn)
- VueJs 内部会执行 effect 函数，同时创建一个 \_effect 实例对象。立即调用 \_effect.run() 实例方法。
- 重点就在所谓的 \_effect.run() 方法中。
- 首先，当调用 \_effect.run() 方法时，我们会执行 activeEffect = this 将声明的 activeEffect 变成当前对应的 \_effect 实例对象。
- 同时，run() 方法接下来会调用传入的 fn() 函数。
- 当 fn() 执行时，如果传入的 fn() 函数存在 reactive() 包裹的响应式数据，那么实际上是会进入对应的 get 陷阱中。
- 当进入响应式数据的 get 陷阱中时，不要忘记我们声明全局的 activeEffect 变量，我们可以在对应响应式数据的 get 陷阱中拿到对应 activeEffect (也就是创建的 \_effect) 变量。

接下来我们需要做的很简单:

在响应式数据的 get 陷阱中记录该数据依赖到的全局 activeEffect 对象(\_effect)（依赖收集）也就是我们之前遗留的 track 方法。

同时:

当改变响应式数据时，我们仅仅需要找出当前对应的数据依赖的 \_effect ，修改数据同时重新调用 \_effect.run() 相当于重新执行了 effect（fn）中的 fn。那么此时不就是相当于修改数据页面自动更新吗？这一步就被称为依赖收集，也就是我们之前遗留的 trigger 方法。

## track & trigger 方法

让我们会回到之前遗留的 track 和 trigger 逻辑中，接下来我们就尝试去实现它。

这里我们将在 effect.ts 中来实现这两个方法，将它导出提供给 reactive.ts 中使用。

### 思路梳理

上边我们提到过，核心思路是当代码执行到 effect(fn) 时内部会调用对应的 fn 函数执行。当 fn 执行时会触发 fn 中依赖的响应式数据的 get ，当 get 触发时我们记录到对应 声明的(activeEffect) \_effect 对象和对应的响应式数据的关联即可。

当响应式数据改变时，我们取出关联的 \_effect 对象，重新调用 \_effect.run() 重新执行 effect(fn) 传入的 fn 函数即可。

看到这里，一些同学已经反应过来了。我们有一份记录对应 activeEffect(\_effect) 和 对应的响应式数据的表，于是我们自然而然的想到使用一个 WeakMap 来存储这份关系。

之所以使用 WeakMap 来存储，第一个原因自然是我们需要存储的 key 值是非字符串类型这显然只有 map 可以。其次就是 WeakMap 的 key 并不会影响垃圾回收机制。

### 创建映射表

上边我们分析过，我们需要一份全局的映射表来维护 \_effect 实例和依赖的响应式数据的关联：

于是我们自然想到通过一个 WeakMap 对象来维护映射关系，那么如何设计这个 WeakMap 对象呢？这里我就不卖关子了。

我们再来回忆下上述的 Demo ：

```js
// ...
const { reactive, effect } = Vue;

const obj = {
  name: "19Qingfeng",
};

// 创建响应式数据
const reactiveData = reactive(obj);

// 创建effect依赖响应式数据
effect(() => {
  app.innerHTML = reactiveData.name;
});

// 上述Demo的基础上增加了一个effect依赖逻辑
effect(() => {
  app2.innerHTML = reactiveData.name;
});
```

首先针对于响应式数据 reactiveData 它是一个对象，上述代码中的 effect 中仅仅依赖了这个对象上的 name 属性。

所以，我们仅仅需要关联当前响应式对象中的 name 属性和对应 effect 即可。

同时，针对于同一个响应式对象的属性比如这里的 name 属性被多个 effect 依赖。自然我们可以想到一份响应式数据的属性可以被多个 effect 依赖。

根据上述的分析最终 Vuejs 中针对于这份映射表设计出来了这样的结构：

当一个 effect 中依赖对应的响应式数据时，比如上述 Demo ：

全局的 WeakMap 首先会根据当前 key 响应式对象的原始对象，也就是 reactive 对应的原始对象（未代理前的 obj） 作为 key 值，value 为一个 Map 对象。

同时 effect 内部使用了上述对象的某个属性，那么此时 WeakMap 对象的该对象的值（对应为一个 Map）。我们会在这个 Map 对象中设置 key 为使用到的属性，value 为一个 Set 对象。

为什么对应属性的值为一个 Set ，这非常简单。因为该属性可能会被多个 effect 依赖到。所以它的值为一个 Set 对象，当该属性被某个 effect 依赖到时，会将对应 \_effect 实例对象添加进入 Set 中。

也许有部分同学乍一看对于这份映射表仍然比较模糊，没关系接下来我会用代码来描述这一过程。你可以结合代码和这段文字进行一起理解。

### track 实现

接下来我们来看看 track 方法的实现：

```js
// *用于存储响应式数据和Effect的关系Hash表

const targetMap = new WeakMap();

/**
 * 依赖收集函数 当触发响应式数据的Getter时会进入track函数
 * @param target 访问的原对象
 * @param type 表示本次track从哪里来
 * @param key 访问响应式对象的key
 */
export function track(target, type, key) {
  // 当前没有激活的全局Effect 响应式数据没有关联的effect 不用收集依赖
  if (!activeEffect) {
    return;
  }

  // 查找是否存在对象
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  // 查找是否存在对应key对应的 Set effect
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  // 其实Set本身可以去重 这里判断下会性能优化点
  const shouldTrack = !deps.has(activeEffect) && activeEffect;

  if (shouldTrack) {
    // *收集依赖，将 effect 进入对应WeakMap中对应的target中对应的keys
    deps.add(activeEffect);
  }
}
```

我们一行一行分析上边的 track 方法，这个方法我们之前提到过。它是在 reactive.ts 中对于某个响应式属性进行依赖收集（触发 proxy 的 get 陷阱）时触发的，忘记了的小伙伴可以翻回去重新看下。

首先，它会判断当前 activeEffect 是否存在，所谓 actvieEffect 也就是当前是否存在 effect 。换句话说，比如这样：

```js
// ...
app.innerHTML = reactiveData.name;
```

那么我们有必要进行依赖收集吗，虽然 reactiveData 是一个响应式数据这不假，但是我们并没有在模板上使用它。它并不存在任何关联的 effect ，所以完全没有必要进行依赖收集。

而在这种情况下:

```js
effect(() => {
  app.innerHTML = reactiveData.name;
});
```

只有我们在 effect(fn) 中，当 fn 中使用到了对应的响应式数据。简单来说也就是 activeEffect 存在值得时候，对于响应式数据的依赖收集才有意义。

其次，接下来会去全局的 targetMap 中寻找是否已经存在对应响应式数据的原始对象 -> depsMap 。如果该对象首次被收集，那么我们需要在 targetMap 中设置 key 为 target ，value 为一个新的 Map。

```js
// 查找是否存在对象
let depsMap = targetMap.get(target);
if (!depsMap) {
  // 不存在则创建一个Map作为value，将target作为key放入depsMap中
  targetMap.set(target, (depsMap = new Map()));
}
```

同时我们会继续去上一步返回的 deps ，此时的 deps 是一个 Map 。它的内部会记录改对象中被进行依赖收集的属性。

我们回去寻找 name 属性是否存在，显然它是第一次进行依赖收集。所以会进行：

```js
// 查找是否存在对应key对应的 Set effect
let deps = depsMap.get(key);
if (!deps) {
  // 同样，不存在则创建set放入
  depsMap.set(key, (deps = new Set()));
}
```

此时，比如上方的 Demo 中，当代码执行到 effect 中的 fn 碰到响应式数据的 get 陷阱时，触发 track 函数。

我们会为全局的 targetMap 对象中首先设置 key 为 obj （reactiveData 的原始对象），value 为一个 Map 。

其次，我们会为该创建的 Map 中再次进行设置 key 为该响应式对象需要被收集的属性，也就是我们在 effect 中访问到该对象的 name ，value 为一个 Set 集合。

接下里 Set 中存放什么其实很简单，我们仅需在对应 Set 中记录当前正在运行的 effct 实例对象，也就是 activeEffct 就可以达到对应的依赖收集效果。

此时，targetMap 中就会存放对应的对象和关联的 effect 了。

### trigger 实现

当然，上述我们已经通过对应的 track 方法收集了相关响应式数据和对应它依赖的 effect 。

那么接下来如果当改变响应式数据时（触发 set 陷阱时）自然我们仅仅需要找到对应记录的 effect 对象，调用它的 effect.run() 重新执行不就可以让页面跟随数据改变而改变了吗。

我们来一起看看 trigger 方法：

```js
// ... effect.ts
/**
 * 触发更新函数
 * @param target 触发更新的源对象
 * @param type 类型
 * @param key 触发更新的源对象key
 * @param value 触发更新的源对象key改变的value
 * @param oldValue 触发更新的源对象原始的value
 */
export function trigger(target, type, key, value, oldValue) {
  // 简单来说 每次触发的时 我拿出对应的Effect去执行 就会触发页面更新
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let effects = depsMap.get(key);
  if (!effects) {
    return;
  }

  effects = new Set(effects);
  effects.forEach((effect) => {
    // 当前zheng
    if (activeEffect !== effect) {
      // 默认数据变化重新调用effect.run()重新执行清空当前Effect依赖重新执行Effect中fn进行重新收集依赖以及视图更新
      effect.run();
    }
  });
}
```

接下来我们在 effect.ts 中来补充对应的 trigger 逻辑，其实 trigger 的逻辑非常简单。每当响应式数据触发 set 陷阱进行修改时，会触发对应的 trigger 函数。

他会接受对应的 5 个 参数，我们在函数的注释中已经标明了对应的参数。

当触发响应式数据的修改时，首先我们回去 targetMap 中寻找 key 为对应原对象的值，自然因为在 track 中我们已经保存了对应的值，所以当然可以拿到一个 Map 对象。

因为该 Map 对象中存在对应 key 为 name 值为该属性依赖的 effect 的 Set 集合，所以我们仅需要依次拿出对应修改的属性，比如我们调用：

```js
// ...
const { reactive, effect } = Vue;

const obj = {
  name: "19Qingfeng",
};

// 创建响应式数据
const reactiveData = reactive(obj);

// 创建effect依赖响应式数据
effect(() => {
  app.innerHTML = reactiveData.name;
});

// 修改响应式数据 触发set陷阱
reactiveData.name = "wang.haoyu";
```

当我们调用 reactiveData.name = 'wang.haoyu' 时，我们会一层一层取到

- targetMap 中 key 为 obj 的 depsMap（Map） 对象。
- 再从 depsMap 中拿到 key 为 name 属性的 Set 集合（Set 中保存该响应式对象属性依赖的 effect）。
- 迭代当前 Set 中的所有 effect 进行 effect.run() 重新执行 effect 对象中记录的 fn 函数。

因为我们在 reactive.ts 中的 set 陷阱中对于数据已经修改之后调用了 trigger 方法，trigger 导致重新执行 effect(fn) 中的 fn，所以自然而然 fn() 重新执行 app.innerHTML 就会变成最新的 wang.haoyu 。

整个响应式核心原理其实一点都不难对吧，核心思想还是文章开头的那句话：对于数据访问时，需要进行依赖收集。记录当前数据中依赖了哪些 Effect ，当进行数据修改时候同样会进行触发更新，重新执行当前数据依赖的 Effect。

## 阶段总结

其实写到这里已经 8K 多字了，原本打算是和大家过一遍整个 Vue 3.2 中关于 reactivity 的逻辑，包括各种边界情况。

比如文章中的代码其实仅仅只能说是实现了一个乞丐版的响应式原理，其他一些边界情况，比如：

- 多个 effect 嵌套时的处理。
- 多次 reactive 调用同一对象，或者对于已经 reactive 包裹的响应式对象。
- 每次触发更新时，对于前一次依赖收集的清理。
- shallow、readonly 情况等等...

这些边界情况其实文章中的代码我都没有考虑，如果后续有小伙伴对这方面感兴趣我会再次开一篇文章去继续这次的代码去实现一个完整的 reactive 方法。

不过，透过现象看本质。VueJs 中所谓主打的数据响应式核心原理即是文章中代码所表现的思想。

我在这个代码地址，也自己实现了一版比较完整的精简版 reactivity 模块，有兴趣的同学可以自行查阅。

写在结尾

文章的结尾，感谢每一个可以读到最后的小伙伴。

说实话我不太清楚这样的精简源码文章风格会有多少小伙伴能接受。如果后续有必要的话，我会持续更新 VueJs 的精简文章，比如完善本次的 reactivity 逻辑，又或者 ref 、computed、watch 等等逻辑。
