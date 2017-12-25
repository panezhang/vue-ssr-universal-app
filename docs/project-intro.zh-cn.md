## 项目整体思路

### 一、SSR 本质

无论是 Vue 还是 React，SSR 通常分为两步

- 在服务器端**渲染**出 Web APP 的一个**快照**
- 在浏览器端**混合**成一个具有**生命周期**的 Web APP

在这两步完成之后，SSR 就初步完成了。但由于在之后的过程中，路由是在浏览器端进行的，所以在**路由切换**和**路由更新**时，我们需要在浏览器端完成在服务器端渲染时做的事情，这样才能保证无论是服务器端路由（用户初次访问某个 url）还是浏览器端路由（切换路由），同一个页面能保持一致性。

因此，在为 SSR 开发两端通用功能时，需同时考虑该功能

- 在**服务器端渲染快照**时，要做什么，在哪里做
- 在**浏览器端混合**、**路由切换**、**路由更新**时，分别要做什么，在哪里做



### 二、服务器端渲染快照

#### 2.1 Renderer [官方示例](https://ssr.vuejs.org/zh/basic.html)

```javascript
// 第 1 步：创建一个 Vue 实例
const Vue = require('vue');
const app = new Vue({
  template: `<div>Hello World</div>`
});

// 第 2 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer();

// 第 3 步：将 Vue 实例渲染为 HTML
renderer.renderToString(app, (err, html) => {
  if (err) throw err;
  console.log(html);
  // => <div data-server-rendered="true">Hello World</div>
});
```

