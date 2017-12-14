/**
 * @author panezhang
 * @date 2017/12/14-下午3:34
 * @file demo
 */

import Vue from 'src/common/vue';
import {fetchItem} from 'src/app/resource/demo';

export const M_TYPES = {
    SET_ITEM: 'demo/set_item'
};

export const A_TYPES = {
    FETCH_ITEM: 'fetchItem'
};

export default {
    state: () => ({
        items: {}
    }),

    mutations: {
        [M_TYPES.SET_ITEM]: (state, {id, item}) => Vue.set(state.items, id, item)
    },

    actions: {
        [A_TYPES.FETCH_ITEM]: ({commit}, id) => fetchItem(id).then(item => commit(M_TYPES.SET_ITEM, {id, item}))
    }
};
