/**
 * @author panezhang
 * @date 2017/12/19-下午7:40
 * @file dev-env
 */

export const DEV = !!process.env.DEV;
export const SERVER_TYPE = process.env.SERVER_TYPE || 'koa';

export const isKoa = () => SERVER_TYPE === 'koa';