由上面的例子可以看出，渲染快照，最本质是需要一个 render。[Vue SSR API](https://ssr.vuejs.org/zh/api.html) 中，提供了两种创建 render 的方法

- createRenderer => Renderer
- createBundleRenderer => BundleRenderer

由于第一个 Renderer 对于开发时热更新不友好，且官方提供的 VueSSRClientPlugin 和 VueSSRServerPlugin 都致力于与 BundleRenderer 无缝对接，故我们选用的是 BundleRenderer。



#### 2.2 BundleRenderer 简单示例

```javascript
import {createBundleRenderer} from 'vue-server-renderer';

const template = `<div>Hello World</div>`;
const clientManifest = require('./vue-ssr-client-manifest.json'); // VueSSRClientPlugin 生成
const bundle = require('./vue-ssr-server-bundle.json'); // VueSSRServerPlugin 生成

// 第 1 步：创建一个 renderer
const renderer = createBundleRenderer(bundle, {
    template,
    clientManifest
});

// 第 2 步：渲染快照
renderer.renderToString(context, (err, html) => {
  if (err) throw err;
  console.log(html);
  // => <div data-server-rendered="true">Hello World</div>
});
```



#### 2.3 How is evetything work?

我们将代码拆分为三个主要部分

- entry-server.js 提供一个函数，该函数返回一个 Promise，该 Promise 会 resolve 一个 Vue app 实例。打包成 vue-ssr-server-bundle.json 之后，在服务器端由 BundleRenderer 负责调用该函数。
- entry-client.js 是浏览器端入口，负责创建并挂载 Vue app 实例（具体过程后面会讲到），打包生成 vue-ssr-client-manifest.json。
- server.js 读取 vue-ssr-client-manifest.json 和 vue-ssr-server-bundle.json，创建 BundleRenderer，渲染快照。

引用一张[官方的图](https://ssr.vuejs.org/zh/structure.html)，如下

![](https://cloud.githubusercontent.com/assets/499550/17607895/786a415a-5fee-11e6-9c11-45a2cfdf085c.png)



#### 2.4 开发模式服务器搭建

开发时的热更新，浏览器端我们依旧藉由 webpack-dev-middleware 和 webpack-hot-middleware 可以实现。

而动态更新 server 端的 BundleRender，则需要我们做一些额外的事情。首先，我们仔细观察会发现 createBundleRenderer 只依赖了 template，clientManifest 和 serverBundle 三个东西，而 clientManifest 和 serverBundle 在开发模式下，每次我们修改代码，webpack 都会重新生成一遍，因此，问题就归结为，**如何在 webpack 每次更新 clientManifest 和 serverBundle 之后，动态更新 BundleRender？**

为了解决这个问题，我们把 BundleRender 的创建和更新封装起来，并提供一个获取 renderer 的异步函数供 server.js 调用，这样就可以实现开发模式动态更新 BundleRender 的同时，保持了 server.js 代码的简洁。

于是在 server.js 里，我们只需要简单的

```javascript
const Render = DEV ? require('./render.dev').default : require('./render').default;
const render = new Render(server);
server.get('*', async (req, res) => {
    const context = {title: DEFAULT_TITLE, url: req.url}; // here we can customize title etc.
    const renderer = await render.get();
    renderer.renderToString(context, (err, html) => {
        if (err) {
            console.error('服务器端渲染出错', err);
        }

        res.send(html);
    });
});
```

重点在于 [render.js](https://github.com/panezhang/vue-ssr-universal-app/blob/master/src/render.js) 和 [render.dev.js](https://github.com/panezhang/vue-ssr-universal-app/blob/master/src/render.dev.js) 的实现上。

**render.dev.js** 主要做了三件事

- watch index.html，在变化时 update renderer
- webpack entry-client，建立 devMiddleware 和 hotMiddleware，并在 clientManifest 重新生成时 update renderer
- webpack entry-server，并在 bundle 重新生成时 update renderer



#### 2.5 [entry-server.js](https://github.com/panezhang/vue-ssr-universal-app/blob/master/src/entry-server.js)  

在服务器端渲染快照时，通常有两种方式介入快照的渲染过程

- 一是在 router.onReady 回调中介入，此时还没有真正开始 APP 的渲染
- 二是通过 mixin 的方式，在 entry-server.js 返回的 Promise 被 resolve 之后，BundleRender 渲染 APP 的过程中介入

我们通过第一种方式

- 进行服务器端路由
- 动态注册 store modules
- 调用 async data hooks，并将 state 注入 HTML（提供给浏览器端混合时用

我们通过第二种方式，实现一些需要在 async data hooks 结束之后，再做的事情，比如渲染页面 title。（设想一下我们写一个 Vue SSR 版的 flexible LP 页面）



### 三、浏览器端渲染

#### 3.1 概念

前面我们提到，我们需要在浏览器端进行一次**混合**，并在**路由切换**和**路由更新**时完成在服务器端渲染时做的事情。

之所以要进行一次**混合**，主要收益是在于最大化的复用服务器端渲染的结果，比如不用再一次调用 async data hooks，不用重复渲染一次。这里有一个要注意的点，`id="app"` 需要在 [app.vue](https://github.com/panezhang/vue-ssr-universal-app/blob/master/src/app/app.html) 根元素中标记。

那么，这里为什么要区分**路由切换**和**路由更新**呢？这就要稍微介绍一下 vue-router 的[导航守卫](https://router.vuejs.org/zh-cn/advanced/navigation-guards.html)，其主要分为 3 类，共 7 个守卫，如下

- 全局守卫
  - router.beforeEach
  - **router.beforeResolve**，与 router.beforeEach 类似，区别是在导航被确认之前，**同时在所有组件内守卫和异步路由组件被解析之后**，解析守卫就被调用
  - router.afterEach
- 路由级守卫，写在路由配置文件里
  - beforeEnter
- 组件级守卫，写在路由组件内
  - beforeRouteEnter
  - **beforeRouteUpdate**，在当前路由改变，但是该组件被复用时调用，举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候
  - beforeRouteLeave



#### 3.2 [entry-client.js](https://github.com/panezhang/vue-ssr-universal-app/blob/master/src/entry-client.js)

在浏览器端渲染时，同样有两种主要方式介入渲染过程

- 一是在 router.onReady 回调中
- 二是通过 mixin 的方式

这里跟 server 端有些不同，在于 server 端每次都是渲染一个独立的快照，而在浏览器端，则需要分为三种情况

- 初次混合
- 路由切换 `/a` -> `/b`
- 路由更新 `/a?t=1` -> `/a?t=2`

因此，要比服务器端复杂得多。我们用 async data 的实现来举例，因为 store modules 和 title 的实现其实类似。

- 首先，因为我们要复用 server 端注入的 store 状态，所以我们得先注册服务端注册过的 store modules，而要注册哪些模块，需要在 router.onReady 才能知道
- 然后，我们执行 reuseServerState，完成了状态的混入

接下来，我们需要在路由切换和路由更新时，让 APP 能触发 async data hooks。

- 处理路由切换：由于在混入时我们不想二次触发 hooks，所以在 router.onReady 回调中，添加 router.beforeResolve 守卫去进行 async data hook 的触发

- 处理路由更新：通过 [mixin](https://github.com/panezhang/vue-ssr-universal-app/blob/master/src/common/vue/ssr/async-data.js)，为所有组件添加一个 beforeRouteUpdate 守卫


