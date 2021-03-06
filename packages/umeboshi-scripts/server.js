const { green } = require('chalk');
const portfinder = require('portfinder');
const { paths } = require('umeboshi-dev-utils');
const { localhost, address } = require('umeboshi-dev-utils/lib/server');
const {
    loadUmeboshiConfig
} = require('umeboshi-dev-utils');
const { createServer } = require('./lib/server');
const { appMode = 'spa' } = loadUmeboshiConfig();

const { port } = localhost;
const app = createServer({
    appMode,
    contentBase: paths.toAbsPath('dist.root')
});

portfinder.getPortPromise({ port }).then((p) => {
    app.listen(p, () => {
        console.log(green('Static server listening at:\n')); //eslint-disable-line no-console
        console.log(green(`- http://localhost:${p}`)); //eslint-disable-line no-console
        console.log(green(`- http://${address}:${p}`)); //eslint-disable-line no-console
    });
});