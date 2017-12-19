/**
 * @author panezhang
 * @date 2017/11/17-下午7:22
 * @file client
 */

import Vue from 'src/common/vue';
import {createApp} from './main';
import {fetchComponentsAsyncData, reuseServerState, mixin as asyncDataMixin} from './common/vue/ssr/async-data';
import {registerComponentsStoreModules, mixin as storeModuleMixin} from './common/vue/ssr/store-module';

Vue.mixin(asyncDataMixin);
Vue.mixin(storeModuleMixin);
const {app, router, store} = createApp();

router.onReady(() => {
    const matchedComponents = router.getMatchedComponents();
    registerComponentsStoreModules(store, matchedComponents);
    reuseServerState(store);

    // Add router hook for handling asyncData.
    // Doing it after initial route is resolved so that we don't double-fetch the data that we already have.
    // Using router.beforeResolve() so that all async components are resolved.
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const prevMatched = router.getMatchedComponents(from);

        let diffed = false;
        const activated = matched.filter((component, idx) => diffed || (diffed = (prevMatched[idx] !== component)));
        registerComponentsStoreModules(store, activated);
        fetchComponentsAsyncData(store, to, activated).then(() => next()).catch(next);
    });

    app.$mount('#app');
});
