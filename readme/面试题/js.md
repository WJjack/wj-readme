参考：<https://zhuanlan.zhihu.com/p/114278057>

### 说一下CORS？
CORS是一种新标准，支持同源通信，也支持跨域通信。fetch是实现CORS通信的

### 如何中断ajax请求？
一种是设置超时时间让ajax自动断开，另一种是手动停止ajax请求，其核心是调用XML对象的abort方法，ajax.abort()

### target、currentTarget的区别？
currentTarget当前所绑定事件的元素

target当前被点击的元素

### 说一下宏任务和微任务？
宏任务：当前调用栈中执行的任务称为宏任务。（主代码快，定时器等等）。

微任务： 当前（此次事件循环中）宏任务执行完，在下一个宏任务开始之前需要执行的任务为微任务。（可以理解为回调事件，promise.then，proness.nextTick等等）。

宏任务中的事件放在callback queue中，由事件触发线程维护；微任务的事件放在微任务队列中，由js引擎线程维护。

```javascript
setTimeout(() => {
    console.log('事件1')
}, 0)
console.log('事件2');

new Promise((resolve) => {
    console.log('事件3');
    resolve()
}).then(() => {
    console.log('事件4');
}).then(()=>{
    console.log('事件5')
});
// 打印顺序是：事件2，事件3，事件4，事件5，事件1
```

### 说一下继承的几种方式及优缺点？
* 借用构造函数继承，使用call或apply方法，将父对象的构造函数绑定在子对象上
* 原型继承，将子对象的prototype指向父对象的一个实例
* 组合继承
* 原型链继承的缺点

字面量重写原型会中断关系，使用引用类型的原型，并且子类型还无法给超类型传递参数。
借用构造函数（类式继承）

借用构造函数虽然解决了刚才两种问题，但没有原型，则复用无从谈起。
组合式继承

组合式继承是比较常用的一种继承方法，其背后的思路是使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数复用，又保证每个实例都有它自己的属性。

### 说一下闭包？
闭包的实质是因为函数嵌套而形成的作用域链

闭包的定义即：函数 A 内部有一个函数 B，函数 B 可以访问到函数 A 中的变量，那么函数 B 就是闭包

1.函数里面包含的子函数，子函数访问父函数的局部变量

2.通过return将子函数暴露在全局作用域，子函数就形成闭包

3.通过闭包，父函数的局部变量没有被销毁，可通过闭包去调用 ，但同时，这个局部变量也不会被全局变量污染


优点： 避免全局变量的污染，同时，局部变量没有被销毁，驻留在内存中，还可以被访问

缺点： 使用不当，会造成内存泄露

### 什么是会话cookie,什么是持久cookie?
cookie是服务器返回的，指定了expire time（有效期）的是持久cookie,没有指定的是会话cookie

### 数组去重？
```javascript
var arr=['12','32','89','12','12','78','12','32'];
    // 最简单数组去重法
    function unique1(array){
        var n = []; //一个新的临时数组
        for(var i = 0; i < array.length; i++){ //遍历当前数组
            if (n.indexOf(array[i]) == -1)
                n.push(array[i]);
        }
        return n;
    }
    arr=unique1(arr);
    // 速度最快， 占空间最多（空间换时间）
    function unique2(array){
        var n = {}, r = [], type;
        for (var i = 0; i < array.length; i++) {
            type = typeof array[i];
            if (!n[array[i]]) {
                n[array[i]] = [type];
                r.push(array[i]);
            } else if (n[array[i]].indexOf(type) < 0) {
                n[array[i]].push(type);
                r.push(array[i]);
            }
        }
        return r;
    }
    //数组下标判断法
    function unique3(array){
        var n = [array[0]]; //结果数组
        for(var i = 1; i < array.length; i++) { //从第二项开始遍历
            if (array.indexOf(array[i]) == i) 
                n.push(array[i]);
        }
        return n;
    }
```
```javascript
// es6方法数组去重
let arr = [];
arr=[...new Set(arr)];
```

### 你所知道的http的响应码及含义？
> 此题有过开发经验的都知道几个，但还是那句话，一定要回答的详细且全面。
1xx(临时响应)

100: 请求者应当继续提出请求。

101(切换协议) 请求者已要求服务器切换协议，服务器已确认并准备进行切换。

2xx(成功)

200：正确的请求返回正确的结果

201：表示资源被正确的创建。比如说，我们 POST 用户名、密码正确创建了一个用户就可以返回 201。

202：请求是正确的，但是结果正在处理中，这时候客户端可以通过轮询等机制继续请求。

3xx(已重定向)

300：请求成功，但结果有多种选择。

301：请求成功，但是资源被永久转移。

303：使用 GET 来访问新的地址来获取资源。

304：请求的资源并没有被修改过

4xx(请求错误)

400：请求出现错误，比如请求头不对等。

401：没有提供认证信息。请求的时候没有带上 Token 等。

402：为以后需要所保留的状态码。

403：请求的资源不允许访问。就是说没有权限。

404：请求的内容不存在。

5xx(服务器错误)

500：服务器错误。

501：请求还没有被实现。

### 进程与线程的区别
* 进程是系统进行资源分配和调度的一个独立单位
* 线程是CPU调度和分派的基本单位,它是比进程更小的能独立运行的基本单位
* 一个进程至少有一个线程组成

线程自己基本上不拥有系统资源,只拥有一点在运行中必不可少的资源(如程序计数器,一组寄存器和栈)，但是它可与同属一个进程的其他的线程共享进程所拥有的全部资源

### 进程间通信方式
* 管道通信
* 消息队列通信
* 信号量通信
* 共享内存通信
* 套接字通信


### 事件循环机制
<http://blog.alanwu.site/2020/03/06/eventLoop/>

### JS垃圾回收与V8垃圾回收
<http://blog.alanwu.site/2020/03/03/nodeCollect/>

### vue 3.0中proxy数据双向绑定
* Proxy 可以直接监听对象而非属性；
* Proxy 可以直接监听数组的变化；
* Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
* Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
* Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

### 浏览器缓存
<http://blog.alanwu.site/2020/01/31/navigatorCache/>

### 请求首部
* Accept: 用户代理可处理的媒体类型
* Accept-Charset: 优先的字符集
* Accept-Encoding: 优先的内容编码
* Accept-Language: 优先的语言
* Authorization: web 认证信息
* From: 用户的电子邮箱地址
* Host: 请求资源所在服务器
* if-Match: 比较实体标记
* if-Modified-Since: 比较资源的更新时间
* if-None-Match: 比较实体标记（与if-Match相反）
* if-Range: 资源为更新时发送实体Byte的范围请求
* if-Unmodified-Since: 比较资源的更新时间
* Referer: 对请求中的 Url 的原始获取方法
* User-Agent: HTTP 客户端程序的信息

### 响应首部
* Accept-Ranges: 是否接受字节范围请求
* Age: 推算资源创建经过时间
* ETag: 资源的匹配信息
* Location: 令客户端重定向至指定的URL
* Proxy-Authenticate: 代理服务器对客户端的认证信息
* Rety-After: 对再次发起请求的时机要求
* Server: HTTP服务器的安装信息
* Vary: 代理服务器缓存的管理信息
* WWW-Authenticate: 服务器对客户端的认证信息
