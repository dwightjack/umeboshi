const path = require('path');
const express = require('express');
const history = require('connect-history-api-fallback');
const address = require('ip').address();
const { loadScript, loadConfig, APP_PATH } = require('');

const middlewares = loadScript('middlewares');
const localhost = loadConfig('hosts.js').local;

const app = express();

app.use(history());
app.use(express.static(path.join(APP_PATH, 'public')));

if (middlewares.length > 0) {
    middlewares.forEach((middleware) => app.use(middleware));
}

app.listen(localhost.port, () => {
    console.log(`Listening on http://${address}:${localhost.port}`); //eslint-disable-line no-console
});