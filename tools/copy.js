/**
 * @author panezhang
 * @date 19/10/2017-12:44 AM
 * @file copy
 */

import fs from 'fs-extra';

async function copy() {
    try {
        await Promise.all([
            fs.copy('config', 'build/config'),
            fs.copy('src/public', 'build/public'),
            fs.copy('package.json', 'build/package.json')
        ]);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export default copy;
