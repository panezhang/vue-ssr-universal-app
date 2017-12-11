/**
 * @author panezhang
 * @date 2017/11/28-上午11:56
 * @file constant
 */

import config from 'config';

const buildConf = config.get('build');

export const DEBUG = buildConf.debug;
export const VUE_DEBUG = buildConf.vueDebug;
export const EXTRACT_CSS = buildConf.extractCSS;

export const GLOBAL_DEFINES = {
    'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
    __DEBUG__: DEBUG,
    __VUE_DEBUG__: VUE_DEBUG
};
