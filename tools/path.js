/**
 * @author panezhang
 * @date 2017/11/30-下午3:10
 * @file path
 */

import {resolve} from 'path';

const ROOT_DIR = resolve(__dirname, '..');

export const resolveSrc = (...args) => resolve(ROOT_DIR, 'src', ...args);
export const resolveRelease = (...args) => resolve(ROOT_DIR, 'build', ...args);
