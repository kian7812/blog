# 输出文件分析

https://www.jianshu.com/p/53f370cc8c59

（webpackJsonps是什么）

虽然我们知道了如何使用Webpack ，也大致知道其工作原理，可是你想过Webpack输出的bundle.js是什么样子的吗？为什么原来一个个的模块文件被合并成了一个单独的文件？为什么 bundle.js 能直接运行在浏览器中？

先来看看最简单的项目构建出的bundle.js文件内容，代码如下：

```js
(
    // webpackBootstrap 启动函数
    // modules 即为存放所有模块的数组，数组中的每一个元素都是一个函数
    function (modules) {
        // 安装过的模块都存放在这里面
        // 作用是把已经加载过的模块缓存在内存中，提升性能
        var installedModules = {};

        // 去数组中加载一个模块，moduleId 为要加载模块在数组中的 index
        // 作用和 Node.js 中 require 语句相似
        function __webpack_require__(moduleId) {
            // 如果需要加载的模块已经被加载过，就直接从内存缓存中返回
            if (installedModules[moduleId]) {
                return installedModules[moduleId].exports;
            }

            // 如果缓存中不存在需要加载的模块，就新建一个模块，并把它存在缓存中
            var module = installedModules[moduleId] = {
                // 模块在数组中的 index
                i: moduleId,
                // 该模块是否已经加载完毕
                l: false,
                // 该模块的导出值
                exports: {}
            };

            // 从 modules 中获取 index 为 moduleId 的模块对应的函数
            // 再调用这个函数，同时把函数需要的参数传入
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            // 把这个模块标记为已加载
            module.l = true;
            // 返回这个模块的导出值
            return module.exports;
        }

        // Webpack 配置中的 publicPath，用于加载被分割出去的异步代码
        __webpack_require__.p = "";

        // 使用 __webpack_require__ 去加载 index 为 0 的模块，并且返回该模块导出的内容
        // index 为 0 的模块就是 main.js 对应的文件，也就是执行入口模块
        // __webpack_require__.s 的含义是启动模块对应的 index
        return __webpack_require__(__webpack_require__.s = 0);

    })(

    // 所有的模块都存放在了一个数组里，根据每个模块在数组的 index 来区分和定位模块
    [
        /* 0 */
        (function (module, exports, __webpack_require__) {
            // 通过 __webpack_require__ 规范导入 show 函数，show.js 对应的模块 index 为 1
            const show = __webpack_require__(1);
            // 执行 show 函数
            show('Webpack');
        }),
        /* 1 */
        (function (module, exports) {
            function show(content) {
                window.document.getElementById('app').innerText = 'Hello,' + content;
            }
            // 通过 CommonJS 规范导出 show 函数
            module.exports = show;
        })
    ]
);
```
以上看上去复杂的代码其实是一个立即执行函数，`可以简写为如下`：
```js
(function(modules) {
  // 模拟 require 语句
  function __webpack_require__() {
  }
  // 执行存放所有模块数组中的第0个模块
  __webpack_require__(0);

})([/*存放所有模块的数组*/])
```

bundle.js能直接运行在浏览器中的原因在于输出的文件中通过__webpack_require__函数定义了一个可以在浏览器中执行的加载函数来模拟Node.js中的require语句。

原来一个个独立的模块文件被合并到了一个单独的bundle.js的原因在于浏览器不能像Node.js那样快速地去本地加载一个个模块文件，而`必须通过网络请求去加载还未得到的文件`。 如果模块数量很多，加载时间会很长，`因此把所有模块都存放在了数组中，执行一次网络加载`。

如果仔细分析__webpack_require__函数的实现，你还有发现Webpack做了缓存优化：`执行加载过的模块不会再执行第二次，执行结果会缓存在内存中，当某个模块第二次被访问时会直接去内存中读取被缓存的返回值`。

**分割代码时的输出**

例如把源码中的main.js修改为如下：

```js
// 异步加载 show.js
import('./show').then((show) => {
  // 执行 show 函数
  show('Webpack');
});
```
重新构建后会输出两个文件，`分别是执行入口文件bundle.js和异步加载文件0.bundle.js`。

**0.bundle.js内容如下：**
```js
// 加载在本文件(0.bundle.js)中包含的模块
webpackJsonp(
  // 在其它文件中存放着的模块的 ID
  [0],
  // 本文件所包含的模块
  [
    // show.js 所对应的模块
    (function (module, exports) {
      function show(content) {
        window.document.getElementById('app').innerText = 'Hello,' + content;
      }
      module.exports = show;
    })
  ]
);
```
**bundle.js内容如下：**

