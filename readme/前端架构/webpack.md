参考地址：https://blog.csdn.net/zn740395858/article/details/122091062

参考地址：https://blog.csdn.net/qq_39261142/article/details/116176902

css-loader@6.5.1：会对@import和url()进行处理
style-loader@3.3.1：将CSS注入到JavaScript中，通过DOM操作控制css
autoprefixer@10.4.0：增加厂商前缀（css增加浏览器内核前缀）
postcss-loader@6.2.0：处理css的loader
babel-loader@8.2.3：webpack的babel插件，在webpack中运行babel
@babel/core@7.16.0：babel核心库
@babel/preset-env@7.16.4：将ES6转换为向后兼容的JavaScript
@babel/plugin-transform-runtime@7.16.4：处理async，await、import()等语法关键字的帮助函数
ts-loader@9.2.6



html-webpack-plugin@5.5.0：生成一个HTML5文件，在body中使用script标签引入webpack生成的bundle
clean-webpack-plugin@4.0.0：再次打包的时候，先把本地已有的打包后的资源清空，来减少它们对磁盘空间的占用
progress-bar-webpack-plugin@2.1.0：增加编译进度条
chalk@4.1.2
speed-measure-webpack-plugin@1.5.0：[非必备]构建速度分析，可以看到各个 loader、plugin 的构建时长，后续可针对耗时 loader、plugin 进行优化
webpack-bundle-analyzer@4.5.0：查看打包后生成的 bundle 体积分析



- webpack-merge@5.8.0：合并通用配置和特定环境配置
- mini-css-extract-plugin@2.4.5
- css-minimizer-webpack-plugin@3.1.4：优化、压缩 CSS



- prettier@2.4.1：代码格式的校验（并格式化代码），不会对代码质量进行校验
- eslint@8.2.0：代码格式的校验，代码质量的校验，`JS`规范
- eslint-config-prettier@8.3.0：覆盖`eslint`部分规则，解决冲突



> 在webpack5中，内置了资源模块（asset module），代替了file-loader和url-loader



### css热更新

> 启动热更新后，css抽离不会生效，还有不支持contenthash,chunkhash

```javascript
devServer: {
    hot: true, // 开启热更新
    hotOnly: true // 即便热更新没有生效，浏览器也不会自动刷新
},
plugins: [
    new webpack.HotModuleReplacementPlugin()
]
```

### 打包生产时，将css抽离到css文件夹下
> MiniCssExtractPlugin不要用于开发模式，因为它会影响热更新

```javascript
module: {
    rules: [{
        test: /\.less$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    // css modules 开启
                    modules: true
                }
            },
            {
                loader: 'postcss-loader'
            },
            'less-loader'
        ]
    }]
},
plugins: [
    new MiniCssExtractPlugin({
        filename: 'css/[name]-[contenthash:8].css'
    })
]
```

### css自动补充前缀
> npm i postcss-loader autoprefixer -D

```javascript
// 新建postcss.config.js
module.exports = {
    plugins: {
        require('autoprefixer')({
            overrideBrowserslist: ["last 2 versions", "> 1%"]
        })
    }
}
```

### 压缩css文件

方法一：

> npm i optimize-css-assets-webpack-plugin cssnano -D

```javascript
// webpack.config.js
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
plugins: [
    new optimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
            discardComments: {
                removeAll: true
            }
        }
    })
]
```

方法二：

参考地址：https://webpack.docschina.org/plugins/mini-css-extract-plugin/#minimizing-for-production

安装插件：`npm i css-minimizer-webpack-plugin -D`

webpack.config.js

```js
module.exports = {
    optimization: {
        minimizer: [
            new CssMinimizerWebpackPlugin()
        ],
    }
}
```





### 压缩HTML文件

> npm i html-webpack-plugin -D

```javascript
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
plugins: [
    new HtmlWebpackPlugin({
        title: '首页',
        template: './scr/index.html',
        filename: 'index.html',
        minify: {
            // 压缩HTML文件
            removeComments: true, // 移除HTML中的注释
            collapseWhitespace: true, // 删除空白符与换行符
            minifyCSS: true // 压缩内联css
        }
    })
]
```



### 配置静态文件目录

