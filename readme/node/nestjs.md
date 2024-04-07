## Nestjs



### 调试nestjs项目

在vscode中点击左侧的【运行和调试】按钮，然后点击【创建launch.json文件】，点击右下角的【添加配置】按钮，输入`npm`后选择【Node.js：通过npm启动】，`launch.json`文件配置如下：

```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch via NPM",
            "request": "launch",
            "runtimeArgs": [
                "run-script",
                "start:debug"
            ],
            "runtimeExecutable": "npm",
            "runtimeVersion": "18.18.2",
            "internalConsoleOptions": "neverOpen",
            "console": "integratedTerminal",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "type": "node"
        }
        
    ]
}
```

配置完成后店家【运行和调试】按钮，并点击`Launch via NPM`进行调试启动项目。在项目中即可在代码中打断点进行调试。



### token身份验证

1、安装插件

```bash
yarn add @nestjs/jwt
```

2、全局注册jwt

app.module.ts

```ts
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './user/contants';

@Module({
    imports: [
        JwtModule.register({
            global: true,
              secret: jwtConstants.secret,
              signOptions: {
                expiresIn: '10s' // 过期时间
              }
        })
    ]
})
export class AppModule {}
```

contants.ts

```ts
export const jwtConstants = {
    secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.'
}
```

3、封装public公用权限修饰符

role.decorator.ts

```ts
import { SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const Roles  = Reflector.createDecorator<string[]>();

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

4、封装权限守卫

token.guard.ts

```ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from 'src/user/contants';
import { IS_PUBLIC_KEY } from './roles.decrator';

@Injectable()
export class TokenGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly reflactor: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest<Request>();
        const token = (req.headers as any).token;
        const isPublic = this.reflactor.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true;
        }

        if (token) {
            try {
                const payload = this.jwtService.verify(token, {
                    secret: jwtConstants.secret
                });
                console.log('ppppp', payload);
                
                
                req['user'] = payload;
                return true;
            } catch (error) {
                throw new UnauthorizedException(error);
            }
        } else {
            throw new UnauthorizedException('无权限访问');
        }
        // return true;
    }
}
```





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



### 解决前端携带cookie的跨域配置

在main.ts中配置如下：

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
      exposedHeaders: 'Content-Range,X-Content-Range',
      credentials: true
    }
  });
  await app.listen(3000);
}
bootstrap();

```



### argon2加密和解密

在node中可以使用crypto、bcrypt、argon2做加密解密工作

由于crypto较为麻烦，bcrypt吃性能，所以这里采用argon2完成比较简单

**1、安装插件**

```bash
yarn add argon2
```

**2、注册时进行hash加密**

关键步骤

1. 引入argon2
   ```ts
   import * as argon2 from 'argon2'
   ```

2. 使用hash加密
   这里使用hash函数加密时会自动加盐

   ```ts
   try {
     const hashPassword = await argon2.hash(createUserDto.password);
     createUserDto.password = hashPassword
     return this.usersService.create(createUserDto);
   } catch (error) {
     console.log('argon2加密失败', error);
     throw new HttpException('argon2加密失败', 500);
   }
   ```

全代码：

```ts
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Session, Res, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Response } from 'express'
import * as argon2 from 'argon2'

import { UsersService } from './users.service';
import { Public } from '../decorators/role.decorator';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}


  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto) {
    const userList = await this.usersService.findByUsername(createUserDto.username);
    if (userList.length > 0) {
      throw new HttpException('用户名已存在', 200);
    }

    try {
      const hashPassword = await argon2.hash(createUserDto.password);
      createUserDto.password = hashPassword
      return this.usersService.create(createUserDto);
    } catch (error) {
      console.log('argon2加密失败', error);
      throw new HttpException('argon2加密失败', 500);
    }
  }
}

```

**3、登录时校验**

使用verify进行密码校验