```js
(function (modules) {
  /***
   * webpackJsonp 用于从异步加载的文件中安装模块。
   * 把 webpackJsonp 挂载到全局是为了方便在其它文件中调用。
   *
   * @param chunkIds 异步加载的文件中存放的需要安装的模块对应的 Chunk ID
   * @param moreModules 异步加载的文件中存放的需要安装的模块列表
   * @param executeModules 在异步加载的文件中存放的需要安装的模块都安装成功后，需要执行的模块对应的 index
   */
  window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
    // 把 moreModules 添加到 modules 对象中
    // 把所有 chunkIds 对应的模块都标记成已经加载成功 
    var moduleId, chunkId, i = 0, resolves = [], result;
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (installedChunks[chunkId]) {
        resolves.push(installedChunks[chunkId][0]);
      }
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId];
      }
    }
    while (resolves.length) {
      resolves.shift()();
    }
  };

  // 缓存已经安装的模块
  var installedModules = {};

  // 存储每个 Chunk 的加载状态；
  // 键为 Chunk 的 ID，值为0代表已经加载成功
  var installedChunks = {
    1: 0
  };

  // 模拟 require 语句，和上面介绍的一致
  function __webpack_require__(moduleId) {
    // ... 省略和上面一样的内容
  }

  /**
   * 用于加载被分割出去的，需要异步加载的 Chunk 对应的文件
   * @param chunkId 需要异步加载的 Chunk 对应的 ID
   * @returns {Promise}
   */
  __webpack_require__.e = function requireEnsure(chunkId) {
    // 从上面定义的 installedChunks 中获取 chunkId 对应的 Chunk 的加载状态
    var installedChunkData = installedChunks[chunkId];
    // 如果加载状态为0表示该 Chunk 已经加载成功了，直接返回 resolve Promise
    if (installedChunkData === 0) {
      return new Promise(function (resolve) {
        resolve();
      });
    }

    // installedChunkData 不为空且不为0表示该 Chunk 正在网络加载中
    if (installedChunkData) {
      // 返回存放在 installedChunkData 数组中的 Promise 对象
      return installedChunkData[2];
    }

    // installedChunkData 为空，表示该 Chunk 还没有加载过，去加载该 Chunk 对应的文件
    var promise = new Promise(function (resolve, reject) {
      installedChunkData = installedChunks[chunkId] = [resolve, reject];
    });
    installedChunkData[2] = promise;

    // 通过 DOM 操作，往 HTML head 中插入一个 script 标签去异步加载 Chunk 对应的 JavaScript 文件
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    script.timeout = 120000;

    // 文件的路径为配置的 publicPath、chunkId 拼接而成
    script.src = __webpack_require__.p + "" + chunkId + ".bundle.js";

    // 设置异步加载的最长超时时间
    var timeout = setTimeout(onScriptComplete, 120000);
    script.onerror = script.onload = onScriptComplete;

    // 在 script 加载和执行完成时回调
    function onScriptComplete() {
      // 防止内存泄露
      script.onerror = script.onload = null;
      clearTimeout(timeout);

      // 去检查 chunkId 对应的 Chunk 是否安装成功，安装成功时才会存在于 installedChunks 中
      var chunk = installedChunks[chunkId];
      if (chunk !== 0) {
        if (chunk) {
          chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
        }
        installedChunks[chunkId] = undefined;
      }
    };
    head.appendChild(script);

    return promise;
  };

  // 加载并执行入口模块，和上面介绍的一致
  return __webpack_require__(__webpack_require__.s = 0);
})
(
  // 存放所有没有经过异步加载的，随着执行入口文件加载的模块
  [
    // main.js 对应的模块
    (function (module, exports, __webpack_require__) {
      // 通过 __webpack_require__.e 去异步加载 show.js 对应的 Chunk
      __webpack_require__.e(0).then(__webpack_require__.bind(null, 1)).then((show) => {
        // 执行 show 函数
        show('Webpack');
      });
    })
  ]
);
```

这里的bundle.js和上面所讲的bundle.js非常相似，区别在于：

- 多了一个__webpack_require__.e用于加载被分割出去的，需要异步加载的Chunk对应的文件;
- 多了一个webpackJsonp函数用于从异步加载的文件中安装模块。

在使用了CommonsChunkPlugin去提取公共代码时输出的文件和使用了异步加载时输出的文件是一样的，都会有__webpack_require__.e和webpackJsonp。 原因在于提取公共代码和异步加载本质上都是代码分割。

