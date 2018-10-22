const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static');

const staticMiddleware = (contentBase) => serveStatic(contentBase);

const historyMiddleware = (conf) => history(conf);

const spaRenderMiddleware = ({ templatePath }) => {
    const testRegexp = /(\.html|\/)$/;

    return ({ method, path, app }, res, next) => {
        if (method === 'GET' && testRegexp.test(path)) {
            app.compiler.outputFileSystem.readFile(
                templatePath,
                (err, file) => {
                    if (err) {
                        next(err);
                        return;
                    }
                    res.send(file.toString());
                }
            );
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
