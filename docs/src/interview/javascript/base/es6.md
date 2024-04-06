
# ES6+ 基础知识

## let 和 const

另一种做法日益普及：默认使用 const，只有当确实需要改变变量的值的时候才使用 let。这是因为大部分的变量的值在初始化后不应再改变，而预料之外的变量的修改是很多 bug 的源头。

## 模板字符串

## 箭头函数

以下几种情况避免使用：

1. 使用箭头函数定义对象的方法

```js
// bad
let foo = {
  value: 1,
  getValue: () => console.log(this.value)
}

foo.getValue();  // undefined
```
2. 定义原型方法

```js
// bad
function Foo() {
  this.value = 1
}

Foo.prototype.getValue = () => console.log(this.value)

let foo = new Foo()
foo.getValue();  // undefined
```
3. 作为事件的回调函数

```js 
// bad
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
    console.log(this === window); // => true
    this.innerHTML = 'Clicked button';
});
```

## Symbol

1. 唯一值

```js
// bad
// 1. 创建的属性会被 for-in 或 Object.keys() 枚举出来
// 2. 一些库可能在将来会使用同样的方式，这会与你的代码发生冲突
if (element.isMoving) {
  smoothAnimations(element);
}
element.isMoving = true;

// good
if (element.__$jorendorff_animation_library$PLEASE_DO_NOT_USE_THIS_PROPERTY$isMoving__) {
  smoothAnimations(element);
}
element.__$jorendorff_animation_library$PLEASE_DO_NOT_USE_THIS_PROPERTY$isMoving__ = true;

// better
var isMoving = Symbol("isMoving");
if (element[isMoving]) {
  smoothAnimations(element);
}
element[isMoving] = true;
```

2. 魔术字符串

魔术字符串指的是在代码之中多次出现、与代码形成强耦合的某一个具体的字符串或者数值。
魔术字符串不利于修改和维护，风格良好的代码，应该尽量消除魔术字符串，改由含义清晰的变量代替。

```js
// bad
const TYPE_AUDIO = 'AUDIO'
const TYPE_VIDEO = 'VIDEO'
const TYPE_IMAGE = 'IMAGE'

// good
const TYPE_AUDIO = Symbol() // export TYPE_AUDIO
const TYPE_VIDEO = Symbol()
const TYPE_IMAGE = Symbol()


function handleFileResource(resource) {
  switch(resource.type) {
    case TYPE_AUDIO:
      playAudio(resource)
      break
    case TYPE_VIDEO:
      playVideo(resource)
      break
    case TYPE_IMAGE:
      previewImage(resource)
      break
    default:
      throw new Error('Unknown type of resource')
  }
}
```
3. 私有变量

Symbol 也可以用于私有变量的实现。

```js
const Example = (function() {
  var _private = Symbol('private');

  class Example {
    constructor() {
      this[_private] = 'private';
    }
    getName() {
      return this[_private];
    }
  }

  return Example;
})();

var ex = new Example();

console.log(ex.getName()); // private
console.log(ex.name); // undefined
```

## Set

（常考的 Set、Map、Proxy 等 ES6 方法）

Set 介绍: 
- ES6 提供了新的数据结构 Set。
- 它类似于数组，它是值的合集（collection），集合（set）中的元素只会出现一次，即集合中的元素是唯一的。没有重复的值。
- `它允许你存储任何类型（无论是原始值还是对象引用）的唯一值`。

Set 的使用，只读或可读写的：
- 只读的，有 size 属性及以下方法：entries()、forEach()、has()、keys()、values() 和 @@iterator。
- 可写的，此外还具有以下方法：clear()、delete() 和 add()。

更多：使用 Set 对象、迭代集合、实现基本集合操作、与数组的关系、数组去重、与字符串的关系等，
[参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)

```js
// 用于从数组中删除重复元素
const numbers = [2, 3, 4, 4, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 5, 32, 3, 4, 5];
console.log([...new Set(numbers)]);
// [2, 3, 4, 5, 6, 7, 32]
```

## WeakSet

与 Set 类似，也是不重复的值的集合，元素唯一。但是 WeakSet 的元素只能是对象，而不能是其他类型的值。

它和 Set 对象的主要区别有：
- WeakSet 只能是对象和符号的集合，它不能像 Set 那样包含任何类型的任意值。
- WeakSet 持弱引用：WeakSet 中对象的引用为弱引用。`如果没有其他的对 WeakSet 中对象的引用存在，那么这些对象会被垃圾回收`。（*如果没有其它应用 WeakSet 中的对象，则该对象元素会被回收*）
- WeakSet 是`不可枚举`的。

