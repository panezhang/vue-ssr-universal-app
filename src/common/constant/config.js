/**
 * @author panezhang
 * @date 2017/12/11-下午1:33
 * @file config
 */
/* global __DEBUG__, __VUE_DEBUG__ */

export const DEBUG = __DEBUG__;
export const VUE_DEBUG = __VUE_DEBUG__;
export const VUE_ENV = process.env.VUE_ENV; // eslint-disable-line

const VUE_ENV_TYPE = {
    CLIENT: 'client',
    SERVER: 'server'
};

export const isServer = () => VUE_ENV === VUE_ENV_TYPE.SERVER;
export const isClient = () => VUE_ENV === VUE_ENV_TYPE.CLIENT;
