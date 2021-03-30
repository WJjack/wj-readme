### calc, support, media各自的含义及用法？
@support主要是用于检测浏览器是否支持CSS的某个属性，其实就是条件判断，如果支持某个属性，你可以写一套样式，如果不支持某个属性，你也可以提供另外一套样式作为替补。@suport逻辑判断：or, not, and;
```javascript
@supports ((transition-property: color) or (animation-name: foo)) and (transform: rotate(10deg)) { 
	/*自己的样式 */
}
```

calc() 函数用于动态计算长度值。 calc()函数支持 "+", "-", "*", "/" 运算；

@media 查询，你可以针对不同的媒体类型定义不同的样式。

### CSS权重计算
* 第一等级：代表内联样式，如style=""，权值为 1000
* 第二等级：代表id选择器，如#content，权值为100
* 第三等级：代表类，伪类和属性选择器，如.content，权值为10
* 第四等级：代表标签选择器和伪元素选择器，如div p，权值为1

注意：通用选择器（*），子选择器（>），和相邻同胞选择器（+）并不在这个等级中，所以他们的权值为0
