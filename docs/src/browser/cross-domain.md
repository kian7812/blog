# 跨域


## 同源策略

地址里面的协议、域名和端口号都相同则属于同源。

这是用于保护用户数据的安全，防止恶意访问。

同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个ip地址，也非同源。
注：二级域名不同也算，因为判断源是否相同时，是根据URL判断的

如果非同源，共有三种行为受到限制。

1. Cookie、LocalStorage 和 IndexDB 无法读取。
2. Dom 无法操作
3. Ajax 不能发送

## 有三个标签是允许跨域加载资源：

```
* <img src=XXX>
* <link href=XXX>
* <script src=XXX>
```


### JS跨域请求的方式？
1、通过修改document.domain来跨子域

2、使用window.name来进行跨域

3、使用HTML5中新引进的window.postMessage方法来跨域传送数据（ie 67 不支持）

4、通过jsonp跨域  // 这是AJAX请求的跨域

5、CORS跨域，需要服务器设置header ：Access-Control-Allow-Origin。 // 这是AJAX请求的跨域

6、nginx反向代理 这个方法一般很少有人提及，但是他可以不用目标服务器配合，不过需要你搭建一个中转nginx服务器，用于转发请求 // 关键是服务端请求没有跨域限制所以可以实现代理


## cookie实现跨域方式之一

document.domain设置同一父域名
对于同一个页面，不同的iframe之间是可以共享window对象，
可以使用document.domain将iframe设置为相同的域。
就可以实现多个iframe之间共享cookie和window对象了。
利用document.domain 实现跨域：
前提条件：这两个域名必须属于同一个基础域名!而且所用的协议，端口都要一致，否则无法利用document.domain进行跨域。

比如在地址栏里输入：
javascript:alert(document.domain); //www.forjj.com
我们也可以给document.domain属性赋值，不过是有限制的，你只能赋成当前的域名或者基础域名。
比如：
javascript:alert(document.domain = "forjj.com"); //forjj.com
javascript:alert(document.domain = "www.forjj.com"); //www.forjj.com
上面的赋值都是成功的，因为www.forjj.com是当前的域名，而forjj.com是基础域名。

但是下面的赋值就会出来"参数无效"的错误：
javascript:alert(document.domain = "cctv.net"); //参数无效
javascript:alert(document.domain = "ttt.forjj.com"); //参数无效

因为cctv.net与ttt.forjj.com不是当前的域名也不是当前域名的基础域名，所以会有错误出现。
这是为了防止有人恶意修改document.domain来实现跨域偷取数据。

## window.name进行跨域
window.name这个浏览器窗口属性最大的特点就是，只要在同一个窗口中，无论是否同源，所有页面都能共享这个属性。每个页面对window.name都有读写的权限
而且window.name可以存储容量比较大，一般有2M（不同浏览器容量不容）

## postMessage跨文档通信API
H5为了解决跨源的问题，引入了一个全新的API,为window新增了一个方法window.postMessage，允许跨窗口通信，无论是否同源。
比如在窗口http://aaa.com中，想要向另一个页面http://bbb.com发送消息。调用postMessage方法即可
// aaa.com中写入
var popup = window.open('http://bbb.com', 'title');
popup.postMessage('Hello World!', 'http://bbb.com');

// bbb中通过message事件监听消息
window.addEventListener('message', function(e) {
  console.log(e.data);
},false);

其中message事件对象event提供三个属性
* event.source：消息来源的地址
* event.origin：消息发向的地址
* event.data：消息内容

## AJAX请求的跨域
针对AJAX请求，有两种跨域方式
1. JSONP 只支持get请求，不支持post请求；兼容性较好
2. CORS 支持所有请求；不兼容老旧浏览器


## jsonp跨域
jsonp是利用script标签可以跨域访问资源的特性，
在页面内动态插入一个script标签，
向服务器发起数据的跨域请求。
服务器收到请求后，将数据放在一个指定名字的回调函数中传回

```js
function addScriptTag(src) {
  var script = document.createElement('script');
  script.setAttribute("type","text/javascript");
  script.src = src;
  document.body.appendChild(script);
}

window.onload = function () {
  addScriptTag('http://example.com/ip?callback=foo');
}

function foo(data) {
  console.log('Your public IP address is: ' + data.ip);
};
```

