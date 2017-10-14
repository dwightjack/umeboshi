const path = require('path');

const { APP_PATH } = require('umeboshi-scripts/lib/utils');

module.exports = {
    verbose: true,
    bail: true,
    globals: {
        __PRODUCTION__: false
    },
    rootDir: path.resolve(APP_PATH, 'app/assets/js'),
    collectCoverageFrom: [
        'components/**/*.{js,jsx}',
        'objects/**/*.{js,jsx}',
        'containers/**/*.{js,jsx}'
    ],
    collectCoverage: false,
    moduleDirectories: [
        'node_modules',
        'app/assets/vendors',
        'app/assets/styles'
    ],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/file-mock.js',
        '\\.(css|scss)$': 'identity-obj-proxy'
    }
};