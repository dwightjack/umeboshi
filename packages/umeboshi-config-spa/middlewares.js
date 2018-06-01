const convert = require('koa-connect');
const history = require('connect-history-api-fallback');
const serveStatic = require('@shellscape/koa-static/legacy');

const staticMiddleware = (contentBase) => serveStatic(contentBase);

const historyMiddleware = (conf) => convert(history(conf));

const spaRenderMiddleware = ({ compiler, templatePath }) => {

    const testRegexp = /(\.html|\/)$/;


    return (ctx, next) => {
        if (ctx.method === 'GET' && testRegexp.test(ctx.path)) {
            return new Promise((resolve) => {
                compiler.outputFileSystem.readFile(templatePath, (err, file) => {
                    if (err) {
                        ctx.throw(404, err.toString());
                        resolve(err);
                    } else {
                        ctx.body = file.toString();
                        resolve(file);
                    }
                });
            });
        }
        return next();
    };
};

module.exports = {
    historyMiddleware,
    spaRenderMiddleware,
    staticMiddleware
};