## cors跨域
cors请求的局限就小很多了，它是一个W3C标准，允许向跨源服务器，发起XMLHttpRequest请求。支持IE10及其以上。
整个CORS通信过程，都是浏览器自动完成，不需要用户参与。
对于开发者来说，CORS通信与同源的AJAX通信没有差别，代码完全一样。浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。
因此，实现CORS通信的关键是服务器。只要服务器实现了CORS接口，就可以跨源通信。

```
cors的话,可控性较强,需要前后端都设置,兼容性 IE10+ ,比如
    * Access-Control-Allow-Origin: http://foo.example // 子域乃至整个域名或所有域名是否允许访问
    * Access-Control-Allow-Methods: POST, GET, OPTIONS // 允许那些行为方法
    * Access-Control-Allow-Headers: X-PINGOTHER, Content-Type // 允许的头部字段
    * Access-Control-Max-Age: 86400 // 有效期

对于想携带一些鉴权信息跨域如何走起?比如cookie!
需要配置下 header Access-Control-Allow-Credentials:true ,

若是我们要用 nginx或者 express 配置cors应该怎么搞起? 来个简易版本的
* nginx
location / {
   # 检查域名后缀
    add_header Access-Control-Allow-Origin xx.xx.com;
    add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
    add_header Access-Control-Allow-Credentials true;
    add_header Access-Control-Allow-Headers DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type;
    add_header Access-Control-Max-Age 86400;
} 

* express, 当然这货也有一些别人封装好的 cors中间件,操作性更强...
let express = require('express');  
let app = express();  

//设置所有请求的头部
app.all('*', (req, res, next) =>  {  
    res.header("Access-Control-Allow-Origin", "xx.xx.com");  
    res.header("Access-Control-Allow-Headers", "DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type");  
    res.header("Access-Control-Allow-Credentials","true")
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    next();  
});  
```


## 请简述跨域的几种方式

## 从源头探讨跨域--同源策略

因为浏览器出于安全考虑，有同源策略。也就是说，如果协议、域名或者端口有一个不同就是跨域，Ajax请求会败。

那么是出于什么安全考虑才会引入这种机制呢？ 其实主要是用来防止 CSRF 攻击的。简单点说，CSRF 攻击是利用用户的登录态发起恶意请求。也就是说，没有同源策略的情况下，A 网站可以被任意其他来源的 Ajax 访问到内容。如果你当前 A网站还存在登录态，那么对方就可以通过 Ajax获得你的任何信息。当然跨域并不能完全阻止CSRF。

## 解决跨域的四种方式

### 1.JSONP

JSONP 的原理很简单，就是利用 `<script> 标签没有跨域限制的漏洞。通过 <script> 标签指向一个需要访问的地址并提供一个回调函数来接收数据当需要通讯时`。

```js
<script src="http://domain/api?param1=a&param2=b&callback=jsonp"></script>
<script>
 function jsonp(data) {
 	console.log(data)
 }
</script>    
```

JSONP使用简单且兼容性不错，但是只限于 get 请求。

### 2.CORS（解决同源限制策略）

CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。
浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。
服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。
虽然设置 CORS 和前端没什么关系，但是通过这种方式解决跨域问题的话，会在发送请求时出现两种情况，分别为
简单请求和复杂请求。


简单请求 - 直接携带数据发出。
以 Ajax 为例，当满足以下条件时，会触发简单请求
使用下列方法之一：
GET
HEAD
POST
Content-Type 的值仅限于下列三者之一：
text/plain
multipart/form-data
application/x-www-form-urlencoded
请求中的任意 XMLHttpRequestUpload 对象均没有注册任何事件监听器； XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问。

那么很显然，不符合以上条件的请求就肯定是复杂请求了。 对于复杂请求来说，首先会发起一个预检请求，该请求是 option 方法的，通过该请求来知道服务端是否允许跨域请求（option请求仅关心是否跨域/是否请求头被允许）。

### 3.docuemnt.domin

仅限主域相同，子域不同的跨域应用场景,将domain提到顶级域名，完成跨域
实现原理：两个页面都通过js强制设置document.domain为基础主域，就实现了同域
MDN: 满足某些限制条件的情况下，页面是可以修改它的源。脚本可以将 document.domain 的值设置为其当前域或其当前域的父域。

### 4.postMessage

这种方式通常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接收消息

