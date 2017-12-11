/**
 * @author KylesLight
 * @date 4/20/17-12:46 PM
 * @file vue-config
 */

import Vue from 'vue';
import {VUE_DEBUG} from 'src/common/constant/config';

Vue.config.devtools = VUE_DEBUG;
Vue.config.silent = !VUE_DEBUG;

export default Vue;
