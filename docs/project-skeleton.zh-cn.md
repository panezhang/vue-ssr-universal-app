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
- **entry-client.js**  浏览器端入口
- **entry-server.js**  服务器端入口
- **index.html** 服务端渲染模板
- **main.js**  浏览器端 & 服务器端共用的入口函数
- **render.js**  Vue Server Bundle Render，正式环境
- **render.dev.js**  开发环境 render，封装了热更新的一些细节
- **server.express.js**  express 版本
- **server.koa.js**  koa 版本
- **start**  加载并启动 server



## 一些细节说明

### 这个项目的 SSR 主要实现了些什么功能？

### 与 [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0) 对比，有哪些改进？

### render.dev.js

### 浏览器端混合时的注意事项

- router 钩子添加的时机
- 复用 server 端状态的时机

### router 规范

### serve 静态资源

### koa error handle



## TODO List

- 引入 Typescript
- 为不同的 view 定制不同 favicon、meta
- 更完整的错误处理
- Cache 机制
- SSR 开关
- PWA & service worker

