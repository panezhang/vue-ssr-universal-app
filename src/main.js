/**
 * @author panezhang
 * @date 2017/12/13-下午4:47
 * @file main
 */

import {sync} from 'vuex-router-sync';

import Vue from './common/vue';
import App from './app';
import {createRouter} from './app/router';
import {createStore} from './app/store';

export const createApp = () => {
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
