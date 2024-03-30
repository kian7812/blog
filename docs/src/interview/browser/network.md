# 网络

## 常用HTTP状态码及其含义
1XX 信息 Information，服务器收到请求，需要请求者继续执行操作
   （101，升级为websocket协议）
2XX 成功 Success，操作被成功接收并处理
   （204：服务器成功处理，但未返回内容；206部分内容，分段传输）
3XX 重定向 Redirection，需要进一步操作以完成请求
   （301，302重定向；304命中缓存）
4XX 客户端错误 Client Error，请求包含语法错误或无法完成请求
   （400，Bad Request，客户端请求的语法错误，服务器无法理解；
    401，要求身份验证；
    403，Forbidden，服务器理解客服端需求，但是禁止访问；
    404，Not Found，服务器无法根据客户端的请求找到资源/网页）
    405，HTTP Error 405 Method not allowed Explained
5XX 服务器错误 Server Error，服务器在处理请求的过程中发生了错误