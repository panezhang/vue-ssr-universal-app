/**
 * @author panezhang
 * @date 2017/11/28-上午11:56
 * @file webpack.client.config
 */

import webpack from 'webpack';
import merge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';

import {resolveSrc, resolveRelease} from 'tools/path';
import {GLOBAL_DEFINES} from './constant';
import base from './webpack.base.config';

export default merge(base, {
    target: 'node',
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false
    },

    devtool: '#source-map',
    entry: resolveSrc('./start'),

    output: {
        path: resolveRelease(),
        filename: 'server.js',
        libraryTarget: 'commonjs2'
    },

    // https://webpack.js.org/configuration/externals/#externals
    // https://github.com/liady/webpack-node-externals
    externals: [
        /vue-ssr-server-bundle\.json$/,
        /vue-ssr-client-manifest\.json$/,
        /render\.dev/,
        nodeExternals({
            // do not externalize CSS files in case we need to import it from a dep
            whitelist: /\.css$/
        })
    ],

    plugins: [
        new webpack.DefinePlugin({
            ...GLOBAL_DEFINES,
            'process.env.VUE_ENV': '"server"'
        })
    ]
});
