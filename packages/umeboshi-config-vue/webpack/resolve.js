module.exports = (config) => Object.assign({}, config, {

    resolve: Object.assign({
        extensions: ['.js', '.vue', '.json']
    }, config.resolve)

});