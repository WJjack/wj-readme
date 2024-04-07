## JDBC



### Properties配置文件

1、在src下创建文件test.properties

2、加载文件

```java
Properties properties = new Properties();
properties.load(new FileInputStream("src/test.properties"));
```

* load：加载字节流文件

3、通过`getProperty`获取配置文件中的数据

```java
String url = properties.getProperty("url");
```



### 注解与反射

#### 注解

1、创建注解

```java
package com.example.anotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Public {
    boolean value(); // 设置属性值

    String name(); // 设置属性值
}

```

* Retention：设置注解执行时机
* Target：设置注解作用于什么上，比如有TYPE：类、CONSTRUCTOR：构造器、FIELD：树形、METHOD：方法等等

2、使用注解

```java
package com.example.demo;

import com.example.anotations.Public;

@Public(value = true, name = "权限")
public class FIleTest {
}

```

#### 反射

1、通过`Class.forName`根据字符串获取类字节码

```java
String path = "com.example.demo.User";
Class<?> aClass = Class.forName(path);
```

2、获取字节码中的注解、方法、构造器、属性

```java
// 获取类上所有非私有的注解
Annotation[] annotations = aClass.getAnnotations();
// 获取所有的注解
Annotation[] declaredAnnotations = aClass.getDeclaredAnnotations();

// 获取某个注解
Public annotation = aClass.getAnnotation(Public.class);
// 获取注解中的参数值
String name = annotation.name();
boolean value = annotation.value();

// 获取所有非私有的构造器
Constructor<?>[] constructors = aClass.getConstructors();
// 获取所有的构造器
Constructor<?>[] declaredConstructors = aClass.getDeclaredConstructors();
// 获取非私有的某个构造函数
Constructor<User> constructor = (Constructor<User>) aClass.getConstructor(String.class, int.class, String.class, double.class);
// 实例化
User user = constructor.newInstance("赵云", 20, "渝北", 90.99);

// 获取所有非私有属性
Field[] fields = aClass.getFields();
// 获取所有的属性
Field[] declaredFields = aClass.getDeclaredFields();

// 获取所有非私有的静态方法
Method[] methods = aClass.getMethods();
// 获取所有的静态方法
Method[] declaredMethods = aClass.getDeclaredMethods();

// 获取某个静态方法
Method computedA = aClass.getDeclaredMethod("computedAge", int.class);
// 设置为可访问的
computedA.setAccessible(true);
// 执行这个静态方法
Object invoke = computedA.invoke(aClass, 20);
```
