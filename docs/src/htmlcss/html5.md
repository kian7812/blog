# HTML5

## 文档声明

```html
<!DOCTYPE html>
```

**文档声明作用：**

声明于html文档中第一行，告知浏览器的解析器用什么文档标准解析这个文档。

## HTML5 新特性

- 新语义标签的引入，取消了过时的显示效果标记
- HTML多媒体元素引入（video、audio）
- 新表单控件引入（date、time...）
- canvas标签（图形设计）
- 本地数据库（本地存储）
- 对本地离线存储有更好的支持
- 一些API（文件读取、地址位置、网络信息...）

## 语义化的理解

- 用正确的标签做正确的事情！
- html语义化就是让页面的内容结构化，便于对浏览器、搜索引擎解析；
- 搜索引擎的爬虫依赖于标记来确定上下文和各个关键字的权重，利于 SEO。
- 使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。

## 新语义标签

```html
  <header></header>     // 页眉
  <nav></nav>           // 导航
  <section></section>   // 文档的节
  <article></article>   // 文章
  <aside></aside>       // 侧边栏
  <main></main>         // 主要内容
  <footer></footer>     // 页脚
  ....
``` 

## 多媒体标签

### video
支持三种视频格式：MP4、WebM、Ogg

可以通过source标签设置兼容格式：
```html
 <video>
    <source src="trailer.mp4">
    <source src="trailer.ogg">
    <source src="trailer.WebM">
    Your browser does not support the video tag.
</video>

```

**标签属性有：**

- src： 视频URL
- width： 宽
- height： 高
- autoplay： 是否自动播放
- controls： 是否展示控件
- loop： 是否循环播放
- preload： 是否在页面加载后载入视频
  - auto： 当页面加载后载入整个视频
  - meta： 当页面加载后只载入元数据
  - none： 当页面加载后不载入视频


**其它标签属性：**
- object-fit：属性指定可替换元素的(视频)内容应该如何适应到其使用的高度和宽度确定的框。
- playsinline：ios平台下的内联播放属性（使视频不脱离文本流）-webkit-playsinline。

- dom属性：currentTime、duration、还有标签属性；
- dom方法：play()、pause()、load()；
- dom事件：waiting、canplay、timeupdate、ended、error、pause、play、playing、seeked

**X5内核视频：安卓默认全屏播放**
属性：x5-playsinline页面内播放/内联播放、x5-video-player-type同层播放/html元素能浮在上面
事件：x5videoenterfullscreen、x5videoexitfullscreen

### audio 通用同video

目前audio提供了三种音频格式：Ogg、MP3、Wav。

```html
<audio controls="controls">
  <source src="song.ogg" type="audio/ogg">
  <source src="song.mp3" type="audio/mpeg">
    Your browser does not support the audio tag.
</audio>

```

## 新的输入类型

input标签通过type可以对输入类型进行限制，增加了type类型：

- email: 输入合法的邮箱地址
- url： 输入合法的网址
- number： 只能输入数字
- range： 滑块
- color： 拾色器
- date： 显示日期
- month： 显示月份
- week ： 显示第几周
- time： 显示时间

## 新的表单属性

**新的form属性：**

- autocomplete：on｜off 自动完成输入
- novalidate： true｜false 是否关闭校验，目前支持程度非常低。

**新的input属性：**

- autofocus： 自动获取焦点
- multiple：	 实现多选效果
- required： 必填项
- placeholder： 输入框内的提示
- pattern: 进行验证，正则表达式。
- form： 规定所属的表单，引用所属表单的id。
- list： 属性规定输入域的 datalist。
- min、max、step： 最小值、最大值、合法间隔

```html
<input type="text" list="abc"/>
<datalist id="abc">
  <option value="123">12312</option>
  <option value="123">12312</option>
  <option value="123">12312</option>
  <option value="123">12312</option>
</datalist>

```

## 获取页面元素