默认情况下，打包以后的文件是散在 dist 文件夹中的，难以区分和维护。

现在，需要将他们分门别类地放进对应的文件夹中，就需要对文件名做统一的管理。

webpack.config.js

```js
module.exports = {
    module: {
        rules: [
          // 图片文件
          {
            test: /\.(jpe?g|png|gif)$/i,
            type: "asset",
            generator: {
              filename: "images/[name]_[hash][ext]", // 独立的配置
            },
              parser: {
                  dataUrlCondition: {
                    maxSize: 10 * 1024 // 小于10kb的图片会转换成base64
                }
              }
          },
          // svg 文件
          {
            test: /\.svg$/i,
            type: "asset",
            generator: {
              dataUrl(content) {
                content = content.toString();
                return miniSVGDataURI(content);
              },
            },
          },
          // 字体文件
          {
            test: /\.(otf|eot|woff2?|ttf|svg)$/i,
            type: "asset",
            generator: {
              filename: "fonts/[name]_[hash][ext]",
            },
          },
          // 数据文件
          {
            test: /\.(txt|xml)$/i,
            type: "asset/source", // exports the source code of the asset
          },
        ]
    }
}
```



### json5的转换

参考地址：https://webpack.docschina.org/guides/asset-management/#loading-images

查找目录：管理资源/加载数据

安装插件`npm i json5 -D`

webpack.config.js

```js
const json5 = require('json5');

module.exports = {
    module: {
        rules: [
            {
                test: /\.json5$/,
                type: 'json',
                parser: {
                    parse: json5.parse
                }
            }
        ]
    }
}
```



### babel处理ES6

* npm i babel-loader @babel/core @babel/preset-env -D
* polyfill语法垫片，解决ES6兼容性，npm i @babel-polyfill -S，由于polyfill体积过于庞大，需要按需引用

```javascript
module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                // 语法转换的插件，实现polyfill按需引入
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: {
                                edge: '17',
                                firefox: '60',
                                chrome: '67',
                                safari: '11.1'
                            },
                            core: 2, // 新版本需要制定核心库版本
                            useBuiltIns: 'usage' // 按需注入，useage: 全自动检测，entry：需要在入口文件引入polyfill
                        }
                    ]
                ]
            }
        }
    }]
}
```

### jsx语法转换
* npm i @babel/preset-react -D

```javascript
module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                // 语法转换的插件，实现polyfill按需引入
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: {
                                edge: '17',
                                firefox: '60',
                                chrome: '67',
                                safari: '11.1'
                            },
                            core: 2, // 新版本需要制定核心库版本
                            useBuiltIns: 'usage' // 按需注入，useage: 全自动检测，entry：需要在入口文件引入polyfill
                        }
                    ],
                    '@babel/preset-react'
                ]
            }
        }
    }]
}
```

也可以在根目录创建.babelrc文件，将上面的options复制进去就可以了

```javascript
{
    // 语法转换的插件，实现polyfill按需引入
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    edge: '17',
                    firefox: '60',
                    chrome: '67',
                    safari: '11.1'
                },
                core: 2, // 新版本需要制定核心库版本
                useBuiltIns: 'usage' // 按需注入，useage: 全自动检测，entry：需要在入口文件引入polyfill
            }
        ],
        '@babel/preset-react'
    ]
}
```

### loader的范围
> loader是一个消耗性能的大户
* 使用include或者exclude确定loader范围

```javascript
module: {
    rules: [{
        test: /\.css$/,
        include: path.resolve(__dirname, './src'),
        use: ['style-loader', 'css-loader']
    }]
}
```

### resolve 下的moudles
* 查找第三方插件的范围，默认情况下在当前项目中的node_modules找不到，则向上级查找，如此循环。
* 可用过modules约束查找范围为当前项目

```javascript
resolve: {
    modules: [path.resolve(__dirname, './node_modules')] // 就在我的项目下的node_modules找，不用向上级找
}
```

### externals引入外部资源
* 可以将插件放到CDN上，通过.html文件引入，然后配置externals就可以import xx from 'xxx'来进行使用

```html
<script src="xxxx/jQuery.js"></script>
```

```javascript
externals: {
    jquery: 'jQuery'
}
```

