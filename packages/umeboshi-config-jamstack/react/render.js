const { createElement } = require('react'); //eslint-disable-line node/no-missing-require
const { renderToStaticMarkup } = require('react-dom/server'); //eslint-disable-line node/no-missing-require
const render = ({ meta = true, router, defaultTemplate = 'default' } = {}) => (
    ctx
) => {
    return router
        .match(ctx)
        .then(({ Component, template = defaultTemplate } = {}) => {
            const html = renderToStaticMarkup(createElement(Component));
            let head = {};

            if (meta) {
                const { Helmet } = require('react-helmet'); //eslint-disable-line node/no-missing-require
                const helmet = Helmet.renderStatic();
                head = [
                    'bodyAttributes',
                    'htmlAttributes',
                    'meta',
                    'title'
                ].reduce(
                    (acc, k) =>
                        Object.assign(acc, {
                            [k]: helmet[k]
                                .toString()
                                .replace(/ ?data-react-helmet="true"/g, '')
                        }),
                    {}
                );
            }

            return {
                html,
                head,
                template
            };
        });
};

module.exports = render;