```ts
const isMatch = await argon2.verify(user.password, loginUserDto.password);
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

#### 4、校验文件格式

通过`ParseFilePipe`管道中的`validators`校验器进行校验，并使用`FileTypeValidator`和`MaxFileSizeValidator`对文件进行类型和大小的教养

```ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../decorators/role.decorator';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @Public()
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({fileType: /(png|jpg|jpeg)$/}),
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
            message: '文件大小不能超过10M'
          })
        ]
      })
    )
    file: Express.Multer.File
  ) {
    return file.filename
  }
}

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
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    console.log('异常过滤器', exception.getResponse().valueOf());
    
    res.status(status).json({
      data: null,
      success: false,
      time: new Date(),
      path: req.url,
      message: exception.getResponse().valueOf(), // exception.message
      status
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

3. 如果要在app.module.ts中使用env环境变量，需要手动加载并转换配置项
   通过dotenv插件转换配置项

   ```ts
   import * as dotenv from 'dotenv'
   import * as fs from 'fs'
   
   function getEnv(env: string): Record<string, any> {
     if (fs.existsSync(env)) {
       return dotenv.parse(fs.readFileSync(env))
     }
     return {};
   }
   
   function biuldConnectionOptions() {
     const defaultEnv = getEnv('.env');
     const envConfig = getEnv(`.env.${process.env.NODE_ENV}`);
     const config = {
       ...defaultEnv,
       ...envConfig
     }
     
     return {
       type: config['DB_TYPE'],
       host: config['DB_HOST'],
       port: config['DB_PORT'],
       username: config['DB_USERNAME'],
       password: config['DB_PASSWORD'],
       database: config['DB_DATABASE'],
       // entities: [],
       autoLoadEntities: true,
       synchronize: config['DB_SYNCHRONIZE'],
     };
   }
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

1、安装插件

```bash
yarn add joi
```

2、配置校验规则

app.module.ts

```ts
import * as Joi from 'joi'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema: Joi.object({
        DB_TYPE: Joi.string().valid('mysql'),
          // 满足其中之一即可
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain()
        ),
        DB_PORT: Joi.number().default(3306),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_SYNCHRONIZE: Joi.boolean().required()
      })
    }),
    TypeOrmModule.forRoot(biuldConnectionOptions()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```





### 敏感数据做脱敏操作

某些数据比如密码等敏感数据不能返回给前端，所以需要在返回前做数据的过滤操作，这里可以使用后置拦截器对数据做删除操作。

1、第一中方式：自定义后置拦截器

2、第二种方式：使用`class-transformer`插件搭配`ClassSerializerInterceptor`类完成

1. 在entity上对password设置Exclude
   ```ts
   import { Exclude } from "class-transformer";
   import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
   
   @Entity()
   export class User {
       @PrimaryGeneratedColumn('uuid')
       id: string;
   
       @Column({
           unique: true
       })
       username: string;
   
       @Column()
       @Exclude()
       password: string;
   }
   
   ```

2. 在app.module.ts中配置拦截器
   ```ts
   import { ClassSerializerInterceptor, Module } from '@nestjs/common';
   
   @Module({
     providers: [
       {
         provide: APP_INTERCEPTOR,
         useClass: ClassSerializerInterceptor
       }
     ],
   })
   export class AppModule {}
   
   ```

   配置完成即可成功过滤掉password返回值
   
   > 注意，如果返回的对象是JavaScript纯对象，序列化会失败



### 日志

[![piqOsqe.png](https://s11.ax1x.com/2023/12/28/piqOsqe.png)](https://imgse.com/i/piqOsqe)



在nestjs中推荐两种插件方式完成日志打印，分别是pino和winston

**1、pino**

适合懒人使用，低配置即可完成使用

1. 安装插件
   ```bash
   yarn add nestjs-pino pino-http
   ```

2. 在app.module.ts中完成配置
   ```ts
   import { LoggerModule } from 'nestjs-pino';
   
   @Module({
     imports: [
       LoggerModule.forRoot()
     ]
   })
   export class AppModule {}
   ```

   重启项目后即可生效，在执行接口调用等等操作时会在打印日志，但是此时的日志打印很朴素，不好看，可以美化

3. 使用`pino-pretty`插件美化日志
   1）安装插件

   ```bash
   yarn add pino-pretty
   ```

   2）配置如下

   ```ts
   import { LoggerModule } from 'nestjs-pino';
   
   @Module({
     imports: [
       LoggerModule.forRoot({
         pinoHttp: {
           transport: {
             target: 'pino-pretty',
             options: {
               colorize: true
             }
           }
         }
       }),
     ]
   })
   export class AppModule {}
   ```

   完成配置后，日志打印会被格式化，看起来更好看

4. 使用`pino-roll`配置生成环境的日志记录
   上述的方式适合开发环境使用，在生成环境中使用`pino-roll`去做日志的记录
   1）安装插件

   ```bash
   yarn add pino-roll
   ```

   2）配置如下

   ```ts
   import { LoggerModule } from 'nestjs-pino';
   
   @Module({
     imports: [
       LoggerModule.forRoot({
         pinoHttp: {
           transport: process.env.NODE_ENV === 'development' ? {
             target: 'pino-pretty',
             options: {
               colorize: true
             }
           } : {
             target: 'pino-roll',
             options: {
               file: join('logs', 'log.txt'),
               frequency: 'daily',
               size: '10m',
               mkdir: true
             }
           }
         }
       }),
     ]
   })
   export class AppModule {}
   ```

   配置完成后，在生成环境中，会自定创建`logs`文件夹，用于存放日志文件



**2、winston**

1. 安装插件
   ```bash
   yarn add winston nest-winstaon winston-daily-rotate-file
   ```

   * winston-daily-rotate-file：用于生成log文件的插件

2. 配置logger如下：
   ```ts
   import { NestFactory } from '@nestjs/core';
   import * as session from 'express-session'
   
   import { AppModule } from './app.module';
   import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
   import { TransformInterceptor } from './interceptors/transform.interceptor';
   import { HttpExceptionFilter } from './filters/http-exception/http-exception.filter';
   import { NestExpressApplication } from '@nestjs/platform-express';
   import { join } from 'path';
   import { WinstonModule, utilities } from 'nest-winston';
   import { createLogger } from 'winston';
   import * as winston from 'winston'
   import 'winston-daily-rotate-file'
   
   async function bootstrap() {
     const app = await NestFactory.create<NestExpressApplication>(AppModule, {
       logger: WinstonModule.createLogger({
         instance: createLogger({
           transports: [
             new winston.transports.Console({
               level: 'info',
               format: winston.format.combine(
                 winston.format.timestamp(),
                 utilities.format.nestLike()
               )
             }),
             new winston.transports.DailyRotateFile({
               level: 'warn',
               dirname: 'logs',
               filename: 'application-%DATE%.log',
               datePattern: 'YYYY-MM-DD-HH',
               zippedArchive: true,
               maxSize: '20m',
               maxFiles: '14d',
               format: winston.format.combine(
                 winston.format.timestamp(),
                 winston.format.simple()
               )
             }),
             new winston.transports.DailyRotateFile({
               level: 'info',
               dirname: 'logs',
               filename: 'info-%DATE%.log',
               datePattern: 'YYYY-MM-DD-HH',
               zippedArchive: true,
               maxSize: '20m',
               maxFiles: '14d',
               format: winston.format.combine(
                 winston.format.timestamp(),
                 winston.format.simple()
               )
             })
           ]
         })
       })
     });
   }
   bootstrap();
   
   ```






### 大文件分片上传

一、前端

将文件进行分片

```tsx
let chunkSize = 1024 * 20;

let startP = 0;
let chunks = [];
while(startP < file.size) {
  chunks.push(file.slice(startP, startP + chunkSize));
  startP += chunkSize;
}
```

根据分片后的内容循环调用接口上传片段

```tsx
let randomStr = Math.random().toString().slice(2, 8);
    const filename = randomStr + '_' + file.name;
    let tasks: Promise<any>[] = [];
    chunks.forEach((chunk: any, index) => {
      const fd = new FormData();
      fd.set('name', filename + '-' + index);
      fd.append('files', chunk);
      // 调用接口
      tasks.push(uploadSlice(fd));
    })
```

所有的片段上传完毕后调用接口合并

```tsx
Promise.all(tasks).then(() => {
      merge(filename)
    })
```

全代码：

```tsx
import { Button, Card, Upload } from 'antd'
import { merge, uploadSlice } from '../../api/upload';

type Props = {}

export default function ProductCategory({}: Props) {

  function beforeUpload(file: any, fileList: any[]) {
    let chunkSize = 1024 * 20;

    let startP = 0;
    let chunks = [];
    while(startP < file.size) {
      chunks.push(file.slice(startP, startP + chunkSize));
      startP += chunkSize;
    }

    let randomStr = Math.random().toString().slice(2, 8);
    const filename = randomStr + '_' + file.name;
    let tasks: Promise<any>[] = [];
    chunks.forEach((chunk: any, index) => {
      const fd = new FormData();
      fd.set('name', filename + '-' + index);
      fd.append('files', chunk);
      // 调用接口
      tasks.push(uploadSlice(fd));
    })
    
    Promise.all(tasks).then(() => {
      merge(filename)
    })
    
    return false;
  }

  return (
    <Card title='商品分类'>
      <Upload beforeUpload={beforeUpload}>
        <Button type='primary'>上传文件</Button>
      </Upload>
    </Card>
  )
}
```

二、后端

在模块中创建文件上传

```ts
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../images'),
        // filename(_, file, callback) {
        //   const filename = new Date().getTime() + extname(file.originalname);
        //   return callback(null, filename);
        // }
      })
    })
  ],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}

