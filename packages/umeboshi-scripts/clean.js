const del = require('del');
const { resolveConfig } = require('umeboshi-dev-utils');
const logger = require('umeboshi-dev-utils/lib/logger');
const createConfig = require('umeboshi-dev-utils/lib/config');

const { api } = resolveConfig(createConfig(), {}).evaluate({});

logger.log('Cleaning previous build files...');

del([
    api.paths.toPath('dist.root/**'),
    api.paths.toPath('tmp'),
    `!${api.paths.toPath('dist.root')}`
]).then((deleted) => {
    if (deleted.length > 0) {
        logger.message('Cleaning completed.');
        logger.verbose(`Delete files and folders: ${deleted.join('\n')}`);
    }
});
