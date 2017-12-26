describe('eslint-config-umeboshi-vue/beta', () => {

    const config = require('../beta');
    const {
        parser,
        parserOptions,
        plugins,
        rules
    } = config;

    it('extends `eslint-config-umeboshi`', () => {
        const expected = require.resolve('eslint-config-umeboshi');
        expect(config.extends).toEqual([expected]);
    });


    describe('Parser', () => {

        it('uses `vue-eslint-parser` for .vue files', () => {
            const expected = require.resolve('vue-eslint-parser');
            expect(parser).toBe(expected);
        });

        it('enforces `babel-eslint` for advanced es syntax', () => {
            const expected = require.resolve('babel-eslint');
            expect(parserOptions.parser).toBe(expected);
        });

        it('should not allow jsx', () => {
            expect(parserOptions.ecmaFeatures.jsx).toBe(false);
        });

    });

    it('uses the `vue` plugin', () => {
        expect(plugins).toEqual(['vue']);
    });

    it('mixes custom vue rules with recommended from `eslint-plugin-vue`', () => {
        const customRules = require('../rules');
        const vueRules = require('eslint-plugin-vue/lib/recommended-rules');
        const expected = Object.assign({}, customRules, vueRules);

        expect(rules).toEqual(expected);
    });
});