```js
// 发送消息端
window.parent.postMessage('message', 'http://test.com')
// 接收消息端
var mc = new MessageChannel()
mc.addEventListener('message', event => {
var origin = event.origin || event.originalEvent.origin
if (origin === 'http://test.com') {
 console.log('验证通过')
}
})

```


## 参考

https://www.jianshu.com/p/2b9db9d0a63d
http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html
http://www.ruanyifeng.com/blog/2016/04/cors.html

```


2）document.domain + iframe跨域

<!-- 父窗口：http://www.domain.com/a.html -->
<iframe id="iframe" src="http://child.domain.com/b.html">
</iframe>


<script>
  document.domain = 'domain.com';    
  var user = 'admin';
</script>


<!-- 子窗口：http://child.domain.com/b.html -->
<script>
  document.domain = 'domain.com';    
  // 获取父窗口中变量
  alert('get js data from parent ---> '+ window.parent.user);
</script>
复制代码
3）location.hash + iframe
实现原理： a欲与b跨域相互通信，通过中间页c来实现。 三个页面，不同域之间利用iframe的location.hash传值，相同域之间直接js访问来通信。
实际就是修改URL的 # 后面部分，我们可以通过监听hashchange事件完成
具体实现： A域：a.html -> B域：b.html -> A域：c.html，
a与b不同域只能通过hash值单向通信，b与c也不同域也只能单向通信，但c与a同域，所以c可通过parent.parent访问a页面所有对象。
4）window.name + iframe跨域
window.name属性的独特之处：name值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。
通过iframe的src属性由外域转向本地域，跨域数据即由iframe的window.name从外域传递到本地域。这个就巧妙地绕过了浏览器的跨域访问限制，但同时它又是安全操作。
5） postMessage跨域
postMessage一般用于解决以下问题
a.） 页面和其打开的新窗口的数据传递
b.） 多窗口之间消息传递
c.） 页面与嵌套的iframe消息传递
d.） 上面三个场景的跨域数据传递
<!-- a页面：http://www.domain1.com/a.html -->
<iframe id="iframe" 
        src="http://www.domain2.com/b.html" 
        style="display:none;">
</iframe>
<script>       
  var iframe = document.getElementById('iframe');
  iframe.onload = function() {        
    var data = {           
      name: 'aym'
    };        
    // 向domain2传送跨域数据
    iframe.contentWindow.postMessage
    (JSON.stringify(data),
     'http://www.domain2.com');
  };    
  // 接受domain2返回数据
  window.addEventListener
  ('message', function(e) {
    alert('data from domain2 ---> ' + e.data);
  }, 
   false);
</script>


<!-- b页面：http://www.domain2.com/b.html -->
<script>
  // 接收domain1的数据
  window.addEventListener
  ('message', function(e) {
    alert('data from domain1 ---> ' + e.data);        
    var data = JSON.parse(e.data);        
    if (data) {
      data.number = 16;            
      // 处理后再发回domain1
      window.parent.postMessage(JSON.stringify(data),
                                'http://www.domain1.com');
    }
  }, false);
</script>
复制代码
6）跨域资源共享（CORS）：主流的跨域解决方案
服务端设置Access-Control-Allow-Origin即可
若要带cookie请求：前后端都需要设置。
前端： : 检查前端设置是否带cookie：xhr.withCredentials = true;
通过这种方式解决跨域问题的话，会在发送请求时出现两种情况，分别为简单请求和复杂请求。
简单请求：
使用下列方法之一：
* GET
* HEAD
* POST
Content-Type 的值仅限于下列三者之一：
* text/plain
* multipart/form-data
* application/x-www-form-urlencoded
不符合以上条件的请求就肯定是复杂请求了。 复杂请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求, 该请求是 option 方法的，通过该请求来知道服务端是否允许跨域请求。
OPTIONS预检请求
请求头：
* Origin：当前请求源，和响应头里的Access-Control-Allow-Origin 对标， 是否允许当前源访问，Origin是不可修改的
* Access-Control-Request-Headers：本次真实请求的额外请求头，和响应头里的Access-Control-Allow-Headers对标，是否允许真实请求的请求头
* Access-Control-Request-Method：本次真实请求的额外方法，和响应头里的Access-Control-Allow-Methods对标，是否允许真实请求使用的请求方法
响应头
* Access-Control-Allow-Credentials：
这里的Credentials（凭证）其意包括：Cookie ，授权标头或 TLS 客户端证书，默认CORS请求是不带Cookies的，这与JSONP不同，JSONP每次请求都携带Cookies的，当然跨域允许带Cookies会导致CSRF漏洞。如果非要跨域传递Cookies，web端需要给ajax设置withCredentials为true，同时，服务器也必须使用Access-Control-Allow-Credentials头响应。此响应头true意味着服务器允许cookies（或其他用户凭据）包含在跨域请求中。另外，简单的GET请求是不预检的，即使请求的时候设置widthCrenditials为true，如果响应头不带Access-Control-Allow-Credentials，则会导致整个响应资源被浏览器忽略。
* Access-Control-Allow-Headers
* Access-Control-Allow-Methods
* Access-Control-Allow-Origin
* Access-Control-Expose-Headers：
在CORS中，默认的，只允许客户端读取下面六个响应头（在axios响应对象的headers里能看到）：
    * Cache-Control
    * Content-Language
    * Content-Type
    * Expires
    * Last-Modified
    * Pragma
如果这六个以外的响应头要是想让客户端读取到，就需要设置Access-Control-Expose-Headers这个为响应头名了，比如Access-Control-Expose-Headers: Token
* Access-Control-Max-Age：设置预检请求的有效时长，就是服务器允许的请求方法和请求头做个缓存。

7）nginx代理跨域
nginx配置解决iconfont跨域
浏览器跨域访问js、css、img等常规静态资源被同源策略许可，但iconfont字体文件(eot|otf|ttf|woff|svg)例外，此时可在nginx的静态资源服务器中加入以下配置。
location / {
  add_header 
  Access-Control-Allow-Origin *;
}
复制代码
反向代理
跨域原理： 同源策略是浏览器的安全策略，不是HTTP协议的一部分。服务器端调用HTTP接口只是使用HTTP协议，不会执行JS脚本，不需要同源策略，也就不存在跨越问题。
通过nginx配置一个代理服务器（域名与domain1相同，端口不同）做跳板机，反向代理访问domain2接口，并且可以顺便修改cookie中domain信息，方便当前域cookie写入，实现跨域登录。
#proxy服务器
server {   
  listen      
  81;    
  server_name  www.domain1.com;    
  location / {        
    proxy_pass
      http://www.domain2.com:8080;  
    #反向代理
    proxy_cookie_domain 
    www.domain2.com www.domain1.com;
    # 修改cookie里域名
    index  index.html index.htm;       
    # 用webpack-dev-server等中间件代理接口访问nignx时，
    # 此时无浏览器参与，故没有同源限制，面的跨域配置可不启用
    add_header Access-Control-Allow-Origin 
    http://www.domain1.com;  
    # 当前端只跨域不带cookie时，可为*
    add_header Access-Control-Allow-Credentials true;
  }
}
复制代码
8）nodejs中间件代理跨域
node中间件实现跨域代理，原理大致与nginx相同，都是通过启一个代理服务器，实现数据的转发，也可以通过设置cookieDomainRewrite参数修改响应头中cookie中域名，实现当前域的cookie写入，方便接口登录认证。
9）WebSocket协议跨域
WebSocket protocol是HTML5一种新的协议。它实现了浏览器与服务器全双工通信，同时允许跨域通讯，是server push技术的一种很好的实现。
原生WebSocket API使用起来不太方便，我们使用Socket.io，它很好地封装了webSocket接口，提供了更简单、灵活的接口，也对不支持webSocket的浏览器提供了向下兼容。
<div>user input：
  <input type="text">
</div>


<script src="./socket.io.js"></script>
<script>var socket = io('
                        http://www.domain2.com:8080');
                        // 连接成功处理
                        socket.on('connect', function() {    
    // 监听服务端消息
    socket.on('message', function(msg) {        
      console.log('data from server: ---> ' + msg); 
    });   
    // 监听服务端关闭
    socket.on('disconnect', function() { 
      console.log('Server socket has closed.'); 
    });
  });
  document.getElementsByTagName('input')
  [0].onblur = function() {
    socket.send(this.value);
  };
 </script>


作者：GhostFJ
链接：https://juejin.cn/post/7088144745788080142
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

https://juejin.cn/post/7088144745788080142