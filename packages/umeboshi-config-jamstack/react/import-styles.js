const importStyles = (ctx = require.context('@/pages/', true, /\.s?css$/)) => {
    const pages = {};
    ctx.keys().forEach((key) => { pages[key] = ctx(key); });
};

module.exports = importStyles;