/**
 * @author panezhang
 * @date 2017/11/28-上午11:56
 * @file webpack.base.config
 */

import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

import {DEBUG} from './constant';
import vueConfig from './vue-loader.config';

export default {
    devtool: DEBUG && '#cheap-module-source-map',

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            {
                test: /\.css$/,
                use: DEBUG
                    ? ['vue-style-loader', 'css-loader']
                    : ExtractTextPlugin.extract({
                        use: 'css-loader?minimize',
                        fallback: 'vue-style-loader'
                    })
            }
        ]
    },

    performance: {
        maxEntrypointSize: 300000,
        hints: !DEBUG && 'warning'
    },

    plugins: DEBUG
        ? [
            new FriendlyErrorsPlugin()
        ]
        : [
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {warnings: false}
            }),

            new ExtractTextPlugin({
                filename: 'common.[chunkhash].css'
            })
        ]
};
