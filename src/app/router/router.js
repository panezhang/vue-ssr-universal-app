/**
 * @author panezhang
 * @date 2017/12/12-下午7:05
 * @file router
 */

import Router from 'vue-router';

import Vue from 'src/common/vue';
import routes from './routes';

Vue.use(Router);

export const createRouter = () => new Router({mode: 'history', routes});
