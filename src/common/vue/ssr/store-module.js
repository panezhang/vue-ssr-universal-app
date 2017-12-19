/**
 * @author panezhang
 * @date 2017/12/19-下午2:46
 * @file store-module
 */

import {isClient} from 'src/common/constant/config';

const REGISTERED_MODULE = {};

// server 端渲染时
// client 端混合时
// client 端路由变化时
export const registerComponentsStoreModules = (store, Componets) => Componets.forEach(({storeModules}) => {
    if (!storeModules) return;

    Object.keys(storeModules).forEach((name) => {
        if (isClient() && REGISTERED_MODULE[name]) return; // 服务端不需要判断

        REGISTERED_MODULE[name] = true;
        store.registerModule(name, storeModules[name]);
    });
});

// client 端路由组件销毁的时候
const unregisterStoreModules = (store, storeModules) => {
    if (!storeModules) return;

    Object.keys(storeModules).forEach((name) => {
        if (!REGISTERED_MODULE[name]) return;

        store.unregisterModule(name);
        delete store.state[name];
        delete REGISTERED_MODULE[name];
    });
};

export const mixin = {
    destroyed() {
        const {$options: {storeModules}, $store} = this;
        unregisterStoreModules($store, storeModules);
    }
};
