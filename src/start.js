/**
 * @author panezhang
 * @date 2017/12/19-下午7:25
 * @file server
 */

import config from 'config';
import opn from 'opn';

import {DEV, SERVER_TYPE} from './dev-env';

const PORT = config.get('run.port');
const server = require(`./server.${SERVER_TYPE}`).default; // eslint-disable-line import/no-dynamic-require

server.listen(PORT, (err) => {
    if (err) {
        console.error('启动 node 服务器失败', err);
        return;
    }

    const address = `http://localhost:${PORT}`;
    console.log(`${SERVER_TYPE} is listening at ${address}`);

    if (DEV) opn(address);
});
