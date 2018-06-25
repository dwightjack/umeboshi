const execa = require('execa');
const logger = require('umeboshi-dev-utils/lib/logger');
/* eslint-disable class-methods-use-this */
class WebpackRenderPlugin {

    apply(compiler) {

        compiler.hooks.afterEmit.tap('renderBundle', ({ assets }) => {
            const bundle = Object.keys(assets).filter((k) => !!assets[k].emitted).find((k) => k.endsWith('.js'));
            if (!bundle) {
                logger.warning(`Unable to find ssr bundle. Emitted assets: ${Object.keys(assets).join(', ')} `);
                return;
            }
            execa('ume-jam-render', {
                env: {
                    SSR: assets[bundle].existsAt,
                    TARGET_ENV: 'node'
                },
                cwd: process.cwd(),
                stdio: ['inherit', 'inherit', 'inherit']
            });
        });
    }
}
/* eslint-enable class-methods-use-this */

module.exports = WebpackRenderPlugin;