## Servlet

### 引入Servlet

1、在tomcat的lib文件夹下复制`servlet-ap.jar`包到webapp=>WEB-INF=>lib

2、导入servlet-ap.jar包



### 使用

#### 1、HttpServlet（推荐使用）

```java
package com.example.controller;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/user2")
public class Use2 extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("user2进入了");
    }
}

```

#### 2、Servlet

```java
package com.example.controller;

import javax.servlet.*;
import java.io.IOException;

public class User implements Servlet {
    @Override
    public void init(ServletConfig servletConfig) throws ServletException {

    }

    @Override
    public ServletConfig getServletConfig() {
        return null;
    }

    @Override
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
        System.out.println("接收到了请求111111111111111");
    }

    @Override
    public String getServletInfo() {
        return null;
    }

    @Override
    public void destroy() {

    }
}

```

配置webxml

```xml
<!DOCTYPE web-app PUBLIC
 "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
 "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
  <display-name>Archetype Created Web Application</display-name>

  <servlet>
    <servlet-name>user</servlet-name>
    <servlet-class>com.example.controller.User</servlet-class>
  </servlet>
  
  <servlet-mapping>
    <servlet-name>user</servlet-name>
    <url-pattern>/user</url-pattern>
  </servlet-mapping>
</web-app>

```



#### 3、GenericServlet

```java
package com.example.controller;

import javax.servlet.*;
import java.io.IOException;

public class User extends GenericServlet {
    @Override
    public void init(ServletConfig servletConfig) throws ServletException {

    }

    @Override
    public ServletConfig getServletConfig() {
        return null;
    }

    @Override
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
        System.out.println("接收到了请求111111111111111");
    }

    @Override
    public String getServletInfo() {
        return null;
    }

    @Override
    public void destroy() {

    }
}

```

配置webxml

```xml
<!DOCTYPE web-app PUBLIC
 "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
 "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
  <display-name>Archetype Created Web Application</display-name>

  <servlet>
    <servlet-name>user</servlet-name>
    <servlet-class>com.example.controller.User</servlet-class>
  </servlet>
  
  <servlet-mapping>
    <servlet-name>user</servlet-name>
    <url-pattern>/user</url-pattern>
  </servlet-mapping>
</web-app>

```



### 请求常见api

```java
package com.example.controller;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/user2")
public class Use2 extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("user2进入了");

        // 解决post请求中文乱码问题
        req.setCharacterEncoding("utf-8");
        // get请求参数中文乱码需要配置tomcat中的server.xml中的connector的属性为URIEncoding="UTF-8"

        req.getParameter("username");

        resp.setCharacterEncoding("utf-8");
        resp.setContentType("text/html;charset=utf-8");
        resp.setHeader("a", "1");
        resp.addHeader("b", "2");
        resp.addHeader("b", "3");

        PrintWriter writer = resp.getWriter();
        writer.write("相应信息");
        resp.sendError(400, "前端错误信息");
    }
}

```



### 请求转发和重定向

#### 请求转发的特点：

1、发一次请求，请求url不变

优点：可以使用请求对象来完成不同的servlet之间的数据共享

```java
// 数据共享
req.setAttribute("name", "赵云");
String name = (String)req.getAttribute("name");

// 请求转发
req.getRequestDispatcher("/user").forward(req, resp);
```



缺点：

1、网络卡顿时，有可能由于用户误操作，导致表单重复提交

2、请求转发只能转发内部资源，不能转发外部资源



#### 请求重定向：

```java
resp.sendRedirect("/user");
```

特点：

发送两次请求，请求url会变化。

优点：

1. 不会导致表单重复提交
2. 可以重定向到外部资源

缺点：

1. 不能使用请求对象完成数据共享



重定向后servlet之间的数据无法共享的问题，可以通过其他方式来解决：web应用上下文或会话。



### 过滤器

会在servlet之前进行过滤，类似与nestjs中的拦截器

有两种写法：

1、xml

```xml
<filter>
    <filter-name>firstFilter</filter-name>
    <filter-class>com.example.filter.FirstFilter</filter-class>
  </filter>
  <filter-mapping>
    <filter-name>firstFilter</filter-name>
    <url-pattern>/*</url-pattern>
  </filter-mapping>
```

2、注解写法

```java
package com.example.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter(urlPatterns = {"/*"})
public class CharsetFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest)servletRequest;
        HttpServletResponse res = (HttpServletResponse) servletResponse;

        String uri = req.getRequestURI();
        if (uri.endsWith(".js") || uri.endsWith(".css")) {
            filterChain.doFilter(req, res);
        } else {
            req.setCharacterEncoding("utf-8");
            res.setContentType("text/html;charset=utf-8");
            res.setCharacterEncoding("utf-8");
            filterChain.doFilter(req, res);
        }


    }

    @Override
    public void destroy() {
        Filter.super.destroy();
    }
}

```



### cookie会话

一、创建cookie

```java
Cookie cookieName = new Cookie("name", "赵云");
// 设置cookie的有效期
cookieName.setMaxAge(60 * 60 * 24 * 7);
// 只有在访问ts这个接口地址时才会带上这个cookie
cookieName.setPath("/ts");
resp.addCookie(cookieName);
```

二、获取cookie

```java
Cookie[] cookies = req.getCookies();
for(Cookie cookie : cookies) {
    String k = cookie.getName();
    String value = cookie.getValue();
}
```

cookie时将数据保存在浏览器这种明文存储，不安全，可以使用session，将数据保存在服务器端



### session

session将数据保存在服务器端，通过将id保存在浏览器的cookie中，发起请求后通过这个id在服务器中获取保存的数据。

```java
HttpSession session = req.getSession();
session.setAttribute("name", "赵云");
String name1 = (String)session.getAttribute("name");
```

session更加安全，因为数据是存储在服务器端，在浏览器端值存储了一个id，即便id泄漏也不影响。



### 获取xml的配置

配置xml，传入数据

通过`<init-param>`传递数据

```xml
<servlet>
    <servlet-name>user</servlet-name>
    <servlet-class>com.example.controller.User</servlet-class>
    <init-param>
      <param-name>name</param-name>
      <param-value>赵云</param-value>
    </init-param>
  </servlet>
  <servlet-mapping>
    <servlet-name>user</servlet-name>
    <url-pattern>/user</url-pattern>
  </servlet-mapping>
```

获取xml中传入的数据：

```java
@WebServlet("/user2")
public class Use2 extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        ServletConfig servletConfig = this.getServletConfig();
        Enumeration<String> initParameterNames = servletConfig.getInitParameterNames();
       	while(initParameterNames.hasMoreElements()) {
            String nextElement = initParameterNames.nextElement();
            String initParameter = servletConfig.getInitParameter(nextElement);
        }
    }
}
```



### servlet上下文context

配置xml：

```xml
  <context-param>
    <param-name>name</param-name>
    <param-value>赵云</param-value>
  </context-param>
  <context-param>
    <param-name>age</param-name>
    <param-value>20</param-value>
  </context-param>
```

servlet中获取：

```java
@WebServlet("/user2")
public class Use2 extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        ServletContext servletContext = this.getServletContext();
//        req.getServletContext();
//        this.getServletConfig().getServletContext();
//        req.getSession().getServletContext();
        // 获取xml配置的上下文初始数据
        String name2 = servletContext.getInitParameter("name");
        String age = servletContext.getInitParameter("age");
        // 设置数据
        servletContext.setAttribute("addr", "红旗河沟");
        // 获取数据
        servletContext.getAttribute("addr");
    }
}
```