更多：检测循环引用，
[参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)

## Map

- Map 对象保存键值对，是键值对的集合。
- 任何值（对象或者原始值）都可以作为键或值。
- Map 中的一个键只能出现一次。
- 并且能够记住键的原始插入顺序。

类 Map 对象：
- 只读的，具有 size 属性，以及这些方法：entries()、forEach()、keys()、values() 和 @@iterator 。
- 可写的，还额外具有这些方法：clear()、delete() 和 set()。

[更多](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)

## WeakMap

- 与 Map 结构类似，也是用于生成键值对的集合。
- 但是 WeakMap 只接受对象作为键名（ null 除外），不接受其他类型的值作为键名。
- 不会创建对它的键的强引用。一个对象作为 WeakMap 的键存在，不会阻止该对象被垃圾回收。一旦一个对象作为键被回收，那么在 WeakMap 中相应的值便成为了进行垃圾回收的候选对象，只要它们没有其他的引用存在。(*回收的是这个健*)
- WeakMap 是`不可枚举`的。(*集合中没有存储当前值的列表*)

**WeakMap 的意义**

在 JavaScript 里，map API 可以通过使其**四个 API 方法共用两个数组（一个存放键，一个存放值）来实现**。给这种映射设置值时会同时将键和值添加到这两个数组的末尾。从而使得键和值的索引在两个数组中相对应。当从该映射取值的时候，需要遍历所有的键，然后使用索引从存储值的数组中检索出相应的值。

但这样的实现会有两个很大的缺点：

- 首先赋值和搜索操作都是 O(n) 的时间复杂度（n 是键值对的个数），因为这两个操作都需要遍历全部整个数组来进行匹配。
- 另外一个缺点是**可能会导致内存泄漏，因为数组会一直引用着每个键和值。这种引用使得垃圾回收算法不能回收处理他们**，即使没有其他任何引用存在了。

相较之下，WeakMap 的键对象会强引用其值，直到该键对象被垃圾回收，但从那时起，它会变为弱引用。因此，WeakMap：

- 不会阻止垃圾回收，直到垃圾回收器移除了键对象的引用
- 任何值都可以被垃圾回收，只要它们的键对象没有被 WeakMap 以外的地方引用

当将键映射到与键相关的信息，而该信息仅在键未被垃圾回收的情况下具有价值时，WeakMap 是一个特别有用的构造。

但因为 **WeakMap 不允许观察其键的生命周期，所以其键是不可枚举的。没有方法可以获得键的列表**。如果有的话，该列表将会依赖于垃圾回收的状态，这引入了不确定性。如果你想要可以获得键的列表，你应该使用 Map。

[更多](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap),
[带键的集合](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Keyed_collections)

## Reflect

- Reflect 是一个内置的对象，它提供**拦截 JavaScript 操作的方法**。这些方法与 proxy handler 方法的命名相同。
- Reflect 的所有属性和方法都是静态的（就像 Math 对象）。
- Reflect 并非一个构造函数，不能通过 new 运算符对其进行调用，也不能将 Reflect 对象作为一个函数来调用。

