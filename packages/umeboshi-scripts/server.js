const express = require('express');
const history = require('connect-history-api-fallback');
const { paths, loadConfig, loadUmeboshiConfig, mergeConfig } = require('umeboshi-dev-utils');
const { middlewares, localhost, address } = require('umeboshi-dev-utils/lib/server');

const app = express();

app.use(history());
app.use(express.static(paths.toAbsPath('dist.root')));

if (middlewares.length > 0) {
    middlewares.forEach((middleware) => app.use(middleware));
}

app.listen(localhost.port, () => {
    console.log(`Listening on http://${address}:${localhost.port}`); //eslint-disable-line no-console
});