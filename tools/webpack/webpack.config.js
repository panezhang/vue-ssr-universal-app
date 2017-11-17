/**
 * @author panezhang
 * @date 2017/11/30-下午5:32
 * @file webpack.config
 */

import entryClient from './webpack.entry-client.config';
import entryServer from './webpack.entry-server.config';
import server from './webpack.server.config';

export default [entryClient, entryServer, server];
