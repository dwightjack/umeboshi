const crypto = require('crypto');
const fs = require('fs');

const {
    loadUmeboshiConfig, mergeConfig, resolveConfig
} = require('umeboshi-dev-utils');
const createConfig = require('umeboshi-dev-utils/lib/config');


const { config, api } = resolveConfig(createConfig()).evaluate();
const umeModernizr = loadUmeboshiConfig('modernizr');
const umeCustomizr = loadUmeboshiConfig('customizr');


const devConfig = mergeConfig(config.modernizr, umeModernizr);
const prodConfig = mergeConfig(config.customizr, umeCustomizr);

const filePath = api.paths.toPath('dist.assets/vendors/modernizr');

require('mkdirp').sync(filePath);

const checksum = (str) => crypto.createHash('md5').update(str, 'utf8').digest('hex').slice(0, 10);

if (process.env.NODE_ENV === 'production') {

    require('customizr')(prodConfig, (obj) => { //eslint-disable-line global-require
        const hash = checksum(obj.result);
        const destPath = filePath + '/modernizr.' + hash + '.js';
        fs.writeFile(destPath, obj.result, () => {
            console.log('File ' + destPath + ' created'); //eslint-disable-line no-console
            process.exit(0);
        });
    });
} else {
    //full build
    const modernizr = require('modernizr'); //eslint-disable-line global-require

    modernizr.build(devConfig, (result) => {
        const destPath = filePath + '/modernizr.js';
        fs.writeFile(destPath, result, () => {
            console.log('File ' + destPath + ' created'); //eslint-disable-line no-console
            process.exit(0);
        });
    });
}