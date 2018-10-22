const glob = require('globby');
const fs = require('fs');
const Vinyl = require('vinyl');
const { parse } = require('@vue/component-compiler-utils');
const { paths } = require('umeboshi-dev-utils');

const toFile = (path, data) =>
    new Vinyl({ path, contents: Buffer.from(data, 'utf8') });

const commons = glob
    .sync([
        paths.toPath('src.assets/js') + '/**/*.{js,scss,css}',
        '!' + paths.toPath('src.assets/js') + '/**/*.{spec,conf,test}.js',
        paths.toPath('src.assets/styles') + '/**/*.{scss,css}'
    ])
    .map((file) => toFile(file, fs.readFileSync(file, { encoding: 'utf8' })));

//test vue files...
const vue = glob
    .sync([paths.toPath('src.assets/js') + '/**/*.vue'])
    .reduce((acc, file) => {
        const source = fs.readFileSync(file, { encoding: 'utf8' });
        const { styles = [], script } = parse({ source, needMap: false });
        if (script) {
            const { content, lang = 'js' } = script;
            const filename = file.replace(/\.vue$/, `~vue.${lang}`);
            acc.push(toFile(filename, content));
        }
        styles.forEach(({ content, lang = 'css' }, i) => {
            if (content) {
                const filename = file.replace(/\.vue$/, `~vue.${i}.${lang}`);
                acc.push(toFile(filename, content));
            }
        });
        return acc;
    }, []);

module.exports = (config) =>
    Object.assign(config, {
        useBuffers: true,
        files: {
            src: [...commons, ...vue]
        }
    });
