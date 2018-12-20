const uniq = (arr) => {
    return arr.reduce((acc, v) => {
        if (!acc.includes(v)) {
            acc.push(v);
        }
        return acc;
    }, []);
};

class HtmlModuleScriptWebpackPlugin {
    constructor(options) {
        this.options = { name: 'default', apply: 'pre', ...options };
    }

    sharedAssets(key, arr) {
        const { store } = HtmlModuleScriptWebpackPlugin;
        const name = `${this.options.name}@${key}`;

        if (arr === undefined) {
            return store.get(name) || [];
        }

        if (!store.has(name)) {
            store.set(name, []);
        }
        const frag = store.get(name);
        store.set(name, uniq([...frag, ...arr]));
        return store.get(name);
    }

    apply(compiler) {
        compiler.hooks.compilation.tap(
            'HtmlModuleScriptWebpackPlugin',
            (compilation) => {
                compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(
                    'HtmlModuleScriptWebpackPlugin',
                    this.alterAssetTags.bind(this)
                );
            }
        );
    }

    alterAssetTags(htmlPluginData) {
        const { filename = '' } = htmlPluginData.plugin.options;
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

        const head = htmlPluginData.head.reduce((acc, tag) => {
            const { attributes } = tag;
            if (
                attributes.href &&
                modules.includes(attributes.href) &&
                attributes.rel === 'preload' &&
                attributes.as === 'script'
            ) {
                attributes.rel = 'modulepreload';
                attributes.crossorigin = 'use-credentials';
                acc.push(tag);
            }
            return acc;
        }, []);

        this.sharedAssets(`${filename}body`, htmlPluginData.body);
        this.sharedAssets(`${filename}head`, head);

        return {
            ...htmlPluginData,
            body: this.sharedAssets(`${filename}body`),
            head: this.sharedAssets(`${filename}head`)
        };
    }
}

HtmlModuleScriptWebpackPlugin.store = new Map();

module.exports = HtmlModuleScriptWebpackPlugin;
