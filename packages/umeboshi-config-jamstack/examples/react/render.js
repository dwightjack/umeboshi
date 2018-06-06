import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Helmet } from 'react-helmet';

//eslint-disable-next-line import/prefer-default-export
const render = ({ path }) => {

    let page = '';
    if (path.endsWith('/')) {
        page += `${path}/index.js`;
    } else if (path.endsWith('.html')) {
        page += path.replace(/\.html$/, '.js');
    }

    page = page.replace(/\/+/g, '/').replace(/^\//, '');

    let Component = require(`@/pages/${page}`).default; //eslint-disable-line global-require, import/no-dynamic-require

    if (Component && Component.default) {
        Component = Component.default;
    }

    const html = renderToStaticMarkup(createElement(Component));
    const helmet = Helmet.renderStatic();
    const head = [
        'bodyAttributes',
        'htmlAttributes',
        'meta',
        'title'
    ].reduce((acc, k) => ({
        ...acc,
        [k]: helmet[k].toString().replace(/ ?data-react-helmet="true"/g, '')
    }), {});

    return {
        html,
        head,
        template: Component.template
    };
};

export {
    render
};