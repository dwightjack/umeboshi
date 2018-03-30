const crypto = require('crypto');
const fs = require('fs');
const {
    loadConfig, loadUmeboshiConfig, mergeConfig, paths
} = require('umeboshi-dev-utils');

const umeModernizr = loadUmeboshiConfig('modernizr');

const devConfig = mergeConfig(loadConfig('modernizr.conf.json'), umeModernizr);

const prodConfig = mergeConfig({

    cache: true,

    devFile: false,

    dest: false,

    // Based on default settings on http://modernizr.com/download/
    options: devConfig.options,

    // By default, source is uglified before saving
    uglify: true,

    // Define any tests you want to explicitly include
    tests: [
        'pointerevents',
        'touchevents'
    ],

    // Useful for excluding any tests that this tool will match
    // e.g. you use .notification class for notification elements,
    // but don’t want the test for Notification API
    excludeTests: [],

    // By default, will crawl your project for references to Modernizr tests
    // Set to false to disable
    crawl: true,

    // Set to true to pass in buffers via the 'files" parameter below
    useBuffers: false,

    // By default, this task will crawl all *.js, *.css, *.scss files.
    files: {
        src: [
            paths.toPath('src.assets/js') + '/**/*.{js,scss,css}',
            '!' + paths.toPath('src.assets/js') + '/**/*.{spec,conf,test}.js',
            paths.toPath('src.assets/styles') + '/**/*.{scss,css}'
        ]
    },

    // Have custom Modernizr tests? Add them here.
    customTests: []
}, umeModernizr);

const filePath = paths.toPath('dist.assets/vendors/modernizr');

require('mkdirp').sync(filePath);

const checksum = (str) => crypto.createHash('md5').update(str, 'utf8').digest('hex').slice(0, 10);

if (process.env.NODE_ENV === 'production') {

    require('customizr')(prodConfig, (obj) => { //eslint-disable-line global-require
        const hash = checksum(obj.result);
        const destPath = filePath + '/modernizr.' + hash + '.js';
        fs.writeFile(destPath, obj.result, () => {
            console.log('File ' + destPath + ' created'); //eslint-disable-line no-console
            process.exit(0);
        });
    });
} else {
    //full build
    const modernizr = require('modernizr'); //eslint-disable-line global-require

    modernizr.build(devConfig, (result) => {
        const destPath = filePath + '/modernizr.js';
        fs.writeFile(destPath, result, () => {
            console.log('File ' + destPath + ' created'); //eslint-disable-line no-console
            process.exit(0);
        });
    });
}