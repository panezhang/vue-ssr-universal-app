/**
 * @author panezhang
 * @date 2017/12/19-下午2:46
 * @file title
 */

export const DEFAULT_TITLE = 'Hello SSR!';

function getTitle(vm) {
    const {title} = vm.$options;
    if (title) {
        return typeof title === 'function' ? title.call(vm) : title;
    }
}

function setServerTitle(vm) {
    const title = getTitle(vm);
    if (title) {
        vm.$ssrContext.title = `${title} - ${DEFAULT_TITLE}`;
    }
}

function setClientTitle(vm) {
    const title = getTitle(vm);
    if (title) {
        document.title = `${title} - ${DEFAULT_TITLE}`;
    }
}

export const serverMixin = {
    created() { // 这里不能用 async function，因为在 server 端不能保证执行完毕
        setServerTitle(this);
    }
};

export const clientMixin = {
    mounted() {
        setClientTitle(this);
    },

    updated() {
        setClientTitle(this);
    }
};
