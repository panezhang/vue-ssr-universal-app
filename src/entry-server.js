/**
 * @author panezhang
 * @date 2017/11/30-下午7:23
 * @file entry-server
 */

import {
    createApp,
    registerComponentsStoreModules,
    fetchComponentsAsyncData
} from './main';

export default context => new Promise((resolve, reject) => {
    const {app, router, store} = createApp(context);

    // handle server router
    router.push(context.url);
    router.onReady(
        () => {
            const matchedComponents = router.getMatchedComponents();
            registerComponentsStoreModules(store, matchedComponents);
            fetchComponentsAsyncData(store, router.currentRoute, matchedComponents).then(() => {
                context.state = store.state; // 将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML
                resolve(app);
            }).catch(reject);
        },

        reject // 这里的 reject 会在 renderToString 的时候接收到
    );

    return app;
});
