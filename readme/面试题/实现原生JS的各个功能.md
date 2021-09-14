## 实现原生JS的各个功能

### 手动实现new

```js
function newF(FN, ...args) {
    var obj = {}
    obj.__proto__ = FN.prototype
    var result = FN.apply(obj, args)
    return typeof result === "object" ? result : obj
}
```

或者

```js
function newF(FN, ...args) {
    var obj = Object.create(FN.prototype)
    var result = FN.apply(obj, args)
    return typeof result === "object" ? result : obj
}
```

或者

```js
function newF() {
    var fn = Array.prototype.slice.call(arguments, 0, 1)[0];
    var params = Array.prototype.slice.call(arguments, 1);
    var obj = {};
    obj.__proto__ = fn.prototype;
    var result = fn.apply(obj, params);
    return typeof result === 'object' ? result : obj;
}
```

