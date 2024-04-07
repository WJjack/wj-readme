java基础

## 运算符 分支结构

### 赋值运算符

= 左边为引用名（变量名） 右边放值

```
    int i = 15;    String name = input.next();
```

### 算术运算符

```java
+    优先考虑左右两边是否是数值类型 可否做+法运算   不能做加法运算 则表现为连接左右两边构成字符串    syso('a'+15);    //112            加法    syso('a'+""+15);    //a15        连接以下只能用于数值类型-*/    运算过程中 如果都是int类型 计算结果依然是int类型%    依然是做除法 返回的是余数  用于判断数字奇偶    int num = input.nextInt();    syso(num%2==0);//返回true 或者false    int l = 15;    l = l +5;    ==>    l+=5;    syso(l);    //20++        l = l+1;===>  l+=1;    ==> l++;--        l = l-1;===>  l-=1; ==> l--;+=        l += 2 ===>        l = l+2;-=*=        l = l*3;    ==>    l*=3;/=        l = l/2;    ==> l/=2;int num = 5;syso(num++);    //先输出5        num再+1 变为6syso(num);        //6syso(--num);    //5        先做--    num变为5    再输出这个5syso(num);        //5
```

#### 案例

女生5人 男生7人 请计算女生百分比

```java
        int girl = 5;        int boy = 7;        int sum = girl+boy;//12        //double result = girl/sum;    //0.0 会直接砍掉小数点后面的数字        double result = girl*1.0/sum;        //0.416666        System.out.println(result*100+"%");
```

int m = 3;

int n = —m + ++m + m++ + (m+=2) - —m + m*3 + m++;

### 关系运算符

所有使用关系运算符连接的式子 返回的都是 boolean 类型的值

```java
> < >= <= != ==基本数据类型 比较是否相同 可以用== 其实比的就是地址 String类型 地址不同 不能使用==  要用.equals() 方法比较    忽略地址 比较值String name = "张三";String name1 = new String("张三");syso(name == name1);   //falsesyso(name.equals(name1));    //true    //忽略地址 比较值syso(name.equals("张三"));char c = 'a';syso(c==97);    //true//希望不相同的时候返回truesyso(!name.equals(name1));//falsename = "李四";syso(!name.equals(name1));//true
```

如果一个场景 需要放入真假值

1.可以直接放 true、false

2.可以放boolean类型的变量名

3.放带关系运算符的表达式 例如 l>3 l==5 l!=5

#### 案例

用户输入用户名 和 密码 输出 用户名是不是”张三” 密码 是不是 123

```java
        Scanner input = new Scanner(System.in);        System.out.println("请输入用户名");        String name = input.next();        System.out.println("请输入密码");        int pwd = input.nextInt();        //==比的是地址 基本数据类型的值都来自于常量池 可以使用==比较        System.out.println("密码是123么？"+(pwd==123));        //字符串类型 都有自己的地址 因此要使用equals()        //String n = "张三";        System.out.println("用户是张三么？"+(name.equals("张三")));
```

### 逻辑运算符

将多个关系运算符的表达式 进行关联 依然返回boolean类型的值

&& 并且 两个为真才是真 一个为假都是假 如果第一个条件为假 则直接结束判断

|| 或者 两个为假才是假 一个为真就是真 如果第一个条件为真 则直接结束判断

！ 取反 真变假 假变真

& 并且 两个为真才是真 一个为假都是假 无论第一个条件真假 都会将后续判断执行完毕

| 或者 两个为假才是假 一个为真就是真 无论第一个条件真假 都会将后续判断执行完毕

#### 案例

输入语文成绩 数学成绩

是不是都及格了

是不是有一科是满分

```
    int score1 = input.nextInt();    //50    int score2 = input.nextInt();    //98    boolean bool = score1>=60 & score2++>=60 ;     syso(score2);    //99
```

### 三元运算符

变量 = 判断条件 ？ 值1 ： 值2

#### 案例

如果数学成绩==100 奖励笔记本 否则 刷题去

```
    int score1 = input.nextInt();    String result = score1==100 ? "奖励笔记本"  : "刷题去" ;    syso(result);    String day = input.next();//接收周几    String result = day.equals("周一")? "马铃薯" : day.equals("周二")? "土豆": day.equals("周三")?"洋芋":"满汉全席";
```

#### 练习

询问今天是否下雨 如果下雨 则 雨中漫步 否则 带伞防雨

询问用户年龄 10岁以下 吃西瓜 10-20 吃西餐 20以上 吃火锅

询问今天星期几 周一 马铃薯 周二 土豆 周三 洋芋 周四 薯片 周五 薯条 其余 满汉全席

