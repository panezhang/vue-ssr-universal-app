/**
 * @author panezhang
 * @date 2017/11/17-下午4:13
 * @file server
 */

import path from 'path';

import Koa from 'koa';
import parseBody from 'koa-body';
import favicon from 'koa-favicon';
import mount from 'koa-mount';
import send from 'koa-send';
import serve from 'koa-static';

import {DEFAULT_TITLE} from './common/vue/ssr/title';
import {DEV} from './dev-env';

const Render = DEV ? require('./render.dev').default : require('./render').default;

const resolvePublic = (...args) => path.resolve(__dirname, 'public', ...args);
const server = new Koa();

// x-response-time
server.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms} ms`);
});

// parse request body
server.use(parseBody());

// logger
server.use(async (ctx, next) => {
    const start = Date.now();
    console.log(`--> ${ctx.method} ${ctx.path}`, ctx.request.query, ctx.request.body);
    await next();
    const ms = Date.now() - start;
    console.log(`<-- ${ctx.method} ${ctx.path} ${ms} ms`);
});

// global error handle
server.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.error(err);
        ctx.body = 'The server is sleeping.'; // here we can handle uncaught common err
    }
});

// serve kinds of static files
server.use(favicon(resolvePublic('./logo.png')));
server.use(mount('/robots.txt', async ctx => send(ctx, '/robots.txt', {root: resolvePublic()})));
server.use(mount('/static', serve(resolvePublic('./static'))));

// where ssr happen
const render = new Render(server);
server.use(async (ctx) => {
    const context = {title: DEFAULT_TITLE, url: ctx.req.url};
    const renderer = await render.get();
    ctx.set('Content-Type', 'text/html; charset=utf-8');
    ctx.body = await new Promise((resolve, reject) => renderer.renderToString(context, (err, html) => {
        if (err) {
            console.error('服务端渲染出错', err);
            return reject(err);
        }

        return resolve(html);
    }));
});

export default server;