### output 的publicPath
* 打包之后会在主入口文件带上路径

```javascript
output: {
    publicPath: 'http://www.baidu.com/'
}
```

### webpack-merge 合并webpack的开发和生产配置文件
> npm i webpack-merge -D

* 新建webpack.config.base.js，webpack.config.dev.js，webpack.confg.prod.js
* 通过webpack-merge合并文件

```javascript
// webpack.config.dev.js
const baseConfig = require('./webpack.config.base.js');
const merge = require('webpack-merge');

const devConfig = {};

module.exports = merge(baseConfig, devCOnfig);
```

* 也可以通过返回函数来合并文件，然后配置build:fn，关键词是--env.production环境变量

```javascript
// webpack.config.fn.js
const baseConfig = require('./webpack.config.base.js');
const prodConfig = require('./webpack.config.prod.js');
const devConfig = require('./webpack.config.dev.js');
const merge = require('webpack-merge');

module.exports = (env) => {
    if (env.production) {
        return merge(baseConfig, prodConfig);
    } else {
        return merge(baseConfig, devConfig);
    }
}
```

* 在package.json中配置script

```json
{
    "scripts": {
        "dev": "webpack-dev-server --config ./webpack.config.dev.js",
        "build": "webpack --confg ./webpack.config.prod.js",
        "build:fn": "webpack --env.production --config ./webpack.config.fn.js"
    }
}
```

### 通过cross-env设置环境变量，解决windows端和linux端的路径问题


```json
{
    "scripts": {
        "build:fn": "webpack cross-evn NODE_ENV=test --config ./webpack.config.fn.js"
    }
}
```

* 这种方式设置的环境变量可以通过process.env.NODE_ENV来获取

### tree-shaking
* 代码不会被执行，不可到达
* 代码执行的结果不会被用到
* 代码只会影响死的变量（只读不写）
* js tree shaking只支持ES module的引入方式

> npm i glob-all purify-css purifycss-webpack -D

> tree shaking 值在生产环境才会生效

```javascript
const PurifyCSS = require('purifycss-webpack');
const glob = require('glob-all');

plugins: [
    // 清除无用css
    new PurifyCSS({
        paths: glob.sync([
            // 要做CSS Tree Shaking的路径文件
            path.resolve(__dirname, './src/*.html'), // 请注意，我们同样需要对html文件进行tree shaking
            path.resolve(__dirname, './src/*.js')
        ])
    })
]
```

### package.json中的sideEffects副作用

```json
{
    "sideEffects": [
        // 不需要摇掉.less文件
        "*.less"
    ]
}
```

### 代码分割

```javascript
optimization: {
    splitChunks: {
        chunks: 'all', // 对同步initial， 异步async， 所有的chunks公共代码模块都被抽离出来 all
        minSize: 30000, // 最小尺寸，当模块大于30kb时进行分割
        maxSize: 0, // 对模块进行二次分割时使用，不推荐使用
        minChunks: 1, // 打包生成的chunk文件最少有几个chunk引用了这个模块
        maxAsyncRequests: 5, // 最大异步请求数，默认5
        maxInitialRequests: 3, // 最大初始化请求数，入口文件同步请求，默认2
        automaticNameDelimiter: '-', // 打包分隔符号
        name: true, // 打包后的名称，出了布尔值，还可以接收一个函数
        catchGroups: { // 缓存组
            lodash: { // lodash组，这里面可以配置上面的参数
                test: /lodash/,
                name:'lodash', // 要缓存的，分割出来的chunk名字
                priority: -10 // 缓存组优先级，数字越大，优先级越高，当发生冲突时，使用谁来覆盖
            },
            react: {
                test: /react|react-dom/,
                name: 'react',
                priority: -9
            }
        }
    }
}
```

### 预取和预加载

* 预取prefetch，在浏览器进程空闲时间加载资源，比如初始化页面时，立马要使用的模块加载完成后再加载不立即使用的模块
* 参考链接<https://blog.csdn.net/hjc256/article/details/100135886>

```javascript
// click.js
export default () => {
    const ele = document.createElement('div');
    ele.innerText = 'Meskjei';
    document.body.appendChild(ele);
}

// index.js
document.addEventListener('click', async (e)=>{
    const { default: func } = await import(/* webpackPrefetch: true */'./click');
    func();
});
```

