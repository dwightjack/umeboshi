module.exports = {
    extends: ['stylelint-config-umeboshi'],

    processors: [
        require.resolve('@mapbox/stylelint-processor-arbitrary-tags')
    ],

    rules: {
        'no-empty-source': null
    }
};