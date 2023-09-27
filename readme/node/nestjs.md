## Nestjs



### session会话

可以和浏览器的cookie通信。

1. 安装
   ```bash
   npm i express-session
   
   npm i @types/express-session -D
   ```

2. 使用
   在main.ts中使用

   ```typescript
   import { NestFactory } from '@nestjs/core';
   import { AppModule } from './app.module';
   import * as session from 'express-session'
   
   async function bootstrap() {
     const app = await NestFactory.create(AppModule);
     app.use(session({
       name: 'test.id',
       secret: 'test',
       rolling: true, // 重置过期cookie过期时间
       cookie: {
         maxAge: 100000
       }
     }))
     await app.listen(3000);
   }
   bootstrap();
   
   ```

3. 在controller层中使用
   ```typescript
   import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req } from '@nestjs/common';
   
   @Controller('user')
   export class UserController {
     constructor(private readonly userService: UserService) {}
       
     @Get('getCode')
     getCode(@Res() res, @Req() req) {
       const captcha = svgCaptcha.create({
         size: 4,
         width: 100,
         height: 34,
         color: true,
         background: '#999'
       });
       req.session.captcha = captcha.text;
       res.type('image/svg+xml');
       res.status(200).send(captcha.data);
     }
   }
   ```

   此时调用接口`getCode`后会在浏览器的cookie中出现`test.id`字段



### 生成验证码

1、安装插件

```bash
npm i svg-captcha
```

2、在controller中使用

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
    
  @Get('getCode')
  getCode(@Res() res, @Req() req) {
    const captcha = svgCaptcha.create({
      size: 4,
      width: 100,
      height: 34,
      color: true,
      background: '#999'
    });
    req.session.captcha = captcha.text;
    res.type('image/svg+xml');
    res.status(200).send(captcha.data);
  }
}
```

`captcha.text`：是验证码的答案

`captcha.data`：是验证码图片



### cors处理跨域

使用cors插件完成

1、安装

```bash
npm i cors
npm i @types/cors -D
```

2、在main.ts中使用

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    
  app.use(cors());
  
  await app.listen(3000);
}
bootstrap();

```



### 上传图片

参考地址：https://blog.csdn.net/qq1195566313/article/details/126796646?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168690140016800185838607%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=168690140016800185838607&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~rank_v31_ecpm-8-126796646-null-null.142^v88^insert_down1,239^v2^insert_chatgpt&utm_term=%E5%B0%8F%E6%BB%A1nestjs&spm=1018.2226.3001.4187



#### 1、主要会用到两个包

multer   @nestjs/platform-express nestJs自带了

multer   @types/multer 这两个需要安装

在upload  Module 使用MulterModule register注册存放图片的目录

需要用到  multer 的  diskStorage 设置存放目录 extname 用来读取文件后缀 filename给文件重新命名

```typescript
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [MulterModule.register({
    storage: diskStorage({
      destination: join(__dirname, '../images'),
      filename(_, file, callback) {
        const filename = new Date().getTime() + extname(file.originalname);
        return callback(null, filename);
      }
    })
  })],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}

```

#### 2、controller 使用

使用 UseInterceptors [装饰器](https://so.csdn.net/so/search?q=装饰器&spm=1001.2101.3001.7020) FileInterceptor是单个 读取字段名称 FilesInterceptor是多个

参数 使用 UploadedFile 装饰器接受file 文件

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file, @Res() res: Response) {
    console.log(file)
    res.send({
      status: 200,
      message: '上传成功'
    });
  }
}

```

#### 3、生成静态目录访问上传之后的图片

useStaticAssets prefix 是虚拟前缀

main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
  app.useStaticAssets(join(__dirname, 'images'), {
    prefix: '/nesttest'
  });
  
  await app.listen(3000);
}
bootstrap();

```



### 下载图片

参考地址：https://blog.csdn.net/qq1195566313/article/details/126880230?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168690140016800185838607%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=168690140016800185838607&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~rank_v31_ecpm-23-126880230-null-null.142^v88^insert_down1,239^v2^insert_chatgpt&utm_term=%E5%B0%8F%E6%BB%A1nestjs&spm=1018.2226.3001.4187



#### 1、直接下载

这个文件信息应该存数据库 我们这儿演示就写死 了

```typescript
@Get('download')
  download(@Res() res: Response, @Query('filename') filename: string) {
    const url = resolve(__dirname, '../images/' + filename)
    res.download(url);
  }
```

访问地址传入图片filename即可下载

#### 2、使用文件流的方式下载

可以使用compressing把他压缩成一个zip包

1. 安装插件
   ```bash
   npm i compressing
   ```

