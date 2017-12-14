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

export const reuseServerState = (store) => {
    if (window.__INITIAL_STATE__) { // eslint-disable-line
        store.replaceState(window.__INITIAL_STATE__); // eslint-disable-line
    }
};

// server 端渲染时
// client 端混合时
// client 端路由变化时
export const registerComponentsStoreModules = (store, Componets) => Componets.forEach(({storeModules}) => {
    if (!storeModules) return;
    Object.keys(storeModules).forEach(name => store.registerModule(name, storeModules[name]));
});

// client 端路由组件销毁的时候
export const unregisterStoreModules = (store, storeModules) => {
    if (!storeModules) return;
    Object.keys(storeModules).forEach((name) => {
        store.unregisterModule(name);
        delete store.state[name]; // TODO find better method to remove module state
    });
};

// server 端渲染时需
// client 端路由变化时
// client 端路由更新时（由于参数改变时不会触发 vue-router 的 beforeResolve
export const fetchComponentsAsyncData = (store, route, Components) => {
    const asyncDataHooks = Components.map(component => component.asyncData).filter(x => x);
    if (!asyncDataHooks.length) {
        return Promise.resolve();
    }

    return Promise.all(asyncDataHooks.map(hook => hook({store, route})));
};
