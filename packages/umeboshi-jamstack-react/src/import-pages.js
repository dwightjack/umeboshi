// require.context('@/pages/', true, /\.jsx?$/)
export default (importFn) => (pages) => {
    const MODULE_MATCH_REGEXP = /^\.(.*?)(\/index|)\.jsx?$/;
    return pages.map((page) => {
        const path = page.replace(MODULE_MATCH_REGEXP, '$1/');
        let component = importFn(page);

        if (component && component.default) {
            component = component.default;
        }

        return {
            path,
            component,
            template: component && component.template
        };
    });
};
