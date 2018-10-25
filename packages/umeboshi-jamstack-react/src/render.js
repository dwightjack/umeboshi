import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export default ({
    meta = true,
    hydrate = false,
    router,
    defaultTemplate = 'default'
} = {}) => (ctx) => {
    return router
        .match(ctx)
        .then(({ component, template = defaultTemplate } = {}) => {
            const html = renderToStaticMarkup(createElement(component));
            let head = {};

            if (meta) {
                const { Helmet } = require('react-helmet'); //eslint-disable-line no-require
                const helmet = Helmet.renderStatic();
                head = [
                    'bodyAttributes',
                    'htmlAttributes',
                    'meta',
                    'title'
                ].reduce((acc, k) => {
                    let value = helmet[k].toString();
                    if (!hydrate) {
                        value = value.replace(
                            / ?data-react-helmet="true"/g,
                            ''
                        );
                    }
                    return Object.assign(acc, { [k]: value });
                }, {});
            }

            return {
                html,
                head,
                template
            };
        });
};
