const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static');

const staticMiddleware = (contentBase) => serveStatic(contentBase);

const historyMiddleware = (conf) => history(conf);

const spaRenderMiddleware = ({ compiler, templatePath }) => {
    const testRegexp = /(\.html|\/)$/;

    return ({ method, path }, res, next) => {
        if (method === 'GET' && testRegexp.test(path)) {
            compiler.outputFileSystem.readFile(templatePath, (err, file) => {
                if (err) {
                    next(err);
                    return;
                }
                res.send(file.toString());
            });
            return;
        }
        next();
    };
};

module.exports = {
    historyMiddleware,
    spaRenderMiddleware,
    staticMiddleware
};