2. 编写controller层
   ```typescript
   import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, Query } from '@nestjs/common';
   import { UploadService } from './upload.service';
   import { FileInterceptor } from '@nestjs/platform-express'
   import { Response } from 'express';
   import { resolve } from 'path';
   import { zip } from 'compressing'
   
   @Controller('upload')
   export class UploadController {
     constructor(private readonly uploadService: UploadService) {}
   
     @Get('downloadStream')
     async downloadStream(@Query('filename') filename: string, @Res() res: Response) {
       const stream = new zip.Stream();
       const url = resolve(__dirname, '../images' + filename);
       await stream.addEntry(url);
       res.setHeader('Content-Type', 'application/octet-stream');
       res.setHeader('Content-Disposition', 'attachment; filename=hehe')
       stream.pipe(res);
     }
   }
   
   ```

3. 前端接收流
   ```js
   const useFetch = async (url: string) => {
     const res = await fetch(url).then(res => res.arrayBuffer())
     console.log(res)
     const a = document.createElement('a')
     a.href = URL.createObjectURL(new Blob([res],{
       // type:"image/png"
     }))
     a.download = 'xiaman.zip'
     a.click()
   }
    
   const download = () => {
     useFetch('http://localhost:3000/upload/stream')
   }
   ```



### RxJs

参考地址：https://blog.csdn.net/qq1195566313/article/details/126912646?ops_request_misc=&request_id=&biz_id=102&utm_term=%E5%B0%8F%E6%BB%A1nestjs&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-3-126912646.142^v88^insert_down1,239^v2^insert_chatgpt&spm=1018.2226.3001.4187



### 返回相应拦截

参考：https://blog.csdn.net/qq1195566313/article/details/126916268?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168690140016800185838607%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=168690140016800185838607&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~rank_v31_ecpm-30-126916268-null-null.142^v88^insert_down1,239^v2^insert_chatgpt&utm_term=%E5%B0%8F%E6%BB%A1nestjs&spm=1018.2226.3001.4187



### 过滤器

#### 错误处理案例

做统一的错误处理

1、在comon/HttpFilters.ts中编写代码：

```typescript
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpFilters implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const res = ctx.getResponse();
        const status = exception.getStatus();

        res.status(status).json({
            data: exception.message,
            time: new Date(),
            success: false,
            status,
            path: req.url
        })
    }
}
```

2、在main.ts中注册全局过滤器

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpFilters } from './common/HttpFilters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new HttpFilters());
    
  await app.listen(3000);
}
bootstrap();

```

这样处理后，接口报错会有统一的错误回复。



### 管道

转换参数类型

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete(':id')
  create(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    console.log(id);
    
    res.send('成功');
  }
}

```



#### 校验传入的数据

1、安装`class-validator`

```bash
npm i class-validator
```

2、在dto中校验数据

create-login.dto.ts

```typescript
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateLoginDto {
    @IsNotEmpty()
    @IsString()
    @Length(5, 10, {
        message: '长度必须是5到10之间'
    })
    account: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, undefined, {
        message: '密码最少6位'
    })
    password: string;
}

```

3、在main.ts中进行管道校验

```typescript

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();

```



### nestjs生命周期

