/**
 * @author panezhang
 * @date 2017/11/17-下午7:22
 * @file client
 */
/* global window */

import Vue from 'src/common/vue';
import createApp from './main';

const {app, router, store} = createApp();
if (window.__INITIAL_STATE__) { // eslint-disable-line no-underscore-dangle
    store.replaceState(window.__INITIAL_STATE__); // eslint-disable-line no-underscore-dangle
}

Vue.mixin({
    beforeRouteUpdate(to, from, next) {
        const {asyncData} = this.$options;
        if (!asyncData) {
            next();
            return;
        }

        asyncData({store: this.$store, route: to}).then(() => next()).catch(next);
    }
});

router.onReady(() => {
    // Add router hook for handling asyncData.
    // Doing it after initial route is resolved so that we don't double-fetch the data that we already have.
    // Using router.beforeResolve() so that all async components are resolved.
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const prevMatched = router.getMatchedComponents(from);

        let diffed = false;
        const activated = matched.filter((component, idx) => diffed || (diffed = (prevMatched[idx] !== component)));
        const asyncDataHooks = activated.map(component => component.asyncData).filter(x => x);
        if (!asyncDataHooks.length) {
            next();
            return;
        }

        const asyncDataPromises = asyncDataHooks.map(hook => hook({store, route: to}));
        Promise.all(asyncDataPromises).then(() => next()).catch(next);
    });

    app.$mount('#app');
});
