/**
 * @author panezhang
 * @date 2017/11/30-下午7:23
 * @file entry-server
 */

import createApp from './app';

export default (context) => {
    console.log('We may use context in the future.', context);

    const {app} = createApp(context);
    return app;
};
