## SpringMvc

1、引入servlet-api.jar包

2、安装springmvc需要使用的插件

在pom.xml中配置springmvc插件

```xml
<dependencies>
    <!-- https://mvnrepository.com/artifact/org.springframework/spring-webmvc -->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <version>5.2.25.RELEASE</version>
    </dependency>
  </dependencies>
```

3、配置中央控制器

在web.xml中

```xml
<!--  配置中央控制器 -->
  <servlet>
    <servlet-name>springmvc</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <!--  配置初始化参数，告诉springmvc框架，在中央控制器初始化时应该到类路径中加载springmvc.xml文件  -->
    <init-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>classpath:springmvc.xml</param-value>
    </init-param>
  </servlet>
  <servlet-mapping>
    <servlet-name>springmvc</servlet-name>
    <url-pattern>*.do</url-pattern>
  </servlet-mapping>
```

4、配置springmvc配置文件

在resouces中创建`springmvc.xml`文件，并配置如下：

```xml
<bean id="handlerMapping" class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping"></bean>
<bean id="handlerAdapter" class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter"></bean>
<bean id="resourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/static/html"></property>
    <property name="suffix" value=".html"></property>
</bean>
```

配置`<mvc:annotation-driven />`

```xml
<mvc:annotation-driven />
<!--    <bean id="handlerMapping" class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping"></bean>-->
<!--    <bean id="handlerAdapter" class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter"></bean>-->
    <!--  在springmvc3.0后，不用单独去配置处理器映射和处理器适配器
        而是提供了一个标签mvc:annotation-driven，配置了改标签之后，会自动帮我们配置配置处理器映射和处理器适配器，
        并且功能更加强大
      -->
    <bean id="resourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/static/html/"></property>
        <property name="suffix" value=".html"></property>
    </bean>
```



5、编写控制器

```java
package com.woniu.controller;

import org.springframework.stereotype.Controller;

// 将类编程控制器
@Controller
public class AccountController {
}

```

6、配置springmvc去扫描注解

scpringmvc.xml

```xml
<!--  扫描指定的包下的注解，生成被注解的类的对象，注入到springmvc容器中  -->
<context:component-scan base-package="com.woniu.controller" />
```



### 静态资源配置

在springmvc.xml中：

```xml
<!-- 静态资源映射 -->
<!--
    mapping：用于匹配一个uri
    location：匹配的就是资源所在的目录
    会将mapping中的**匹配到的目录拼接在location之后
-->
    <mvc:resources mapping="/static/**" location="/static/" />
```

配置完成后，访问`http://localhost:8888/static/html/login.html`才能正确访问



### 注入类到ico容器

有两种配置方式：

1、xml配置方式

配置`springmvc.xml`

```xml
<bean id="account" class="com.woniu.model.Account">
    <property name="name" value="赵云" />
    <property name="age" value="30" />
</bean>
```

在java类中获取如下：

```java
package com.woniu;

import com.woniu.config.AppConfig;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Test {
    public static void main(String[] args) {
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("springmvc.xml");
        
        Object account = applicationContext.getBean("account");
        System.out.println(account);
    }
}

```

2、类配置方式

新建com.woniu.config.Appconfig.java

```java
package com.woniu.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration() // 配置类
@ComponentScan(basePackages = {"com.woniu"}) // 扫描该目录下的所有的类
public class AppConfig {
}

```

创建com.woniu.config.model.Account.java

```java
package com.woniu.model;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component // 被spring框架扫描到时会自动创建该类到ioc容器中
public class Account {
    @Value("张飞") // 设置默认值
    private String name;
    @Value("30")
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    @Override
    public String toString() {
        return "Account{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }

    public void setAge(int age) {
        this.age = age;
    }


}

```

读取类方式：

```java
package com.woniu;

import com.woniu.config.AppConfig;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Test {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
        Object account = applicationContext.getBean("account");
        System.out.println(account);
    }
}

```

