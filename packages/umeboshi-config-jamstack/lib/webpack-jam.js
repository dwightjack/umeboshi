const WebpackAssetsManifest = require('webpack-assets-manifest');

class ClientPlugin {
    attach(resolve) {
        this.resolve = resolve;
    }
    apply(compiler) {
        compiler.hooks.done.tap('jamServerStart', ({ compilation }) => {
            const manifestPlugin = compilation.options.plugins.find((p) => p instanceof WebpackAssetsManifest);
            this.resolve(manifestPlugin);
        });
    }
}

class ServerPlugin {
    attach(resolve) {
        this.resolve = resolve;
    }
    apply(compiler) {
        compiler.hooks.afterEmit.tap('renderBundle', ({ assets }) => {
            const bundle = Object.keys(assets).filter((k) => !!assets[k].emitted).find((k) => k.endsWith('.js'));
            if (!bundle) {
                console.warn(`Unable to find ssr bundle. Emitted assets: ${Object.keys(assets).join(', ')} `);
                return;
            }
            this.resolve(assets[bundle].existsAt);
        });
    }
}

class WebpackRenderPlugin {

    static listen(instance) {
        return new Promise((resolve) => {
            instance.attach(resolve);
        });
    }

    constructor() {
        this.client = new ClientPlugin();
        this.server = new ServerPlugin();
        this.clientPromise = WebpackRenderPlugin.listen(this.client);
        this.serverPromise = WebpackRenderPlugin.listen(this.server);
    }

    onComplete(callback) {
        Promise.all([
            this.clientPromise,
            this.serverPromise
        ]).then(callback);
    }
}

module.exports = WebpackRenderPlugin;