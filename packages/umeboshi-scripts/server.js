const express = require('express');
const { green } = require('chalk');
const history = require('connect-history-api-fallback');
const portfinder = require('portfinder');
const { paths } = require('umeboshi-dev-utils');
const { middlewares, localhost, address } = require('umeboshi-dev-utils/lib/server');
const { port } = localhost;
const app = express();

app.use(history());
app.use(express.static(paths.toAbsPath('dist.root')));

if (middlewares.length > 0) {
    middlewares.forEach((middleware) => app.use(middleware));
}

portfinder.getPortPromise({ port }).then((p) => {
    app.listen(p, () => {
        console.log(green(`Listening on http://${address}:${p}`)); //eslint-disable-line no-console
    });
});