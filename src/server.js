/**
 * @author panezhang
 * @date 2017/11/17-下午4:13
 * @file server
 */

import config from 'config';
import express from 'express';

const PORT = config.get('run.port');

const server = express();
server.get('*', (req, res) => {
    res.send('Hello World!');
});

server.listen(PORT, err => (!err && console.log(`http://localhost:${PORT}`)));
