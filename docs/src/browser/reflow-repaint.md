# 回流和重绘

## 浏览器渲染绘制过程，以Webkit的渲染流程为例分析下浏览器，简单概括为如下几步:
* 处理HTML标记数据并生成DOM树。
* 处理CSS标记数据并生成CSSOM树。
* 将DOM树与CSSOM树合并在一起生成渲染树。
* Layout（布局）：计算每个 DOM 元素在最终屏幕上显示的大小和位置。由于 web 页面的元素布局是相对的，所以其中任意一个元素的位置发生变化，都会联动的引起其他元素发生变化，这个过程叫 reflow (回流 or 重排)。
* Paint（绘制）：在多个层上绘制 DOM 元素的的文字、颜色、图像、边框和阴影等。
* composite（渲染层合并）：按照合理的顺序合并图层然后显示到屏幕上。

备注：每一帧的渲染经过如上步骤，呈现在用户的眼前，当这些步骤时间的总和 > 16ms, 用户就会有卡顿感产生。继续深入优化动画及页面渲染相关的继续深入看文章吧

兄dei，听说你动画很卡？：https://juejin.im/post/6844903716500439047


# 说说浏览器的reflow和repaint

```
浏览器解析过程
1.解析html生成dom树
2.解析css
3.把css应用于dom树，生成render树(这里记录这每一个节点和它的样式和所在的位置)
4.把render树渲染到页面

reflow(回流) //类比第3步
reflow翻译为回流，指的是页面再次构建render树。
每个页面至少发生一次回流，就是第一次加载页面的时候
此外，当页面中有任何改变可能造成文档结构发生改变(即元素间的相对或绝对位置改变)，都会发生reflow，
常见的有：
1.添加或删除元素(opacity:0除外，它不是删除)
2.改变某个元素的尺寸或位置
3.浏览器窗口改变(resize事件触发)

repaint(重绘) //类比第4步
repaint翻译为重绘，它可以类比为上面的第4步，根据render树绘制页面，它的性能损耗比回流要小。每次回流一定会发生重绘。
以下操作(不影响文档结构的操作，影响结构的会发生回流)也会发生重绘：
1.元素的颜色、透明度改变
2.text-align等

reflow和repaint浏览器优化
我们不太容易精确知道哪些操作具体会造成哪些元素回流，不同的浏览器都有不同的实现。但是确定是他们的的耗时是比较长的，因为涉及到大量的计算。
浏览器为了提升性能也对这个问题进行了优化。方案就是维护一个队列,把所有需要回流和重绘的操作都缓存起来，一段时间之后再统一执行。
但是，有的时候我们需要获取一些位置属性，当我们一旦调用这些api的时候，浏览器不得不立即计算队列以保证提供的数据是准确的。例如以下操作：
1. offsetTop, offsetLeft, offsetWidth, offsetHeight
2. scrollTop/Left/Width/Height
3. clientTop/Left/Width/Height
4. width,height
5. getComputedStyle或者IE的currentStyle

回流重绘优化:
1.批量处理
  使用DocumentFragment进行缓存，这样只引发一次回流
  把频繁操作的元素先display：null，只引发两次回流
  cloneNode和replaceChild，只引发两次回流
2.不要频繁更改style，而是更改class
3.避免频繁调用offsetTop等属性，在循环前把它缓存起来
4.绝对定位具有复杂动画的元素，否则会引起父元素和后续大量元素的频繁回流
```

## 重绘和回流（考察频率：中）
* 重绘：当页面中元素样式的改变并不影响它在文档流中的位置时（例如：color、background-color、visibility等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。
* 回流：当Render Tree（DOM）中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为回流。
* 回流要比重绘消耗性能开支更大。
* 回流必将引起重绘，重绘不一定会引起回流。
* 参考：https://juejin.im/post/5a9923e9518825558251c96a

## 其它
```
描述浏览器重绘和回流，哪些方法能够改善由于dom操作产生的回流
直接改变className，如果动态改变样式，则使用cssText
// 不好的写法
var left = 1;
var top = 1;
el.style.left = left + "px";
el.style.top = top + "px";// 比较好的写法
el.className += " className1";
 
// 比较好的写法
el.style.cssText += "; 
left: " + left + "px; 
top: " + top + "px;";

2.让要操作的元素进行”离线处理”，处理完后一起更新
a) 使用DocumentFragment进行缓存操作,引发一次回流和重绘；
b) 使用display:none技术，只引发两次回流和重绘；
c) 使用cloneNode(true or false) 和 replaceChild 技术，引发一次回流和重绘
```