const del = require('del');
const { blue } = require('chalk');
const {
    resolveConfig
} = require('umeboshi-dev-utils');
const createConfig = require('umeboshi-dev-utils/lib/config');

const { api } = resolveConfig(createConfig(), {}).evaluate({});

del([
    api.paths.toPath('dist.root/**'),
    api.paths.toPath('tmp'),
    `!${api.paths.toPath('dist.root')}`
]).then((deleted) => {
    if (deleted.length > 0) {
        console.log(blue('Deleted files and folders:\n'), deleted.join('\n')); //eslint-disable-line no-console
    }
});