```

创建接口，将接收到的片段赋值到指定目录下

```ts
@Post('uploadSlice')
  @UseInterceptors(FilesInterceptor('files'))
  @Public()
  createSlice(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { name: string }
  ) {
    console.log('files', files);
    console.log('name', body);
    const filename = body.name.match(/(.+)\-\d+$/)[1];
    const chunkDir = join(__dirname, '../images/chunks_' + filename);

    if (!existsSync(chunkDir)) {
      mkdirSync(chunkDir);
    }
    
    cpSync(files[0].path, chunkDir  + '/' + body.name);
    rmSync(files[0].path)
  }
```

创建合并接口

```ts
@Get('merge')
  @Public()
  merge(@Query('name') name: string) {
    // const chunkDir = 'uploads/chunks_' + name;
    const chunkDir = join(__dirname, '../images/chunks_' + name);

    const files = readdirSync(chunkDir)
   

    files.sort((a: string, b: string) => {
      const indexA = parseInt(a.split('-').pop());
      const indexB = parseInt(b.split('-').pop());
      return indexA - indexB;
    });

    console.log('files', files);
    
    let count = 0;
    let startP = 0;
    files.map(file => {
      const filePath = chunkDir + '/' + file;
      const stream = createReadStream(filePath);
      stream.pipe(createWriteStream(join(__dirname, '../images/' + name), {
        start: startP
      })).on('finish', () => {
        count++;

        if (count === files.length) {
          rm(chunkDir, {
            recursive: true
          }, () => {})
        }

      })

      startP += statSync(filePath).size;
    });

    return name;
  }
