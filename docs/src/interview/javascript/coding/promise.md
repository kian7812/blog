# Promise 实现

参考：https://github.com/yuanyuanbyte/Promise/blob/main/myPromiseFully.js

```js
class MyPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(func) {
    this.PromiseState = MyPromise.PENDING;
    this.PromiseResult = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error)
    }
  }

  resolve(result) {
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.FULFILLED;
      this.PromiseResult = result;
      this.onFulfilledCallbacks.forEach(callback => {
        callback(result)
      })
    }
  }

  // PromiseResult = reason
  reject(reason) {
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.REJECTED;
      this.PromiseResult = reason; // reason
      this.onRejectedCallbacks.forEach(callback => {
        callback(reason)
      })
    }
  }

  /**
   * [注册fulfilled状态/rejected状态对应的回调函数] 
   * @param {function} onFulfilled  fulfilled状态时 执行的函数
   * @param {function} onRejected  rejected状态时 执行的函数 
   * @returns {function} newPromsie  返回一个新的promise对象
   */
  then(onFulfilled, onRejected) {
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.PromiseState === MyPromise.FULFILLED) {
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== 'function') {
              resolve(this.PromiseResult);
            } else {
              let x = onFulfilled(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.PromiseState === MyPromise.REJECTED) {
        setTimeout(() => {
          try {
            if (typeof onRejected !== 'function') {
              reject(this.PromiseResult);
            } else {
              let x = onRejected(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (e) {
            reject(e)
          }
        });
      } else if (this.PromiseState === MyPromise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onFulfilled !== 'function') {
                resolve(this.PromiseResult);
              } else {
                let x = onFulfilled(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onRejected !== 'function') {
                reject(this.PromiseResult);
              } else {
                let x = onRejected(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    })

    return promise2
  }

  /**
   * Promise.prototype.catch()
   * @param {*} onRejected 
   * @returns 
   */
  catch (onRejected) {
    return this.then(undefined, onRejected)
  }

  /**
   * Promise.prototype.finally()
   * @param {*} callBack 无论结果是fulfilled或者是rejected，都会执行的回调函数
   * @returns 
   */
  finally(callBack) {
    return this.then(callBack, callBack)
  }

  /**
   * Promise.resolve()
   * @param {[type]} value 要解析为 Promise 对象的值 
   */
  static resolve(value) {
    // 如果这个值是一个 promise ，那么将返回这个 promise 
    if (value instanceof MyPromise) {
      return value;
    } else if (value instanceof Object && 'then' in value) { // 参数是thenable对象情况
      // 如果这个值是thenable（即带有`"then" `方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；
      return new MyPromise((resolve, reject) => {
        value.then(resolve, reject);
      })
    }

    // 否则返回的promise将以此值完成，即以此值执行`resolve()`方法 (状态为fulfilled)
    return new MyPromise((resolve) => {
      resolve(value)
    })
  }

  /**
   * Promise.reject()
   * @param {*} reason 表示Promise被拒绝的原因
   * @returns 
   */
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    })
  }

  /**
   * Promise.all()
   * @param {iterable} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
   * @returns 
   */
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        let result = []; // 存储结果
        let count = 0; // 计数器

        // 如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的 Promise
        if (promises.length === 0) {
          return resolve(promises);
        }

        promises.forEach((item, index) => {
          // MyPromise.resolve方法中已经判断了参数是否为promise与thenable对象，所以无需在该方法中再次判断
          MyPromise.resolve(item).then(
            value => {
              count++;
              // 每个promise执行的结果存储在result中
              result[index] = value;
              // Promise.all 等待所有都完成（或第一个失败）
              count === promises.length && resolve(result);
            },
            reason => {
              /**
               * 如果传入的 promise 中有一个失败（rejected），
               * Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其它 promise 是否完成
               */
              reject(reason);
            }
          )
        })
      } else {
        return reject(new TypeError('Argument is not iterable'))
      }
    })
  }

  /**
   * Promise.allSettled()
   * @param {iterable} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
   * @returns 
   */
  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
    // 参数校验
    if (Array.isArray(promises)) {
      let result = []; // 存储结果
      let count = 0; // 计数器

      // 如果传入的是一个空数组，那么就直接返回一个resolved的空数组promise对象
      if (promises.length === 0) return resolve(promises);

        promises.forEach((item, index) => {
          // 非promise值，通过Promise.resolve转换为promise进行统一处理
          MyPromise.resolve(item).then(
            value => {
              count++;
              // 对于每个结果对象，都有一个 status 字符串。如果它的值为 fulfilled，则结果对象上存在一个 value 。
              result[index] = {
                status: 'fulfilled',
                value
              }
              // 所有给定的promise都已经fulfilled或rejected后,返回这个promise
              count === promises.length && resolve(result);
            },
            reason => {
              count++;
              /**
               * 对于每个结果对象，都有一个 status 字符串。如果值为 rejected，则存在一个 reason 。
               * value（或 reason ）反映了每个 promise 决议（或拒绝）的值。
               */
              result[index] = {
                status: 'rejected',
                reason
              }
              // 所有给定的promise都已经fulfilled或rejected后,返回这个promise
              count === promises.length && resolve(result);
            }
          )
        })
      } else {
        return reject(new TypeError('Argument is not iterable'))
      }
    })
  }

  /**
   * Promise.any()
   * @param {iterable} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
   * @returns 
   */
  static any(promises) {
    return new MyPromise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        let errors = []; // 
        let count = 0; // 计数器

        // 如果传入的参数是一个空的可迭代对象，则返回一个 已失败（already rejected） 状态的 Promise。
        if (promises.length === 0) return reject(new AggregateError([], 'All promises were rejected'));

        promises.forEach(item => {
          // 非Promise值，通过Promise.resolve转换为Promise
          MyPromise.resolve(item).then(
            value => {
                // 只要其中的一个 promise 成功，就返回那个已经成功的 promise 
                resolve(value);
            },
            reason => {
              count++;
              errors.push(reason);
              /**
               * 如果可迭代对象中没有一个 promise 成功，就返回一个失败的 promise 和AggregateError类型的实例，
               * AggregateError是 Error 的一个子类，用于把单一的错误集合在一起。
               */
              count === promises.length && reject(new AggregateError(errors, 'All promises were rejected'));
            }
          )
        })
      } else {
        return reject(new TypeError('Argument is not iterable'))
      }
    })
  }

  /**
   * Promise.race()
   * @param {iterable} promises 可迭代对象，类似Array。详见 iterable。
   * @returns 
   */
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        // 如果传入的迭代promises是空的，则返回的 promise 将永远等待。
        if (promises.length > 0) {
          promises.forEach(item => {
            /**
             * 如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，
             * 则 Promise.race 将解析为迭代中找到的第一个值。
             */
            MyPromise.resolve(item).then(resolve, reject);
          })
        }
      } else {
        return reject(new TypeError('Argument is not iterable'))
      }
    })
  }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    throw new TypeError('Chaining cycle detected for promise');
  }

  if (x instanceof MyPromise) {
    x.then(y => {
      resolvePromise(promise2, y, resolve, reject)
    }, reject);
  } else if (x !== null && ((typeof x === 'object' || (typeof x === 'function')))) { // 参数是thenable对象情况
    try {
      var then = x.then;
    } catch (e) {
      return reject(e);
    }

    if (typeof then === 'function') {
      let called = false;
      try {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        )
      } catch (e) {
        if (called) return;
        called = true;

        reject(e);
      }
    } else {
      resolve(x);
    }
  } else {
    return resolve(x);
  }
}

MyPromise.deferred = function () {
  let result = {};
  result.promise = new MyPromise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
}

module.exports = MyPromise;
```


