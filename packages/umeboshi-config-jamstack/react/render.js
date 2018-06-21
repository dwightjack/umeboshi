const { createElement } = require('react'); //eslint-disable-line node/no-missing-require
const { renderToStaticMarkup } = require('react-dom/server'); //eslint-disable-line node/no-missing-require
const render = ({
    meta = true,
    resolve = (page) => require(`@/pages/${page}`)
} = {}) => ({ path }) => {

    let page = '';
    if (path.endsWith('/')) {
        page += `${path}/index.js`;
    } else if (path.endsWith('.html')) {
        page += path.replace(/\.html$/, '.js');
    }

    page = page.replace(/\/+/g, '/').replace(/^\//, '');

    let Component = resolve(page);

    if (Component && Component.default) {
        Component = Component.default;
    }

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
        ].reduce((acc, k) => Object.assign(acc, {
            [k]: helmet[k].toString().replace(/ ?data-react-helmet="true"/g, '')
        }), {});
    }


    return {
        html,
        head,
        template: Component.template
    };
};

module.exports = render;