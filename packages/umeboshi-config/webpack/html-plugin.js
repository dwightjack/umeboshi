const uniq = (arr) => {
    return arr.reduce((acc, v) => {
        if (!acc.includes(v)) {
            acc.push(v);
        }
        return acc;
    }, []);
};
/**
 * Tweaked from original by Mike Engel
 * https://github.com/jantimon/html-webpack-plugin/issues/782#issuecomment-331229728
 *
 * Use this with multiple Webpack configurations that generate different builds
 * for modern and legacy browsers. But use the same instance of the plugin in both configurations.
 *
 * It keeps track of assets seen in each build configuration, and appends script tags for
 * all the assets to subsequent builds - using type=module or nomodule to cause the appropriate
 * version of each one to be loaded.
 *
 * The HTML file will be written for each configuration, but only the last-emitted one (which will
 * overwrite any previous ones) will have all the asset tags.
 *
 * Many browsers (IE10, IE11, Firefox 57 at least) will download (but not run) both versions of
 * every asset - see https://github.com/philipwalton/webpack-esnext-boilerplate/issues/1
 */
class HtmlModuleScriptWebpackPlugin {
    constructor(options) {
        this.options = { name: 'default', apply: 'pre', ...options };
    }

    sharedAssets(value) {
        const { store } = HtmlModuleScriptWebpackPlugin;
        if (value !== undefined) {
            store.set(this.options.name, value);
            return value;
        }
        return store.get(this.options.name) || { js: [], chunks: [] };
    }

    apply(compiler) {
        compiler.hooks.compilation.tap(
            'HtmlModuleScriptWebpackPlugin',
            (compilation) => {
                if (this.options.apply === 'pre') {
                    compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
                        'HtmlModuleScriptWebpackPlugin',
                        this.beforeHtmlProcessing.bind(this)
                    );
                }
                if (this.options.apply === 'post') {
                    compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(
                        'HtmlModuleScriptWebpackPlugin',
                        this.alterAssetTags.bind(this)
                    );
                }
            }
        );
    }

    beforeHtmlProcessing(htmlPluginData) {
        // Avoid chunk name collisions, since they can be named the same between builds
        // { 'main': {} } to { 'main_modern': {} } if the filename matches
        const { chunks } = htmlPluginData.assets;
        const { matchModule } = this.options;
        const renamedChunks = Object.keys(chunks).reduce((acc, name) => {
            const chunk = chunks[name];
            const key =
                matchModule && matchModule.test(chunk.entry)
                    ? `${name}_module`
                    : name;
            acc[key] = chunk;
            return acc;
        }, {});

        const assets = this.sharedAssets();

        assets.js = uniq([...assets.js, ...htmlPluginData.assets.js]);
        assets.chunks = Object.assign(assets.chunks, renamedChunks);

        this.sharedAssets(assets);
        Object.assign(htmlPluginData.assets, assets);
        return htmlPluginData;
    }

    alterAssetTags(htmlPluginData) {
        const { matchModule } = this.options;
        if (!matchModule) {
            return htmlPluginData;
        }
        const modules = [];
        htmlPluginData.body.forEach((assetTag) => {
            const isModern = matchModule.test(assetTag.attributes.src);
            if (isModern) {
                modules.push(assetTag.attributes.src);
                // eslint-disable-next-line no-param-reassign
                assetTag.attributes.type = 'module';
            } else {
                // add an attribute value to prevent
                // template compilation from breaking the HTML
                // eslint-disable-next-line no-param-reassign
                assetTag.attributes.nomodule = 'nomodule';
            }
            return assetTag;
        });

        htmlPluginData.head.forEach((tag) => {
            const { attributes } = tag;
            if (
                attributes.href &&
                modules.includes(attributes.href) &&
                attributes.rel === 'preload' &&
                attributes.as === 'script'
            ) {
                attributes.rel = 'modulepreload';
                attributes.crossorigin = 'use-credentials';
            }
        });

        return htmlPluginData;
    }
}

HtmlModuleScriptWebpackPlugin.store = new Map();

module.exports = HtmlModuleScriptWebpackPlugin;