- document.querySelector("选择器")： 通过css选择器选中第一个符合要求的元素
- document.querySelectorAll("选择器")：返回所有符合选择器的元素数组
- Dom.classList.add("类名")：给当前dom元素添加类样式
- Dom.classList.remove("类名")： 给当前dom元素移除类样式
- Dom.classList.contains("类名")：检测是否包含类样式
- Dom.classList.toggle("active")：切换类样式（有就删除，没有就添加）

## 自定义属性

自定义属性：data-自定义属性名

- 获取自定义属性：Dom.dataset返回的是一个对象，Dom.dataset.属性名或者Dom.dataset[属性名]
- 设置自定义属性：Dom.dataset.自定义属性名=值  或者  Dom.dataset[自定义属性名]=值

一个例子：

```js
<!--html-->
<div id="myData" data-source="qwer"></div>
<!--js-->
document.querySelector('# myData').dataset.source === 'qwer'  // true
```

## Web存储

HTML提供了两种在客户端存储数据的新方法：

- localStorage --没有时间限制的数据存储
- sessionStorage   --有时间限制的数据存储

之前都是由cookie完成的，但cookie不适合大量数据的存储一般只有4KB的空间大小，每次http请求都会携带cookie。

**localStorage**

- 存储空间一般为20M
- 仅在客户端（即浏览器）中保存，不参与和服务器的通信；不会自动把数据发送给服务器，仅在本地保存
- 永久有效
- 多窗口共享

方法：

- localStorage.setItem(key, value)： 存储值
- localStorage.getItem(key)： 获取值
- localStorage.removeItem("key")：删除指定键
- localStorage.clear()： 清空数据

一般用来保存长久数据。

**sessionStorage**

- 存储空间一般为5M
- 仅在客户端（即浏览器）中保存，不参与和服务器的通信；不会自动把数据发送给服务器，仅在本地保存
- 生命周期为关闭当前浏览器窗口
- 可以在同一个窗口下访问

方法：

- sessionStorage.setItem("key", "value")： 存储
- sessionStorage.getItem("key")： 读取
- sessionStorage.removeItem("key")： 删除指定键
- sessionStorage.clear()： 清空数据

一般用于一次性登录敏感数据的存储。

**共同点**

cookie、sessionStorage、localStorage共同点：

- 都遵循同源协议
- 都可以被用来在浏览器存储数据，而且都是字符串类型的键值对

## 应用缓存（离线缓存）

使用 HTML5，通过创建 cache manifest 文件，可以轻松地创建 web 应用的离线版本。

如需启用应用程序缓存，请在文档的标签中包含 manifest 属性，并设置manifest文件地址：

```html
<!DOCTYPE HTML>
<html manifest="demo.appcache">
...
</html>
```

**manifest 文件可分为三个部分：**
- CACHE MANIFEST - 在此标题下列出的文件将在首次下载后进行缓存
- NETWORK - 在此标题下列出的文件需要与服务器的连接，且不会被缓存
- FALLBACK - 在此标题下列出的文件规定当页面无法访问时的回退页面（比如 404 页面）

**一个完整的Manifest文件：**

```
CACHE MANIFEST
/theme.css
/logo.gif
/main.js

NETWORK:
login.asp

FALLBACK:
/html5/ /404.html

```

注：一旦文件被缓存，则浏览器会继续展示已缓存的版本，即使您修改了服务器上的文件。为了确保浏览器更新缓存，您需要更新 manifest 文件。

## Web Worker

JavaScript是单线程语言，所有任务只能在一个线程上完成。随着电脑能力的增强，尤其是CPU多核，单线程无法充分发挥计算机的能力。

Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。

**Web Worker基本知识点**

在JavaScript主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢。

WebWorker有几个注意点：

- 同源限制。必须与主线程的脚本文件同源。
- DOM限制。Worker线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用- document、window、parent这些对象。但是，Worker 线程可以navigator对象和location对象。
- 通信联系。Worker线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。
- 脚本限制。Worker线程不能执行alert()方法和confirm()方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。
- 文件限制。Worker 线程无法读取本地文件，它所加载的脚本，必须来自网络。

