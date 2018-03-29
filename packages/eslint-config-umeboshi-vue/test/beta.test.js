describe('eslint-config-umeboshi-vue/beta', () => {

    const config = require('../beta');
    const {
        parser,
        parserOptions,
        plugins,
        rules
    } = config;

    test('extends `eslint-config-umeboshi`', () => {
        const expected = require.resolve('eslint-config-umeboshi');
        expect(config.extends).toEqual([expected]);
    });


    describe('Parser', () => {

        test('uses `vue-eslint-parser` for .vue files', () => {
            const expected = require.resolve('vue-eslint-parser');
            expect(parser).toBe(expected);
        });

        test('enforces `babel-eslint` for advanced es syntax', () => {
            const expected = require.resolve('babel-eslint');
            expect(parserOptions.parser).toBe(expected);
        });

        test('should not allow jsx', () => {
            expect(parserOptions.ecmaFeatures.jsx).toBe(false);
        });

    });

    test('uses the `vue` plugin', () => {
        expect(plugins).toEqual(['vue']);
    });

    test('mixes custom vue rules with recommended from `eslint-plugin-vue`', () => {
        const customRules = require('../rules');
        const vueRules = require('eslint-plugin-vue/lib/recommended-rules');
        const expected = Object.assign({}, customRules, vueRules);

        expect(rules).toEqual(expected);
    });
});