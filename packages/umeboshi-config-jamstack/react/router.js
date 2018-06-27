const importPages = (ctx = require.context('@/pages/', true, /\.jsx?$/)) => {

    const MODULE_MATCH_REGEXP = /.jsx?$/;
    return ctx.keys().reduce((routes, key) => {
        const path = key.replace(MODULE_MATCH_REGEXP, '/');
        let Component = ctx(key);

        if (Component && Component.default) {
            Component = Component.default;
        }

        routes[path] = { //eslint-disable-line no-param-reassign
            Component,
            template: Component && Component.template
        };

        return routes;
    }, {});
};

const router = () => {

    const routes = importPages();

    return {
        routes,
        match({ path }) {
            const match = routes[path];
            if (match !== undefined) {
                return Promise.resolve(match);
            }
            return Promise.reject(new Error(`Unable to match path "${path}"`));
        }
    };
};

module.exports = {
    router,
    importPages
};