/**
 * @author panezhang
 * @date 2017/12/12-下午7:41
 * @file RouterMap
 */

import Demo from 'src/app/view/demo';
import Index from 'src/app/view/index';

export default {
    index: {
        path: '/index',
        title: '主页',
        component: Index
    },

    demo: {
        path: '/demo',
        title: 'Demo',
        component: Demo
    },

    root: {
        path: '/',
        redirect: '/index'
    },

    notFound: {
        path: '*',
        redirect: '/index'
    }
};