```
int boys = 15;girls = 5; 分别说出以下四种情况的str 和boys , girls的结果String str = boys++>15 || girls++>0 ? "情况1":"情况2";   1   16  6String str = boys++>15 & girls++>0 ? "情况1":"情况2";    2   16   6String str = --boys>15 & girls--<3 ? "情况1":"情况2";    2    14    4String str = boys>30 & girls-->4 ?  "情况1":"情况2";    2    15    4String str = boys>30 | girls-->4 ?  "情况1":"情况2";    1    15    4String str = (boys*=2)<30 | girls-->4? "情况1":"情况2";    1    30    4String str = boys<30 && --girls>4? "情况1":"情况2";         2    15    4String str = (boys+=5)<=20 & ++girls>4? "情况1":"情况2"; 1    20    6String str = boys++==15 ||  girls-->4? "情况1":"情况2";        1    16  5
```

### 分支结构

if(判断条件){

 当判断条件为真时要执行的代码

}

if(判断条件){

 当判断条件为真时执行的代码

}else{

 当条件不成立时执行的代码

}

if(条件1){

 条件1为真时执行的代码

}else if(条件2){

 条件2为真时执行的代码

}else if(条件3){

 条件3为真时执行的代码

}…else{ //其余任何情况

 以上条件都为假时执行的代码

}

#### 案例

输入考试分数

\>90 奖励笔记本

80 奖励手机

70 奖励钢笔

60 奖励作业

其余 一顿打

```
        int score = input.nextInt();        if(score>90) {            System.out.println("奖励笔记本");        }else if(score>80) {            System.out.println("奖励手机");        }else if(score>70) {            System.out.println("奖励钢笔");        }else if(score>60) {            System.out.println("奖励作业");        }else {            System.out.println("一顿打");        }
```

#### 总结

1.if结构 有且只有一个

2.else if结构 可有可无 可有多个 一定在if后面

3.else 结构 可有可无 最多1个 在最后

3.从上向下依次判断 只要有一个成立 后续判断不再执行

4.当做区间判断时 一定注意条件的编写顺序 将最难满足的条件放上面

5.建议不要省略{}

#### 练习

周一 西红柿 周二 番茄 周三 圣女果 周四 番茄 周五 西红柿 其余 西北风

下题使用if结构的嵌套

 用户输入选项 输出对应的界面

 if 1.注册 输出 欢迎进入注册界面 再产生以下子菜单
​ if 1.电话注册 输出 欢迎进入电话注册界面
​ else 2.邮箱注册 输出 欢迎进入邮箱注册界面
​ else if2.登录
​ if 1.电话登录 输出 欢迎进入电话登录界面
​ else 2.邮箱登录 输出 欢迎进入邮箱登录界面
​ else if3.会员中心
​ if 1.会员积分 输出 欢迎进入会员积分界面
​ else if2.会员信息
​ if 1.信息查询 输出 欢迎进入会员信息查询界面
​ else 2.信息修改 输出 欢迎进入会员信息修改界面
​ else 3.会员活动 输出 欢迎进入会员活动界面
​ else 4.退出 欢迎下次再来

syso(“1.注册2.登录3.会员中心4.退出”);

int sel = input.nextInt();

if(sel==1){

 syso(“欢迎进入注册界面”);

 syso(“1.电话注册2.邮箱注册”);

 int s1 = input.nextInt();

 if(s1==1){

 syso(“欢迎进入电话注册界面”);

 }else{



 }

}else if(sel==2){



}

### switch选择结构

只能做等值判断

switch(变量名){

 case 值1:

 {

 当要判断的变量名 等于 值1 时执行的代码

 break;

 }

 case 值2:

 {

 当要判断的变量名 等于 值2 时执行的代码

 break;

 }

 case 值3:

 当要判断的变量名 等于 值3 时执行的代码

。。。

 default:

 以上条件都不满足时 执行的而代码

}

```
a:while(true){    syso("1.注册2.登录3.会员中心4.退出");    int sel = input.nextInt();    switch(sel){        case 1:            {            syso("欢迎进入注册界面");            break;            }        case 2:            {            syso("欢迎进入登录界面");                break;            }        case 3:             {            syso("欢迎进入会员中心");                 break;            }        case 4:            {            syso("欢迎下次再来");            //System.exit(0);    //安全退出整个程序            break a;    //结束a这个模块            }        default:            syso("输入有误 重新输入");    }}syso("后续代码");//不会执行到
```

#### 练习

 周一吃番茄 周二吃 西红柿 周三吃 圣女果 周四吃 番茄 周五吃 番茄 周六吃 西红柿 周日吃 番茄 其余 输入有误 重新输入

 大于90分 笔记本

 大于80分 奖励手机

 大于70分 奖励钢笔

 大于60分 奖励作业

 其余 一顿打

#### 总结

1.只能做等值判断

2.不能有重复的选项

3.如果不加break 代码会继续向下执行 一般最后一个选项可不加

4.各种case 包括default可以互换位置 放在前面的选项 注意添加break

5.只能判断byte short int char 枚举类型 String

if(score1==100){

 syso(“奖励笔记本”);

}else{

 syso(“刷题去”);

}
