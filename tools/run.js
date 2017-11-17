/**
 * 基于React Starter Kit (https://www.reactstarterkit.com/)
 * modified by panezhang
 *
 * 解析命令行参数，并设置环境变量，提供命令行接口
 *
 * @date 2016-01-22
 */
/* eslint-disable import/no-dynamic-require */

import minimist from 'minimist';

// our modules
import run from './run.function';

// 提供命令行接口
const args = minimist(process.argv.slice(2));
const module = process.argv[2];

console.log(`NODE_ENV=${process.env.NODE_ENV}`);

run(require(`./${module}.js`), args).catch(err => console.error(err.stack));

