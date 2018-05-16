describe('eslint-config-umeboshi-vue', () => {

    const config = require('../index');
    const {
        parserOptions
    } = config;

    describe('Configs', () => {

        let configs;

        beforeEach(() => {
            configs = config.extends;
        });

        test('first extends `eslint-config-umeboshi`', () => {
            const idx = configs.indexOf(require.resolve('eslint-config-umeboshi'));
            expect(idx).toBe(0);
        });


        test('extends strongly recommended vue rules', () => {
            const index = configs.indexOf('plugin:vue/strongly-recommended');
            const expected = configs.length - 1;
            expect(index).toBe(expected);

        });

    });

    describe('Parser', () => {

        test('enforces `babel-eslint` for advanced es syntax', () => {
            expect(parserOptions.parser).toBe('babel-eslint');
        });

        test('should not allow jsx', () => {
            expect(parserOptions.ecmaFeatures.jsx).toBe(false);
        });

    });

    test('should expose shared rules', () => {
        const rules = require('../rules');
        expect(config.rules).toBe(rules);
    });

});