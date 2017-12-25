# 项目结构

## 整体目录

- **build**    构建后生成，用于部署到线上的完整文件包
- **config**  配置文件，用于部署不同环境时，区分不同配置
- **docs**    项目文档
- **src**       源码目录
- **tools**   构建脚手架 & webpack 配置

下面，主要针对 tools/webpack 和 src 两个目录进行说明。



## webpack

与 [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0) 项目不同，本项目在构建时分为了 3 个 entry-point，分别为 

- **entry-client.config**    浏览器端 bundle
- **entry-server.config**  服务器端 bundle
- **server.config**  start node server.js


相比 [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0) ，多打包了一个 server.js 文件，作为线上 server 的实际入口。




## src

- **app**  整个 Web APP 的主要业务代码
  - **resource**  封装与后端的交互细节
  - **router**      vue-router
  - **store**        store and modules
  - **view**         各个独立的页面，按层级来组织目录结构
  - **app.vue**  entry-client & entry-server 共用的 app 入口
- **common**  业务之间共用的代码，理想情况下，可以拆分出去，在多个项目间共用
  - **constant**  各种常量
  - **vue**  vue 配置 & 拓展
    - **ssr**  封装了 ssr 对 vue 进行魔改实现的一些细节
      - **async-data.js**  异步 data 的实现，在服务器端预取数据
      - **store-module.js**  声明式动态加载 store 模块
      - **title.js**  实现为每个 view 定制 title，并能够在 server 端渲染
- **public**  一些静态文件
- **dev-env.js**   封装开发时的一些 env
- **entry-client.js**  ***浏览器端入口***
- **entry-server.js**  ***服务器端入口***
- **index.html** 服务端渲染模板
- **main.js**  浏览器端 & 服务器端共用的入口函数
- **render.js**  Vue Server Bundle Render，正式环境
- **render.dev.js**  开发环境 render，封装了热更新的一些细节
- **server.express.js**  express 版本
- **server.koa.js**  koa 版本
- **start**  加载并启动 server  





## 细节说明

### 这个项目的 SSR 主要实现了什么功能？

- 封装了服务器端 render.js (prod) 和 render.dev.js (dev)
- [async-data](https://github.com/panezhang/vue-ssr-universal-app/blob/master/src/common/vue/ssr/async-data.js) 服务器端数据预取及浏览器端状态复用
  - 服务器端
    - 渲染快照：进行数据预取，并将状态写入 `window.__INITIAL_STATE__`
  - 浏览器端
    - 混合：将 `window.__INITIAL_STATE__` 同步到 store
    - 路由变化：调用 async data hook，在浏览器端获取数据
    - 路由更新：调用 async data hook，在浏览器端获取数据
- [store-module](https://github.com/panezhang/vue-ssr-universal-app/blob/master/src/common/vue/ssr/store-module.js) 声明式的自动加载 store 模块（避免在大型项目中 store 过大
  - 服务器端
    - 渲染快照：在数据预取前，注册 store 模块
  - 浏览器端
    - 混合：在同步 store 状态之前，注册 store 模块
    - 路由变化：注销不需要的模块，并注册新模块
    - 路由更新：无需操作
- [title](https://github.com/panezhang/vue-ssr-universal-app/blob/master/src/common/vue/ssr/title.js) 服务端预渲染 title，浏览器端切换页面时更新 title
  - 服务器端
    - 渲染快照：在数据预取之后（注意这里是之后），设置 $ssrContext.title，用于填充模板
  - 浏览器端
    - 混合：无需操作
    - 路由变化：更新 document.title
    - 路由更新：更新 document.title




### 与 [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0) 对比，有哪些改进？

- 代码层面上
  - 将开发时的逻辑完全从 server.js 中剥离，封装到 render.dev.js 中，使得 server.js 代码大大精简 
    - [server.express.js](https://github.com/panezhang/vue-ssr-universal-app/blob/master/src/server.express.js) VS [vue hacknews server.js](https://github.com/vuejs/vue-hackernews-2.0/blob/master/server.js)，大致只有三分之一的代码量。
    - [render.dev.js](https://github.com/panezhang/vue-ssr-universal-app/blob/master/src/render.dev.js) VS [setup-dev-server.js](https://github.com/vuejs/vue-hackernews-2.0/blob/master/build/setup-dev-server.js) 将 callback 的形式改为主动暴露一个 get 函数，逻辑解耦
  - 使用 node-config 区分开发和生成环境的配置项
  - 提供 koa 版的 server 实现（包括开发模式和生产模式
  - 支持在 component 上配置 storeModules，并自动动态 register/unregister 声明的 module
- 构建层面上
  - 多打包了一个 server.js，使得其可以正常使用任何想要用的新语言特性，例如 `import`




## TODO List

- 引入 Typescript
- 为不同的 view 定制不同 favicon、meta
- 更完整的错误处理
- Cache 机制
- SSR 开关
- PWA & service [worker](https://docs.npmjs.com/misc/scope)

