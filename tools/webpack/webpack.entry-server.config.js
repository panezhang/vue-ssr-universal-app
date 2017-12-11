/**
 * @author panezhang
 * @date 2017/11/28-上午11:56
 * @file webpack.client.config
 */

import webpack from 'webpack';
import merge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import VueSSRServerPlugin from 'vue-server-renderer/server-plugin';

import {resolveSrc, resolveRelease} from 'tools/path';
import {GLOBAL_DEFINES} from './constant';
import base from './webpack.base.config';

export default merge(base, {
    target: 'node',
    devtool: '#source-map',
    entry: resolveSrc('./entry-server.js'),

    output: {
        path: resolveRelease(),
        filename: 'entry-server.js',
        libraryTarget: 'commonjs2'
    },

    // https://webpack.js.org/configuration/externals/#externals
    // https://github.com/liady/webpack-node-externals
    externals: nodeExternals({
        // do not externalize CSS files in case we need to import it from a dep
        whitelist: /\.css$/
    }),

    plugins: [
        new webpack.DefinePlugin({
            ...GLOBAL_DEFINES,
            'process.env.VUE_ENV': '"server"'
        }),

        new VueSSRServerPlugin()
    ]
});
