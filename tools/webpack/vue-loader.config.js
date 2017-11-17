/**
 * @author panezhang
 * @date 2017/11/28-上午11:56
 * @file vue-loader.config
 */

import autoprefixer from 'autoprefixer';
import {EXTRACT_CSS} from './constant';

export default {
    extractCSS: EXTRACT_CSS,
    preserveWhitespace: false,
    postcss: [
        autoprefixer({
            browsers: ['last 3 versions']
        })
    ]
};
