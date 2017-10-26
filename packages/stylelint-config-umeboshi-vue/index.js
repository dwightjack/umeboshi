module.exports = {
    extends: ['stylelint-config-umeboshi'],

    processors: [
        require.resolve('stylelint-processor-html')
    ],

    rules: {
        'no-empty-source': null
    }
};