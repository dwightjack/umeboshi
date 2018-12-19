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
        this.options = options;
        this.sharedAssets = { js: [], chunks: [] };
    }

    apply(compiler) {
        compiler.hooks.compilation.tap(
            'HtmlModuleScriptWebpackPlugin',
            (compilation) => {
                compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
                    'HtmlModuleScriptWebpackPlugin',
                    this.beforeHtmlProcessing.bind(this)
                );
                compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
                    'HtmlModuleScriptWebpackPlugin',
                    this.alterAssetTags.bind(this)
                );
            }
        );
    }

    beforeHtmlProcessing(htmlPluginData, callback) {
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

        this.sharedAssets = {
            js: uniq([].concat(this.sharedAssets.js, htmlPluginData.assets.js)),
            chunks: Object.assign(this.sharedAssets.chunks, renamedChunks)
        };
        Object.assign(htmlPluginData.assets, this.sharedAssets);

        callback(null, htmlPluginData);
    }

    alterAssetTags(htmlPluginData, callback) {
        const { matchModule } = this.options;
        if (!matchModule) {
            callback(null, htmlPluginData);
            return;
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

        callback(null, htmlPluginData);
    }
}

module.exports = HtmlModuleScriptWebpackPlugin;