**主线程**

Worker()：用来生成Worker线程。

- 第一个参数是脚本的网址（必需）var myWorker = new Worker(jsUrl, options);
- 第二个参数是可选配置对象。其中一个作用是指定Worker的名称：
  - 主线程：var myWorker = new Worker('worker.js', { name : 'myWorker' });
  - Worker线程：self.name // myWorker

**Worker构造函数返回一个Worker线程对象，属性和方法如下：**

- Worker.onerror：指定 error 事件的监听函数。
- Worker.onmessage：指定message事件的监听函数，发送过来的数据在Event.data属性中。
- Worker.onmessageerror：指定messageerror事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
- Worker.postMessage()：向 Worker 线程发送消息。
- Worker.terminate()：立即终止 Worker 线程。


**Worker线程**

Web Worker 有自己的全局对象，不是主线程的window，而是一个专门为 Worker 定制的全局对象。因此定义在window上面的对象和方法不是全部都可以使用。

Worker 线程有一些自己的全局属性和方法：

- self.name： Worker 的名字。该属性只读，由构造函数指定。
- self.onmessage：指定message事件的监听函数。
- self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
- self.close()：关闭 Worker 线程。
- self.postMessage()：向产生这个 Worker 线程发送消息。
- self.importScripts()：加载 JS 脚本，可以同时加载多个脚本。

##  新增API

HTML5还新增了多种API扩充Web功能。

### 获取网络状态

`window.navigator.onLine`： 返回浏览器的联网状态，正常联网（在线）返回 true，不正常联网（离线）返回 false。

对应两个事件：

- window.ononline： 当浏览器在联机和脱机模式之间切换时，会在每个页面的触发online事件。这些事件从document.body，到document结束于window。
  - 使用window，document或document.body的addEventListener方法来进行监听
- window.onoffline：在navigator.onLine 属性更改并变为 false时，在 body或冒泡到body上的offline事件被触发。

### 文件读取

**使用 FileReader() 构造器去创建一个新的 FileReader。**

接口有三个用于读取文件的方法，返回结果在result中：

- readAsText：将文件读取为文本
- readAsBinaryString： 将文件读取为二进制编码
- readAsDataURL：将文件读取为DataURL

FileReader 提供的事件模型：

- onabort：中断时触发
- onerror：出错时触发
- onload：文件读取成功完成时触发
- onloadend：读取完成触发，无论成功或失败
- onloadstart：读取开始时触发
- onprogress：读取中

一个简易的读取上传图片并渲染操作：

```js
<!--html-->
<input type="file" name="image" >

<!--js-->
const file_input = document.querySelector('input');
file_input.onChange = function() {
    <!--获取上传图片-->
    const file = this.files[0];
    
    <!--创建新的FileReader-->
    const reader = new FileReader();
    <!--将文件读取为DataUrl格式-->
    reader.readAsDataURL(file);
    <!--读取成功回调函数-->
    reader.onload = function() {
        const img = document.createElement('img');
        <!--将读取结果存入img标签的src属性-->
        img.src = reader.result;
        document.body.appendChild(img);
    }
}
```

###  获取地理位置
`window.navigator.geolocation.getCurrentPosition(success, error)`： 获取当前用户位置

- 第一参数为获取成功时的回调函数，返回对象，包含用户地理信息：
  - coords.latitude： 纬度
  - coords.longitude： 经度
  - ...

- 第二参数为获取用户地理位置失败或被拒绝的处理函数。

`window.navigator.geolocation.watchPosition(success,error)`：实时获取用户的位置信息。

`clearWatch()`方法停止watchPosition方法。


## 字体(@font-face)

## 参考

- :+1: [HTML5、CSS3完全使用手册（万字详解）](https://juejin.cn/post/6844904147590856717)