## onFulfilledCallbacks onRejectedCallbacks

解决场景：

```js
const promise1 = new Promise((resolve, reject) => {})
promise1.then((res) => {})
promise1.then((res) => {})
promise1.then((res) => {})
promise1.then((res) => {})
promise1.catch((res) => {})
promise1.catch((res) => {})
promise1.catch((res) => {})
```


## 2.3 Promise 解决过程

https://juejin.cn/post/7043758954496655397#heading-14

- 2.3.1 x 与 promise 相等
  - 循环引用，报错
- 2.3.2 x 为 Promise
  - 返回结果promise则继续resolvePromise
- 2.3.3 x 为对象或函数
  - 应该是 thenable 的特性，先省略这步骤。
- 2.3.4 如果 x 不为对象或者函数
  - resolve(x)


## 参考

- *圆圆详细完整 https://juejin.cn/post/7043758954496655397 & https://juejin.cn/post/7044088065874198536
  - https://promisesaplus.com/
  - https://malcolmyu.github.io/2015/06/12/Promises-A-Plus/
  - https://www.bilibili.com/video/BV1RR4y1p7my
  - https://www.jianshu.com/p/459a856c476f
  - https://www.cnblogs.com/dennisj/p/12660388.html
  - https://github.com/xieranmaya/blog/issues/3
  - https://juejin.cn/post/6945319439772434469
  - https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
  - https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch


- 没2.3.3 https://juejin.cn/post/6860037916622913550
- 相对简单(没2.3.3)
  - https://juejin.cn/post/6994594642280857630
  - https://github.com/qianlongo/fe-handwriting/blob/master/11.promise.js
