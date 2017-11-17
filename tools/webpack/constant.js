/**
 * @author panezhang
 * @date 2017/11/28-上午11:56
 * @file constant
 */

import config from 'config';

const buildConf = config.get('build');
export const DEBUG = buildConf.debug;
export const EXTRACT_CSS = buildConf.extractCSS;
