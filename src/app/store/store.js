/**
 * @author panezhang
 * @date 2017/12/14-下午1:55
 * @file store
 */

import Vuex, {Store} from 'vuex';

import Vue from 'src/common/vue';
import {fetchItem} from 'src/app/resource';

Vue.use(Vuex);

export const createStore = () => new Store({
    state: {
        items: {}
    },

    mutations: {
        setItem: (state, {id, item}) => Vue.set(state.items, id, item)
    },

    actions: {
        fetchItem: ({commit}, id) => fetchItem(id).then(item => commit('setItem', {id, item}))
    }
});
