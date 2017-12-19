# Universal Vue SSR App Seed Project

As [vue-cli](https://github.com/vuejs/vue-cli) is an excellent scaffold to start a Vue SPA project, but to get the full benefits of vue-ssr still pains. [nuxt.js](https://nuxtjs.org/) is too heavy and not flexible enough, while [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0) seems a little complicated.

So, this repo is target to detail **How to start a universal web app with vue-ssr**.

## Get Started

Please use NodeJS version as newer as possible.

```bash
npm install

## dev with koa server
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

Any questions, welcome to leave an issue.
