# Universal Vue SSR App Seed Project

As [vue-cli](https://github.com/vuejs/vue-cli) is an excellent scaffold to start a Vue SPA project, but to get the full benefits of Vue SSR still pains. [nuxt.js](https://nuxtjs.org/) is too heavy and not flexible enough, while [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0) seems a little complicated.

So, this repo is target to detail **How to start a universal web app using Vue SSR with less pains**.

## Get Started

- For koa server, we need a node version >= 7.6.
- For express server, I test with node version 6.9 only.

```bash
npm install

## dev with koa server, require node >= 7.6
npm start 
# or 
npm run koa

## dev with express
npm run express
```

## Build
```
## build
npm run build
# run
node build/server.js

## build for production, with uglify etc.
NODE_ENV=prod npm run build
# run
NODE_ENV=prod node build/server.js
```

Any questions, welcome to raise an issue.
