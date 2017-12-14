/**
 * @author panezhang
 * @date 2017/11/30-下午7:23
 * @file entry-server
 */

import createApp from './main';

export default context => new Promise((resolve, reject) => {
    console.log('We may use context in the future.', context);
    const {app, router} = createApp(context);

    // handle server router
    router.push(context.url);
    router.onReady(() => {
        // TODO async fetch
        // handle server router done
        resolve(app);
    }, reject); // 这里的 reject 会在 renderToString 的时候接收到
    return app;
});