[![pPfuGuR.png](https://z1.ax1x.com/2023/09/16/pPfuGuR.png)](https://imgse.com/i/pPfuGuR)

![](https://woniumd.oss-cn-hangzhou.aliyuncs.com/web/wujie/20230829105417.png)

### 爬虫

参考地址：https://blog.csdn.net/qq1195566313/article/details/127158497?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168690140016800185838607%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=168690140016800185838607&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~rank_v31_ecpm-18-127158497-null-null.142^v88^insert_down1,239^v2^insert_chatgpt&utm_term=%E5%B0%8F%E6%BB%A1nestjs&spm=1018.2226.3001.4187



获取到整个网页，然后通过`cheerio`插件来操作DOM元素，类似于jqeury

1、安装cheerio和axios

```bash
npm i cheerio axios
```

2、通过axios发起请求获取网页结构，通过`cheerio`来操作dom结构获取图片等数据

```typescript
import { Injectable, Res } from '@nestjs/common';
import { CreateWebSpiderDto } from './dto/create-web-spider.dto';
import { UpdateWebSpiderDto } from './dto/update-web-spider.dto';
import axios from 'axios';
import * as cheerio from 'cheerio'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class WebSpiderService {
  create(createWebSpiderDto: CreateWebSpiderDto) {
    return 'This action adds a new webSpider';
  }

  async findAll() {
    const url = 'https://image.baidu.com/search/index?tn=baiduimage&ps=1&ct=201326592&lm=-1&cl=2&nc=1&ie=utf-8&dyTabStr=MCw0LDEsNiw1LDMsNyw4LDIsOQ%3D%3D&word=nestjs+%E4%BB%80%E4%B9%88%E6%98%AFdto';
    const data = await axios.get(url)
    // return data.data;
    const $ = cheerio.load(data.data);
    // console.log($('.imgitem'));
    
    let srcArr: string[] = [];
    $('img').each(function() {
      let src = $(this).attr('src');
      srcArr.push(src)
    })

    srcArr.forEach(async (src) => {
      let reg = /^data:image\/\w+;base64,/;
      if (reg.test(src)) {
        
        let dataBuffer  = src.replace(reg, '');
        const bufferData = Buffer.from(dataBuffer, 'base64');
        write(bufferData)
      } else if(src) {
        
        const res = await axios.get(src, {
          responseType: 'arraybuffer'
        })
        write(res.data)
      }
    })

    function write(buffer: Buffer) {
      const url = path.resolve(__dirname, '../images', new Date().getTime() + '.png');
        
      const ws = fs.createWriteStream(url);
      ws.write(buffer);
    }

    return '11'
    
  }

  findOne(id: number) {
    return `This action returns a #${id} webSpider`;
  }

  update(id: number, updateWebSpiderDto: UpdateWebSpiderDto) {
    return `This action updates a #${id} webSpider`;
  }

  remove(id: number) {
    return `This action removes a #${id} webSpider`;
  }
}

```



### 环境变量配置

在nestjs中可以使用dotenv、js-yaml、config插件读取环境变量

#### 一、nestjs官方默认使用dotenv的方式配置环境变量：

安装插件`@nestjs/config`

```bash
yarn add @nestjs/config
```



```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

解释：

```typescript
ConfigModule.forRoot({
    isGlobal: true
  })
```

全局加载dotenv的`env`文件



##### 使用dotenv实现多环境稳健配置

1、在项目根目录下创建三个文件`.env`、`.env.production`、`.env.development`

2、安装`cross-env`

通过`cross-env`配置当前环境是开发环境还是生成环境

```bash
yarn add cross-env
```

配置`package.json`的`scripts`命令行

```json
{
    "scripts": {
        "build": "cross-env NODE_ENV=production nest build",
        "start": "cross-env NODE_ENV=development nest start",
        "start:dev": "cross-env NODE_ENV=development nest start --watch",
        "start:prod": "cross-env NODE_ENV=production node dist/main",
      }
}
```

3、在`app.module.ts`文件中自定义使用的环境文件

1. 根据`NODE_ENV`判断环境变量，动态设置自定义环境文件
   app.module.ts

   ```ts
   let envFilePath = ['.env'];
   if (process.env.NODE_ENV === 'development') {
     envFilePath.unshift('.env.development');
   } else {
     envFilePath.unshift('.evn.production');
   }
   ```

2. 配置自定义环境文件
   app.module.ts

   ```ts
   @Module({
     imports: [
       ConfigModule.forRoot({
         isGlobal: true,
         envFilePath
       })
     ]
   })
   export class AppModule {}
   ```

   

#### 二、自定义配置文件

官方支持自定义配置文件，需要使用`@nestjs/config`插件中的`load`属性去加载自定义配置文件

1、在项目根目录下创建环境文件：`config/configuration.ts`、`config/configuration.dev.ts`、`config/configuration.prod.ts`

config/configuration.ts

```ts
export default () => ({
    host: '8002'
});
```

config/configuration.dev.ts

```ts
export default () => ({
    host: '8003'
});
```

config/configuration.prod.ts

```ts
export default () => ({
    host: '8004'
});
```

2、通过`cross-env`注入不同的环境变量

```bash
{
    "scripts": {
        "build": "cross-env NODE_ENV=production nest build",
        "start": "cross-env NODE_ENV=development nest start",
        "start:dev": "cross-env NODE_ENV=development nest start --watch",
        "start:prod": "cross-env NODE_ENV=production node dist/main",
      }
}
```

3、在`app.module.ts`中配置文件

根据不同的环境变量动态配置`load`属性，这里的执行顺序是后面的属性会替换前面的属性，所以这里使用`push`方法

```ts
let load = [configuration]
if (process.env.NODE_ENV === 'development') {
  load.push(configurationDev);
} else {
  load.push(configurationProd);
}

```

完整代码如下：

app.module.ts

```ts
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import configurationDev from 'config/configuration.dev';
import configurationProd from 'config/configuration.prod';

let load = [configuration]
if (process.env.NODE_ENV === 'development') {
  load.push(configurationDev);
} else {
  load.push(configurationProd);
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load
    }),
})
export class AppModule {}

```





#### Joi插件可以校验环境变量的数据格式

