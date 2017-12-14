/**
 * @author panezhang
 * @date 2017/12/13-下午4:47
 * @file main
 */

import {sync} from 'vuex-router-sync';

import Vue from 'src/common/vue';
import App from 'src/app';
import {createRouter} from 'src/app/router';
import {createStore} from 'src/app/store';

export default () => {
    const router = createRouter();
    const store = createStore();
    sync(store, router);

    const app = new Vue({
        router,
        store,
        render: h => h(App)
    });

    return {app, router, store};
};