[更多](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

## Proxy

Proxy：Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写（一种中介者模式）。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

[更多示例](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy),
[ruanyifeng](https://es6.ruanyifeng.com/#docs/proxy)

## for of

1. 遍历范围

for...of 循环可以使用的范围包括：
  - 数组
  - Set
  - Map
  - 类数组对象，如 arguments 对象、DOM NodeList 对象
  - Generator 对象
  - 字符串

2. 优势

ES2015 引入了 for..of 循环，它结合了 forEach 的简洁性和中断循环的能力：
  - break 语句退出循环并跳转到循环体后的第一条语句，
  - 而 continue 语句跳过当前迭代的剩余语句，继续进行下一次迭代。

```js
for (const v of ['a', 'b', 'c']) {
  console.log(v);
}
// a b c

for (const [i, v] of ['a', 'b', 'c'].entries()) {
  console.log(i, v);
}
// 0 "a"
// 1 "b"
// 2 "c"
```
3. 遍历 Map

```js
let map = new Map(arr);

// 遍历 key 值
for (let key of map.keys()) {
  console.log(key);
}

// 遍历 value 值
for (let value of map.values()) {
  console.log(value);
}

// 遍历 key 和 value 值(一)
for (let item of map.entries()) {
  console.log(item[0], item[1]);
}

// 遍历 key 和 value 值(二)
for (let [key, value] of data) {
  console.log(key)
}
```

## Promise

Promise 是一个 ECMAScript 6 提供的类，目的是更加优雅地书写复杂的异步任务。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers）。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的 promise 对象。

关键点：

1. Promise 对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）
2. Promise 构造函数接收一个函数作为参数，该函数的两个参数分别是 resolve 和 reject
3. 一个 promise 对象只能改变一次状态，成功或者失败后都会返回结果数据。
4. then 方法可以接收两个回调函数作为参数，第一个回调函数是 Promise 对象的状态改变为 resoved 是调用，第二个回调函数是 Promise 对象的状态变为 rejected 时调用。其中第二个参数可以省略。
5. catch 方法，该方法相当于最近的 then 方法的第二个参数，指向 reject 的回调函数，另一个作用是，在执行 resolve 回调函数时，如果出错，抛出异常，不会停止陨星，而是进入 catch 方法中。

**除了 then 块以外，其它两种块能否多次使用？**

可以，finally 与 then 一样会按顺序执行，但是 catch 块只会执行第一个，除非 catch 块里有异常。所以最好只安排一个 catch 和 finally 块。

**then 块如何中断？**

then 块默认会向下顺序执行，return 是不能中断的，可以通过 throw 来跳转至 catch 实现中断。

## Async

async/await 是以更舒适的方式使用 promise 的一种特殊语法，同时它也非常易于理解和使用。

关键点：

1. async 确保了函数返回一个 promise，也会将非 promise 的值包装进去。
2. await 的关键词，它只在 async 函数内工作，语法是：let value = await promise; 让 JavaScript 引擎等待直到 promise 完成（settle）并返回结果。
3. 如果有 error，就会抛出异常 —— 就像那里调用了 throw error 一样。否则，就返回结果。
4. 错误处理

```js
// better
async function fetch() {
  try {
    const data = JSON.parse(await fetchData())
  } catch (err) {
    console.log(err)
  }
};
```

## Class

```js
class Foo {
  static bar () {
    this.baz();
  }
  static baz () {
    console.log('hello');
  }
  baz () {
    console.log('world');
  }
}

Foo.bar(); // hello
```
```js
class Shape {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }
  get area() {
    return this._width * this._height;
  }
}

const square = new Shape(10, 10);
console.log(square.area);    // 100
console.log(square._width);  // 10
```

## Module

**export**

```js
// 导出单个特性
export let name1, name2, …, nameN; // also var, const
export let name1 = …, name2 = …, …, nameN; // also var, const
export function FunctionName(){...}
export class ClassName {...}

// 导出列表
export { name1, name2, …, nameN };

// 重命名导出
export { variable1 as name1, variable2 as name2, …, nameN };

// 解构导出并重命名
export const { name1, name2: bar } = o;

// 默认导出
export default expression;
export default function (…) { … } // also class, function*
export default function name1(…) { … } // also class, function*
export { name1 as default, … };

// 导出模块合集
export * from …; // does not set the default export
export * as name1 from …; // Draft ECMAScript® 2O21
export { name1, name2, …, nameN } from …;
export { import1 as name1, import2 as name2, …, nameN } from …;
export { default } from …;
```

重导出 / 聚合
- 使用“export from”语法实现，可以创建单个模块，集中多个模块的多个导出。

[更多](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export)

**import**

```js
import defaultExport from "module-name";
import * as name from "module-name";
import { export1 } from "module-name";
import { export1 as alias1 } from "module-name";
import { default as alias } from "module-name";
import { export1, export2 } from "module-name";
import { export1, export2 as alias2, /* … */ } from "module-name";
import { "string name" as alias } from "module-name";
import defaultExport, { export1, /* … */ } from "module-name";
import defaultExport, * as name from "module-name";
import "module-name"; // 仅为副作用而导入一个模块
```

动态 import ->[参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)


## Decorator

https://juejin.cn/post/6844903726201700365#heading-28

## 函数-默认值

1. 默认值

```js
// bad
function test(quantity) {
  const q = quantity || 1;
}

// good
function test(quantity = 1) {
  ...
}
```
## 拓展运算符

1. arguments 转数组

```js
// bad
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// good
const sortNumbers = (...numbers) => numbers.sort();
```

3. 构建对象

```js
let [a, b, ...arr] = [1, 2, 3, 4, 5];

const { a, b, ...others } = { a: 1, b: 2, c: 3, d: 4, e: 5 };
```
合并对象

```js
let obj1 = { a: 1, b: 2,c: 3 }
let obj2 = { b: 4, c: 5, d: 6}
let merged = {...obj1, ...obj2};
```

4. React

将对象全部传入组件

```js
const parmas =  {value1: 1, value2: 2, value3: 3}

<Test {...parmas} />
```

## 双冒号运算符

```js
foo::bar;
// 等同于
bar.bind(foo);

foo::bar(...arguments);
// 等同于
bar.apply(foo, arguments);
```
如果双冒号左边为空，右边是一个对象的方法，则等于将该方法绑定在该对象上面。

```js
var method = obj::obj.foo;
// 等同于
var method = ::obj.foo;

let log = ::console.log;
// 等同于
var log = console.log.bind(console);
```
## 解构赋值

1. 对象的基本解构

```js
componentWillReceiveProps(newProps) {
	this.setState({
		active: newProps.active
	})
}

componentWillReceiveProps({ active }) {
	this.setState({ active })
}
```
2. 对象深度解构

```js
// bad
function test(fruit) {
  if (fruit && fruit.name)  {
    console.log (fruit.name);
  } else {
    console.log('unknown');
  }
}

// good
function test({name} = {}) {
  console.log (name || 'unknown');
}
```
3. 数组解构

```js
// good
const [language, country] = locale.splite('-');
```
4. 变量重命名

```js
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
console.log(baz); // "aaa"
```
5. 仅获取部分属性

```js
function test(input) {
  return [left, right, top, bottom];
}
const [left, __, top] = test(input);

function test(input) {
  return { left, right, top, bottom };
}
const { left, right } = test(input);
```

## 增强的对象字面量

```js
// bad
const something = 'y'
const x = {
  something: something
}

// good
const something = 'y'
const x = {
  something
};
```
动态属性

```js
const x = {
  ['a' + '_' + 'b']: 'z'
}

console.log(x.a_b); // z
```

## 数组的拓展方法

常考的，数组新增方法有哪些

1. keys

```js
var arr = ["a", , "c"];

var sparseKeys = Object.keys(arr);
console.log(sparseKeys); // ['0', '2']

var denseKeys = [...arr.keys()];
console.log(denseKeys);  // [0, 1, 2]
```
2. entries

```js
var arr = ["a", "b", "c"];
var iterator = arr.entries();

for (let e of iterator) {
    console.log(e);
}
```
3. values

```js
let arr = ['w', 'y', 'k', 'o', 'p'];
let eArr = arr.values();

for (let letter of eArr) {
  console.log(letter);
}
```
4. includes

```js
// good
function test(fruit) {
  const redFruits = ['apple', 'strawberry', 'cherry', 'cranberries'];
  if (redFruits.includes(fruit)) {
    console.log('red');
  }
}
```
5. find

```js
var inventory = [
    {name: 'apples', quantity: 2},
    {name: 'bananas', quantity: 0},
    {name: 'cherries', quantity: 5}
];
console.log(inventory.find(findCherries)); // { name: 'cherries', quantity: 5 }
```
6. findIndex

```js
console.log([4, 6, 8, 12].findIndex(isPrime)); // -1, not found
console.log([4, 6, 7, 12].findIndex(isPrime)); // 2
```
参考：
https://www.runoob.com/jsref/jsref-obj-array.html

## optional-chaining 可选链接调用

```js
const obj = {
  foo: {
    bar: {
      baz: 42,
    },
  },
};

const baz = obj?.foo?.bar?.baz; // 42
```
同样支持函数：

```js
function test() {
  return 42;
}
test?.(); // 42

exists?.(); // undefined
```
需要添加 @babel/plugin-proposal-optional-chaining 插件支持

## 18. logical-assignment-operators

## 19. nullish-coalescing-operator 非空合并运算符

```js
a ?? b
// 相当于
(a !== null && a !== void 0) ? a : b

// 举个例子：
var foo = object.foo ?? "default";
// 相当于
var foo = (object.foo != null) ? object.foo : "default";
```

## 20. pipeline-operator

```js
const double = (n) => n * 2;
const increment = (n) => n + 1;

// 没有用管道操作符
double(increment(double(5))); // 22

// 用上管道操作符之后
5 |> double |> increment |> double; // 22
```


## 参考

- ES6 完全使用手册 https://juejin.cn/post/6844903726201700365 & https://github.com/mqyqingfeng/Blog/issues/111
- chodocs https://chodocs.cn/interview/js/
- https://es6.ruanyifeng.com/












