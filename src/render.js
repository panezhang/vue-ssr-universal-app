/**
 * @author panezhang
 * @date 2017/12/8-下午7:32
 * @file render
 */

import {createBundleRenderer} from 'vue-server-renderer';
import template from 'raw-loader!./index.html'; // eslint-disable-line

class Render {

    constructor() {
        const bundle = require('./vue-ssr-server-bundle.json'); // eslint-disable-line
        const clientManifest = require('./public/static/vue-ssr-client-manifest.json'); // eslint-disable-line
        this.renderer = createBundleRenderer(bundle, {
            runInNewContext: false,
            template,
            clientManifest
        });
    }

    get() {
        return this.renderer;
    }

}

export default Render;
