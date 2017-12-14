/**
 * @author panezhang
 * @date 2017/12/14-下午1:55
 * @file store
 * 这里只放全局共用的状态
 */

import Vuex, {Store} from 'vuex';

import Vue from 'src/common/vue';

Vue.use(Vuex);

export const createStore = () => new Store({state: {}});
