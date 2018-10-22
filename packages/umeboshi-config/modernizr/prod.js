const { options } = require('./dev');

module.exports = ({ paths }) => ({
    cache: true,

    devFile: false,

    dest: false,

    // Based on default settings on http://modernizr.com/download/
    options,

    // By default, source is uglified before saving
    uglify: true,

    // Define any tests you want to explicitly include
    tests: ['pointerevents', 'touchevents'],

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
});
