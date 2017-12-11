/**
 * @author panezhang
 * @date 2017/11/17-下午4:13
 * @file server
 */

import {resolve} from 'path';

import config from 'config';
import express from 'express';
import opn from 'opn';

const DEV = !!process.env.DEV;
const PORT = config.get('run.port');

const server = express();
const Render = DEV ? require('./render.dev').default : require('./render').default;

const render = new Render(server);

// TODO may use an alternative path for performance
server.use(express.static(resolve(__dirname, './public')));
server.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

server.get('*', async (req, res) => {
    const context = {title: 'Hello SSR!'}; // here we can customize title etc.
    const renderer = await render.get();
    renderer.renderToString(context, (err, html) => {
        if (err) {
            console.error('服务端渲染出错', err);
        }

        res.send(html);
    });
});

server.listen(PORT, (err) => {
    if (err) {
        console.error('启动 node 服务器失败', err);
        return;
    }

    const address = `http://localhost:${PORT}`;
    console.log(address);
    if (DEV) {
        opn(address);
    }
});
