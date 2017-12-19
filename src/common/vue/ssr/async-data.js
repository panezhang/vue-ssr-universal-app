/**
 * @author panezhang
 * @date 2017/12/19-下午2:45
 * @file async-data
 */

// server 端渲染时需
// client 端路由变化时
export const fetchComponentsAsyncData = (store, route, Components) => {
    const asyncDataHooks = Components.map(component => component.asyncData).filter(x => x);
    if (!asyncDataHooks.length) {
        return Promise.resolve();
    }

    return Promise.all(asyncDataHooks.map(hook => hook({store, route})));
};

// client 端混合时
export const reuseServerState = (store) => (window.__INITIAL_STATE__ && store.replaceState(window.__INITIAL_STATE__)); // eslint-disable-line

// client 端路由更新时（由于参数改变时不会触发 vue-router 的 beforeResolve
export const mixin = {
    beforeRouteUpdate(to, from, next) {
        const {asyncData} = this.$options;
        if (!asyncData) {
            next();
            return;
        }

        asyncData({store: this.$store, route: to}).then(() => next()).catch(next);
    }
};
