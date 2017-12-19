/**
 * @author panezhang
 * @date 2017/11/17-下午4:13
 * @file server
 */

import path from 'path';

import compression from 'compression';
import express from 'express';
import favicon from 'serve-favicon';

import {DEFAULT_TITLE} from './common/vue/ssr/title';
import {DEV} from './dev-env';

const Render = DEV ? require('./render.dev').default : require('./render').default;

const resolvePublic = (...args) => path.resolve(__dirname, 'public', ...args);
const server = express();

server.use(compression());
server.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

server.use(favicon(resolvePublic('./logo.png')));
server.use('/robots.txt', express.static(resolvePublic('./robots.txt')));
server.use('/static', express.static(resolvePublic('./static')));

const render = new Render(server);
server.get('*', async (req, res) => {
    const context = {title: DEFAULT_TITLE, url: req.url}; // here we can customize title etc.
    const renderer = await render.get();
    renderer.renderToString(context, (err, html) => {
        if (err) {
            console.error('服务端渲染出错', err);
        }

        res.send(html);
    });
});

export default server;
