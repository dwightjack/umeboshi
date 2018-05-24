module.exports = (config) => {
    config.resolve.extensions
        .merge(['.js', '.jsx', '.json']);

    config.module
        .rule('js')
        .test(/\.jsx?$/);

    return config;
};