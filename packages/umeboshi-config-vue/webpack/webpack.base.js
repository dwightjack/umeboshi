const config = require('umeboshi-config/webpack/webpack.base');

module.exports = Object.assign({}, config, {

    resolve: Object.assign({
        extensions: ['.js', '.vue', '.json']
    }, config.resolve)

});