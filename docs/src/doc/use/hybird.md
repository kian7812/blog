# Hybird

## PC与H5互跳流程

H5的地址复制到PC端打开，需跳转到对应的PC端的页面。
在全局路由守卫做判断，如果发现在PC端打开了，就调PC端对应的页面。

- Hybird APP内嵌H5开发JSBridge通信（使用JS注入的方案）
  - 前提前端需要知道在APP内访问，APP 在Webview的userAgent上加标识，前端根据标识判断 isApp，或者在地址上加标识参数。

- 前端发送数据到APP端
  - APP在打开的时候，操作 Webview 注入JS对象，前端可以该对象上的方法，给APP发送数据，因为JS对象是在Webview打开前端页面前注入的，所以这些APP注入的通信方法，前端调用时肯定是存在的，同时前端调用APP注入的方法是同步的，这些通过方法是挂载到window上的。

- APP发送数据到前端
  - 方式也是APP调用前端挂载到window上的JS方法，APP的调用时机在前端看来是不确定的，所以有些通信需要前端先发起告知，APP接到通知，再发送数据，同时在前端看来这个过程会存在异步的情况；
  - 比如APP传给前端token等信息，会影响到前端页面请求数据，所以这块采用异步处理（Promise），等拿到token后再进行后面的流程，目前前端项目会在页面初始化路由跳转前做一次获取token通信。


APP初次访问前端页面，采用的方案是，跳转到一个前端固定路由地址，前端和APP协商好一些pageNumber，来确定具体调转到前端哪个页面并拼接参数，意思是前端自己做路由分发，这样可能会增加一些前端自由度和沟通成本。