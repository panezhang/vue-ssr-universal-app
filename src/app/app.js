/**
 * @author panezhang
 * @date 2017/11/17-下午4:33
 * @file app.js
 */

import Vue from 'src/common/vue';

export default () => {
    const app = new Vue({
        data: {
            text: 'Hello Vue SSR!'
        },

        created() {
            console.log('Hello from console.');
        },

        render(h) {
            return h('h1', this.text);
        }
    });

    return {app};
};
