/**
 * @author panezhang
 * @date 2017/11/17-下午7:22
 * @file client
 */

import createApp from './main';

const {app, router} = createApp();
router.onReady(() => {
    // TODO async fetch
    app.$mount('#app');
});
