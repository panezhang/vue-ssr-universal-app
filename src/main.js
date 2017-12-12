/**
 * @author panezhang
 * @date 2017/12/13-下午4:47
 * @file main
 */

import Vue from 'src/common/vue';
import App from 'src/app';
import {createRouter} from 'src/app/router';

export default () => {
    const router = createRouter();
    const app = new Vue({
        router,

        created() {
            console.log('Hello from console.');
        },

        render(h) {
            return h(App);
        }
    });

    return {app, router};
};

