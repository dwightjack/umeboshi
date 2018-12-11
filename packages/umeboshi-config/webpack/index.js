module.exports = (api, env) => {
    const { production, analyze } = env;
    const branch = analyze || production ? 'prod' : 'dev';
    return require(`./webpack.${branch}`)(api, env);
};
