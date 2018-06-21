const fs = require('fs');
const tmpl = require('lodash/template');

const toTemplatePath = (template, tmplPath) => `${tmplPath}/${template}.ejs`;

const getTemplate = (template, tmplPath, def = 'default') => {
    let t = toTemplatePath(template, tmplPath);
    if (fs.existsSync(t) === false) {
        t = toTemplatePath(def, tmplPath);
    }
    return tmpl(fs.readFileSync(t, { encoding: 'utf8' }).replace(/\\%/g, '%'));
};

module.exports = {
    getTemplate,
    toTemplatePath
};