```



### redis

#### 一、在windows电脑上安装redis

参考地址：https://www.jb51.net/article/213976.htm

#### 二、在电脑上安装redis可视化工具

到redis官网中下载redisinsight工具：https://redis.com/redis-enterprise/redis-insight/#insight-form

#### 三、在nest中使用redis

1、安装redis插件

```bash
yarn add redis
```

2、创建redis模块

```bash
nest g module redis
```

3、链接redis

redis.module.ts

```ts
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: '127.0.0.1',
            port: 6379
          },
          password: '123456',
          database: 1
        })

        await client.connect();
        return client;
      }
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}

```

4、创建redis的service

```bash
nest g service redis
```

5、编写redis的service

redis.service.ts

```bash
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {

    @Inject('REDIS_CLIENT')
    private redisClient: RedisClientType

    async get(key: string) {
        return await this.redisClient.get(key)
    }

    async set(key: string, value: string | number, ttl?: number) {
        await this.redisClient.set(key, value);

        if (ttl) {
            await this.redisClient.expire(key, ttl)
        }
    }
}

```



### swagger生成接口文档

1、安装插件

```bash
yarn add @nestjs/swagger
```

2、在main.ts中创建swagger

```ts
  const config = new DocumentBuilder()
    .setTitle('会议室预定系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认证'
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document)
```

访问`http://localhost:3000/api-doc`即可访问到swagger接口文档

3、在controller上添加分类

```ts
@ApiTags('用户管理模块')
@Controller('user')
export class UserController {}
```

`ApiTags`装饰器代表添加接口分类

