/**
 * @author panezhang
 * @date 19/10/2017-12:44 AM
 * @file bundle
 */

// node modules
import webpack from 'webpack';

// our modules
import webpackConfig from './webpack/webpack.config';

/**
 * Creates application bundles from the source files.
 */

function bundle() {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig).run((err, stats) => {
            if (err) {
                return reject(err);
            }

            console.log(stats.toString({
                colors: true,
                reasons: true,
                hash: false,
                version: false,
                timings: true,
                chunks: false,
                chunkModules: false,
                cached: false,
                cachedAssets: false
            }));

            return resolve();
        });
    });
}

export default bundle;
