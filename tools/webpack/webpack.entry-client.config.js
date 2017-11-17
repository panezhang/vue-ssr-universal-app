/**
 * @author panezhang
 * @date 2017/11/28-上午11:56
 * @file webpack.client.config
 */

import webpack from 'webpack';
import merge from 'webpack-merge';
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin';

import {resolveSrc, resolveRelease} from 'tools/path';
import {DEBUG} from './constant';
import base from './webpack.base.config';

export default merge(base, {
    entry: {
        app: resolveSrc('./entry-client.js')
    },

    output: {
        path: resolveRelease('public'),
        publicPath: '/',
        filename: '[name].[chunkhash].js'
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
            'process.env.VUE_ENV': '"client"'
        }),

        // extract vendor chunks for better caching
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks(module) {
                // a module is extracted into the vendor chunk if...
                return (
                    // it's inside node_modules
                    /node_modules/.test(module.context) &&
                    // and not a CSS file (due to extract-text-webpack-plugin limitation)
                    !/\.css$/.test(module.request)
                );
            }
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),

        new VueSSRClientPlugin()
    ]
});
