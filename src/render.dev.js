/**
 * @author panezhang
 * @date 2017/12/8-下午7:32
 * @file render.dev
 */

import fs from 'fs';
import path from 'path';

import {createBundleRenderer} from 'vue-server-renderer';
import chokidar from 'chokidar';
import MFS from 'memory-fs';
import webpack from 'webpack';
import createDevMiddleware from 'webpack-dev-middleware';
import createHotMiddleware from 'webpack-hot-middleware';

import entryClientConfig from 'tools/webpack/webpack.entry-client.config';
import entryServerConfig from 'tools/webpack/webpack.entry-server.config';

function readJsonAndParse(fileSystem, filePath) {
    try {
        const content = fileSystem.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        console.log('read file failed', filePath);
        return null;
    }
}

const templatePath = path.resolve(__dirname, './index.html');

class RenderDev {

    app = null; // express app current running

    template = null; // index.html
    clientManifest = null; // clientManifest.json
    bundle = null; // server bundle
    renderer = null; // created using three above

    initPromise = null; // 等待初始化完成的 promise
    resolve = null; // resolve for initPromise

    constructor(app) {
        this.app = app;
        this.initPromise = new Promise(resolve => (this.resolve = resolve));
        this.watchIndexHtml();
        this.initClientCompiler();
        this.initServerCompiler();
    }

    async get() {
        const {renderer, initPromise} = this;
        await initPromise;
        return renderer;
    }

    watchIndexHtml() { // read template from disk and watch
        const self = this;
        self.template = fs.readFileSync(templatePath, 'utf-8');
        chokidar.watch(templatePath).on('change', () => {
            self.template = fs.readFileSync(templatePath, 'utf-8');
            console.log('index.html template updated.');
            self.updateRenderer();
        });
    }

    initClientCompiler() {
        const self = this;
        const {app} = self;

        // modify client config to work with hot middleware
        entryClientConfig.entry.app = ['webpack-hot-middleware/client', entryClientConfig.entry.app];
        entryClientConfig.output.filename = '[name].js';
        entryClientConfig.plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        );

        // dev middleware
        const clientCompiler = webpack(entryClientConfig);
        const devMiddleware = createDevMiddleware(clientCompiler, {publicPath: entryClientConfig.output.publicPath});
        const hotMiddleware = createHotMiddleware(clientCompiler, {heartbeat: 5000});
        app.use(devMiddleware);
        app.use(hotMiddleware);

        clientCompiler.plugin('done', (stats) => {
            stats = stats.toJson();
            stats.errors.forEach(err => console.error(err));
            stats.warnings.forEach(err => console.warn(err));
            if (stats.errors.length) return;

            self.clientManifest = readJsonAndParse(
                devMiddleware.fileSystem,
                path.resolve(entryClientConfig.output.path, 'vue-ssr-client-manifest.json')
            );

            self.updateRenderer();
        });
    }

    initServerCompiler() { // watch and update server renderer
        const self = this;
        const serverCompiler = webpack(entryServerConfig);
        const mfs = new MFS();
        serverCompiler.outputFileSystem = mfs;
        serverCompiler.watch({}, (err, stats) => {
            if (err) throw err;

            stats = stats.toJson();
            if (stats.errors.length) return;

            // read bundle generated by vue-ssr-webpack-plugin
            self.bundle = readJsonAndParse(
                mfs,
                path.resolve(entryServerConfig.output.path, 'vue-ssr-server-bundle.json')
            );

            self.updateRenderer();
        });

    }

    updateRenderer() {
        const {template, bundle, clientManifest} = this;
        if (bundle && clientManifest) {
            this.renderer = createBundleRenderer(bundle, {
                template,
                clientManifest
            });

            this.resolve();
        }
    }

}

export default RenderDev;