[![pFcSres.png](https://s21.ax1x.com/2024/03/12/pFcSres.png)](https://imgse.com/i/pFcSres)

4、给接口添加装饰器做属性解释

```ts
  @ApiBody({
    type: RegisterUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码失效/验证码不正确/用户已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String,
  })
  @Post('register')
  @Public()
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }
```

```ts
  @ApiBody({
    type: LoginUserDto
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginUserVo,
    description: '用户信息和token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: String,
    description: '用户不存在/密码错误',
  })
  @Post('admin/login')
  @Public()
  async adminLogin(@Body() loginUser: LoginUserDto) {
    return this.userService.login(loginUser, true);
  }

// LoginUserVo
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../role/entities/role.entity";

class UserInfo {
    @ApiProperty()
    id: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    nickName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    headPic: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    isFrozen: boolean;

    @ApiProperty()
    isAdmin: boolean;

    @ApiProperty()
    createTime: Date;

    @ApiProperty()
    roles: string[];

    @ApiProperty()
    permissions: string[]
}

export class LoginUserVo {
    @ApiProperty()
    userInfo: UserInfo;

    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}
```

5、添加权限解释

```ts
@ApiBearerAuth()
```



### repl 的模式

**一、MeetingRoomService.ts中添加`initData`函数**

```ts
import { Injectable } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { MeetingRoom } from './entities/meeting-room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MeetingRoomService {

  constructor(
    @InjectRepository(MeetingRoom)
    private meetingRoomRepositry: Repository<MeetingRoom>
  ) {}

  initData() {
    const room1 = new MeetingRoom();
    room1.name = '会议室12';
    room1.capacity = 10;
    room1.equipment = '白板';
    room1.location = '一层'

    const room2 = new MeetingRoom();
    room2.name = '会议室22';
    room2.capacity = 10;
    room2.equipment = '';
    room2.location = '二层'

    const room3 = new MeetingRoom();
    room3.name = '会议室32';
    room3.capacity = 30;
    room3.equipment = '电视';
    room3.location = '三层'

    this.meetingRoomRepositry.insert([room1, room2, room3])
  }
}
```

**二、增加repl模式**

1、添加 src/repl.ts

```ts
import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const replServer = await repl(AppModule);
    replServer.setupHistory(".nestjs_repl_history", (err) => {
        if (err) {
            console.error(err);
        }
    });
}
bootstrap();
```

2、然后在 package.json 里添加一个 scripts

```json
{
  "scripts": {
    "repl": "nest start --watch --entryFile repl",
  }
}
```

3、把服务停掉，执行：

```bash
yarn repl
```

4、执行service中的方法

先查看下 MeetingRoomService 的方法：

```bash
methods(MeetingRoomService)
```

然后调用下：

```bash
get(MeetingRoomService).initData()
```

数据库里也可以看到插入的三条数据



### Sse服务器推送事件

参考：https://blog.csdn.net/m0_37890289/article/details/135047840

`@Sse`是nestjs内置的装饰器，可以实现服务端主动向前端推送消息功能。前段通过浏览器内置的`EventSource`接收后端推送的信息。

1、创建模块

```bash
nest g res system-notification --no-spec
```

2、安装插件`@nestjs/event-emitter`

```bash
yarn add @nestjs/event-emitter
```

用户完成发布订阅模式，触发服务器推送消息

3、编写`systemNotification.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, Subject, map } from 'rxjs';

@Injectable()
export class SystemNotificationService {

    constructor(
        private eventEmitter: EventEmitter2,
    ) {}

  getNotification() {
    const subject = new Subject();
    this.eventEmitter.on('custom_event', data => {
        subject.next(data);
    })
    return subject.pipe(map(data => ({message: data})))
  }
}

```

在登录成功后触发事件`custom_event`

```ts
this.eventEmitter.emit('custom_event', '登录成功')
```

4、前端使用`EventSource`接收后端发送的信息

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>

        const eventSource = new EventSource('http://localhost:3000/system-notification')
        eventSource.onmessage = function (e) {
            console.log('12122',JSON.parse(e.data));
        }

        fetch('http://localhost:3000/user/login', {
            method: 'POST',
            body: JSON.stringify({
                username: 'zhaoyun111',
                password: '666666'
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            console.log(data);
        })

        
    </script>
</body>
</html>
```



### 面试题

#### Nest 的 middleware 和 interceptor有什么不同

区别有两点：

1、interceptor 是能从 ExecutionContext 里拿到目标 class 和 handler，进而通过 reflector 拿到它的 metadata 等信息的，这些 middleware 就不可以。

2、再就是 interceptor 里是可以用 rxjs 的操作符来组织响应处理流程的：

