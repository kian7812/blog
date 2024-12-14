# Proxy & Reflect*

## Proxy

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
- https://es6.ruanyifeng.com/#docs/proxy

## Reflect

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
- https://es6.ruanyifeng.com/#docs/reflect

## 为什么Proxy一定要配合Reflect使用？*

### 引言

EcmaScript 2015 中引入了 Proxy 代理 与 Reflect 反射 两个新的内置模块。

我们可以利用 Proxy 和 Reflect 来实现对于对象的代理劫持操作，类似于 Es 5 中 Object.defineProperty()的效果，不过 Reflect & Proxy 远远比它强大。

大多数开发者都了解这两个 Es6 中的新增内置模块，可是你也许并不清楚为什么 Proxy 一定要配合 Reflect 使用。

这里，文章通过几个通俗易懂的例子来讲述它们之间相辅相成的关系。

### 前置知识

Proxy 代理，它内置了一系列”陷阱“用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

Reflect 反射，它提供拦截 JavaScript 操作的方法。这些方法与 Proxy 的方法相同。

简单来说，我们可以通过 Proxy 创建对于原始对象的代理对象，从而在代理对象中使用 Reflect 达到对于 JavaScript 原始操作的拦截。

如果你还不了解 & ，那么赶快去 MDN 上去补习他们的知识吧。

毕竟大名鼎鼎的 VueJs/Core 中核心的响应式模块就是基于这两个 Api 来实现的。

### 单独使用 Proxy

开始的第一个例子，我们先单独使用 Proxy 来烹饪一道简单的开胃小菜：

```js
const obj = {
  name: 'wang.haoyu',
};

const proxy = new Proxy(obj, {
  // get陷阱中target表示原对象 key表示访问的属性名
  get(target, key) {
    console.log('劫持你的数据访问' + key);
    return target[key]
  },
});

proxy.name // 劫持你的数据访问name -> wang.haoyu
```

看起来很简单对吧，我们通过 Proxy 创建了一个基于 obj 对象的代理，同时在 Proxy 中声明了一个 get 陷阱。

当访问我们访问 proxy.name 时实际触发了对应的 get 陷阱，它会执行 get 陷阱中的逻辑，同时会执行对应陷阱中的逻辑，最终返回对应的 target[key] 也就是所谓的 wang.haoyu .

### Proxy 中的 receiver

上边的 Demo 中一切都看起来顺风顺水没错吧，细心的同学在阅读 Proxy 的 MDN 文档上可能会发现其实 Proxy 中 get 陷阱中还会存在一个额外的参数 receiver 。

那么这里的 receiver 究竟表示什么意思呢？`大多数同学会将它理解成为代理对象，但这是不全面的`。

接下来同样让我们以一个简单的例子来作为切入点：

```js
const obj = {
  name: 'wang.haoyu',
};

const proxy = new Proxy(obj, {
  // get陷阱中target表示原对象 key表示访问的属性名
  get(target, key, receiver) {
    console.log(receiver === proxy);
    return target[key];
  },
});

// log: true
proxy.name;
```
上述的例子中，我们在 Proxy 实例对象的 get 陷阱上接收了 receiver 这个参数。

同时，我们在陷阱内部打印 `console.log(receiver === proxy); 它会打印出 true` ，表示这里 receiver 的确是和代理对象相等的。

`所以 receiver 的确是可以表示代理对象，但是这仅仅是 receiver 代表的一种情况而已`。

接下来我们来看另外一个例子：

```js
const parent = {
  get value() {
    return '19Qingfeng';
  },
};

const proxy = new Proxy(parent, {
  // get陷阱中target表示原对象 key表示访问的属性名
  get(target, key, receiver) {
    console.log(receiver === proxy);
    return target[key];
  },
});

const obj = {
  name: 'wang.haoyu',
};

// 设置obj继承与parent的代理对象proxy
Object.setPrototypeOf(obj, proxy);

// log: false
obj.value
```

