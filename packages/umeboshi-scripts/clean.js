const del = require('del');
const { blue } = require('chalk');

const {
    paths
} = require('umeboshi-dev-utils');

del([
    paths.toPath('dist.root/**'),
    `!${paths.toPath('dist.root')}`
]).then((deleted) => {
    console.log(blue('Deleted files and folders:\n'), deleted.join('\n')); //eslint-disable-line no-console
});