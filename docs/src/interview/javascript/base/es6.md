
# ES6+ 

## Promise 是什么

Promise 是一个 ECMAScript 6 提供的类，目的是更加优雅地书写复杂的异步任务。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers）。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的 promise 对象。

关键点：

1. Promise 对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）
2. Promise 构造函数接收一个函数作为参数，该函数的两个参数分别是 resolve 和 reject
3. 一个 promise 对象只能改变一次状态，成功或者失败后都会返回结果数据。
4. then 方法可以接收两个回调函数作为参数，第一个回调函数是 Promise 对象的状态改变为 resoved 是调用，第二个回调函数是 Promise 对象的状态变为 rejected 时调用。其中第二个参数可以省略。
5. catch 方法，该方法相当于最近的 then 方法的第二个参数，指向 reject 的回调函数，另一个作用是，在执行 resolve 回调函数时，如果出错，抛出异常，不会停止陨星，而是进入 catch 方法中。

### 除了 then 块以外，其它两种块能否多次使用？

可以，finally 与 then 一样会按顺序执行，但是 catch 块只会执行第一个，除非 catch 块里有异常。所以最好只安排一个 catch 和 finally 块。

### then 块如何中断？

then 块默认会向下顺序执行，return 是不能中断的，可以通过 throw 来跳转至 catch 实现中断。

### 什么是 async/await

async/await 是以更舒适的方式使用 promise 的一种特殊语法，同时它也非常易于理解和使用。

关键点：

1. async 确保了函数返回一个 promise，也会将非 promise 的值包装进去。
2. await 的关键词，它只在 async 函数内工作，语法是：let value = await promise; 让 JavaScript 引擎等待直到 promise 完成（settle）并返回结果。
3. 如果有 error，就会抛出异常 —— 就像那里调用了 throw error 一样。否则，就返回结果。

## 

常考的，比如简单列举，数组方法有哪些，以及 Set、Map、Proxy 等 ES6 方法

对于数组方法、字符串方法等还不熟悉的朋友，可以访问 https://www.runoob.com/jsref/jsref-obj-array.html

Set: ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。关于 set 的使用：可以通过链式的使用 add 添加值，可以使用 has 方法检查 Set 实例中是否存在特定的值，可以使用 size 属性获得 Set 实例的长度，使用 clear 方法删除 Set 中的数据。

WeakSet： 与 Set 类似，也是不重复的值的集合。但是 WeakSet 的成员只能是对象，而不能是其他类型的值。WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用。

Map：它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

WeakMap：与 Map 结构类似，也是用于生成键值对的集合。但是 WeakMap 只接受对象作为键名（ null 除外），不接受其他类型的值作为键名。而且 WeakMap 的键名所指向的对象，不计入垃圾回收机制。

Proxy：Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写（一种中介者模式）。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

ES6 新特性，涉及的内容会比较多，暂时不准备专门出一篇讲，已经有总结得很好的网站了 https://es6.ruanyifeng.com/ ，如果还没掌握的强烈建议多看几遍咯。一般面试，其实就要你说一说你了解的 ES6 的哪些东西，然后面试官再挑其中的一两个问，所以也不用太纠结部分不记得



## 参考

-  *chodocs https://chodocs.cn/interview/js/