关于原型上出现的 get/set 属性访问器的“屏蔽”效果，我在[这篇文章](https://juejin.cn/post/7074935443355074567)中进行了详细阐述。这里我就不展开讲解了。

我们可以看到，上述的代码同样我在 proxy 对象的 get 陷阱上打印了 `console.log(receiver === proxy); 结果却是 false` 。

那`么你可以稍微思考下这里的 receiver 究竟是什么呢？ 其实这也是 proxy 中 get 陷阱第三个 receiver 存在的意义`。

`它是为了传递正确的调用者指向`，你可以看看下方的代码：

```js
...
const proxy = new Proxy(parent, {
  // get陷阱中target表示原对象 key表示访问的属性名
  get(target, key, receiver) {
-   console.log(receiver === proxy) // log:false
+   console.log(receiver === obj) // log:true
    return target[key];
  },
});
...
```
`其实简单来说，get 陷阱中的 receiver 存在的意义就是为了正确的在陷阱中传递上下文`。

涉及到属性访问时，不要忘记 get 陷阱还会触发对应的属性访问器，也就是所谓的 get 访问器方法。

我们可以清楚的看到上述的 receiver 代表的是继承与 Proxy 的对象，也就是 obj。

`看到这里，我们明白了 Proxy 中 get 陷阱的 receiver 不仅仅代表的是 Proxy 代理对象本身，同时也许他会代表继承 Proxy 的那个对象`。

`其实本质上来说它还是为了确保陷阱函数中调用者的正确的上下文访问，比如这里的  receiver 指向的是 obj `。

`当然，你不要将 revceiver 和 get 陷阱中的 this 弄混了，陷阱中的 this 关键字表示的是代理的 handler 对象`。

比如：

```js
const parent = {
  get value() {
    return '19Qingfeng';
  },
};

const handler = {
  get(target, key, receiver) {
    console.log(this === handler); // log: true
    console.log(receiver === obj); // log: true
    return target[key];
  },
};

const proxy = new Proxy(parent, handler);

const obj = {
  name: 'wang.haoyu',
};

// 设置obj继承与parent的代理对象proxy
Object.setPrototypeOf(obj, proxy);

// log: false
obj.value
```

### Reflect 中的 receiver

在清楚了 Proxy 中 get 陷阱的 receiver 后，趁热打铁我们来聊聊 Reflect 反射 API 中 get 陷阱的 receiver。

`我们知道在 Proxy 中（以下我们都以 get 陷阱为例）第三个参数 receiver 代表的是代理对象本身或者继承与代理对象的对象，它表示触发陷阱时正确的上下文`。

```js
const parent = {
  name: '19Qingfeng',
  get value() {
    return this.name;
  },
};

const handler = {
  get(target, key, receiver) {
    return Reflect.get(target, key);
    // 这里相当于 return target[key]
  },
};

const proxy = new Proxy(parent, handler);

const obj = {
  name: 'wang.haoyu',
};

// 设置obj继承与parent的代理对象proxy
Object.setPrototypeOf(obj, proxy);

// log: false
console.log(obj.value);
```

我们稍微分析下上边的代码：
```
- 当我们调用 obj.value 时，由于 obj 本身不存在 value 属性。
- 它继承的 proxy 对象中存在 value 的属性访问操作符，所以会发生屏蔽效果。
- 此时会触发 proxy 上的 get value() 属性访问操作。
- 同时由于访问了 proxy 上的 value 属性访问器，所以此时会触发 get 陷阱。
- 进入陷阱时，target 为源对象也就是 parent ，key 为 value 。
- 陷阱中返回 Reflect.get(target,key) 相当于 target[key]。
- 此时，不知不觉中 this 指向在 get 陷阱中被偷偷修改掉了！！
- 原本调用方的 obj 在陷阱中被修改成为了对应的 target 也就是 parent 。
- 自然而然打印出了对应的 parent[value] 也就是 19Qingfeng 。
```

这显然不是我们期望的结果，当我访问 obj.value 时，**我希望应该正确输出对应的自身上的 name 属性也就是所谓的 obj.value => wang.haoyu 。**

那么，**Relfect 中 get 陷阱的 receiver 就大显神通了**。

```js
const parent = {
  name: '19Qingfeng',
  get value() {
    return this.name;
  },
};

const handler = {
  get(target, key, receiver) {
-   return Reflect.get(target, key);
+   return Reflect.get(target, key, receiver);
  },
};

const proxy = new Proxy(parent, handler);

const obj = {
  name: 'wang.haoyu',
};

// 设置obj继承与parent的代理对象proxy
Object.setPrototypeOf(obj, proxy);

// log: wang.haoyu
console.log(obj.value);
```
上述代码原理其实非常简单：

- 首先，`之前我们提到过在 Proxy 中 get 陷阱的 receiver 不仅仅会表示代理对象本身同时也还有可能表示继承于代理对象的对象，具体需要区别与调用方。这里显然它是指向继承与代理对象的 obj` 。

- `其次，我们在 Reflect 中 get 陷阱中第三个参数传递了 Proxy 中的 receiver 也就是 obj 作为形参，它会修改调用时的 this 指向`。

`你可以简单的将 Reflect.get(target, key, receiver) 理解成为 target[key].call(receiver)，不过这是一段伪代码`，但是这样你可能更好理解。

相信看到这里你已经明白 Relfect 中的 receiver 代表的含义是什么了，没错它正是可以修改属性访问中的 this 指向为传入的 receiver 对象。

### 总结

相信看到这里大家都已经明白了，`为什么Proxy一定要配合Reflect使用。恰恰是为什么触发代理对象的劫持时保证正确的 this 上下文指向`。

我们再来稍稍回忆一下，针对于 get 陷阱（当然 set 其他之类涉及到 receiver 的陷阱同理）：

Proxy 中接受的 Receiver 形参表示代理对象本身或者继承与代理对象的对象。


Reflect 中传递的 Receiver 实参表示修改执行原始操作时的 this 指向。

### 结尾（作者）

这里就到了文章的结尾了，至于为什么会突然提到 Proxy & Reflect 的话题。

其实是笔者最近在阅读 Vue/corejs 的源代码内容，刚好它内部大量应用于 Proxy & Reflect 所以就产生了这篇文章。

关于 Proxy 为什么一定要配合 Reflect 使用，具体结合 VueJs 中响应式模块的依赖收集其实会更好理解一些。不过这里为了照顾不太熟悉 VueJs 的同学所以就没有展开了。

当然，最近我也在阅读 VueJs 的过程中尝试书写一些阶段性总结文章。之后在文章中也会详细讲解这一过程，有兴趣的同学可以持续关注我的最新动态～

### 参考
- 19组清风 https://juejin.cn/post/7080916820353351688 & https://zhuanlan.zhihu.com/p/490719701
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get

### 摘录补充：

- `保证触发陷阱时拿到正确的上下文，即this的指向`.
- 其实简单来说，get 陷阱中的 receiver 存在的意义就是为了正确的在陷阱中传递上下文
- 其实本质上来说它还是为了确保陷阱函数中调用者的正确的上下文访问，比如这里的  receiver 指向的是 obj 
- 为什么Proxy一定要配合Reflect使用。恰恰是为什么触发代理对象的劫持时保证正确的 this 上下文指向