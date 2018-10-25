export default (routes) => {
    return {
        routes,
        match({ path }) {
            const match = routes.find((r) => r.path === path);
            if (match !== undefined) {
                return Promise.resolve(match);
            }
            return Promise.reject(new Error(`Unable to match path "${path}"`));
        }
    };
};