* 去加载preload，同时加载出资源

```javascript
import (/* webpackPreload: true */, 'Component');
```

### 作用域提升

```javascript
optimization: {
    concatenateModules: true
}
```

### DllPlugin插件打包第三方类库，预编译

> DLL动态链接库，其实就是做缓存，只会提升webpack打包的速度，并不能减少最后生成的代码体积

> .dll文件称为动态链接库，在windows系统会经常看到

* webpack已经内置了动态链接库的支持
* DllPlugin：用于打包出一个个单独的动态链接库文件
* DllReferencePlugin：用于在主要的配置文件中引入DllPlugin插件打包好的动态链接库文件

```javascript
// webpack.congig.dll.js
const path = require('path');
const { DllPlugin } = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        react: ['react', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, './dll'),
        filename: '[name].dll.js',
        library: 'react'
    },
    plugins: [
        new DllPlugin({
            // manifest.json文件的输出位置
            path: path.join(__dirname, './dll', '[name]-manifest.json'),
            // 定义打包的公共vendor文件对外暴露的函数名
            name: 'react'
        })
    ]
}
```

```javascript
// webpack.config.js
// 构建时，webpack会去找react-manifest.json文件，如果文件内包含了某个模块，name构建时就不打包该模块
plugins: [
    new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, './dll/react-manifest.json')
    })
]
```

```html
<script src="../dll/react.dll.js"></script>
```

* 也可以使用npm i add-asset-html-webpack-plugin将打包后的.dll文件注入到我们生成的index.html中，在webpack.config.js中进行更改

```javascript
new AddAssetHtmlWebpackPlugin({
    filepath: path.resolve(__dirname, '../dll/react.dll.js') // 对应的dll文件路径
})
```

### webpack5已经不用dll方式了，而是用HardSourceWebpackPlugin，效果一样的优化，第一次构建成功后，第二次的构建时间会大大的缩短

```javascript
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

plugins: [
    new HardSourceWebpackPlugin()
]
```

### 使用happypack并发执行任务

> npm i happypack -D

* 如果项目比较大可以考虑用happypack，如果项目本身比较小，用happypack可能打包时间会增加，因为本身启动线程就会耗时

```javascript
// webpack.config.js
const HappyPack = require('happyPack');
const os = require('os');
var happyThreadPool = HappyPack.ThreadPool({size: os.cups().length});

modules: {
    rules: [{
        test: /\.css$/,
        include: path.resolve(__dirname, './src'),
        use: ['happypack/loader?id=css']
    }]
},
plugins: [
    new HappyPack({
        id: 'css',
        loaders: ['style-loader', 'css-loader'],
        threadPool：happyThreadPool
    })
]
```

> 有坑，不能与minicssextractplugin很好的配合



### 由于使用了ts，所以引入less或scss文件时报类型错误

由于使用了 ts，在导入文件的时候可能会出现类型错误，如 css module 的 import style from './index.scss' 报错 找不到模块“./index.scss”或其相应的类型声明，因此需要手动编写声明类型文件，在 src 目录下新建 typings 目录并新建 file.d.ts 文件

```ts
declare module '*.css' {
    const classes: {
        readonly [k: string]: string
    }
    export default classes
}

declare module '*.less' {
    const classes: {
        readonly [k: string]: string
    }
    export default classes
}

declare module '*.scss' {
    const classes: {
        readonly [k: string]: string
    }
    export default classes
}

declare module '*.sass' {
    const classes: {
        readonly [k: string]: string
    }
    export default classes
}
```



### 打包类型检查

目前 webpack 打包时不会有类型检查信息（为了编译速度，babel 编译 ts 时直接将类型去除，并不会对 ts 的类型做检查），即使类型不正确终端也会显示打包成功，有误导性，为此添加上打包类型检查，下载第三方包：

> `fork-ts-checker-webpack-plugin`：ts 类型检查，让终端可以显示类型错误

`yarn add fork-ts-checker-webpack-plugin` 

![image-20220127164905079](https://woniumd.oss-cn-hangzhou.aliyuncs.com/web/wujie/20220127164916.png)
