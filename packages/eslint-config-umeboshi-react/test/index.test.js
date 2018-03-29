// const { CLIEngine } = require('eslint');

// const cli = new CLIEngine({
//     useEslintrc: false,
//     baseConfig: require('../index'),

//     rules: {
//         // It is okay to import devDependencies in tests.
//         'import/no-extraneous-dependencies': [2, { devDependencies: true }],
//     }
// });

// const lint = (text) => cli.executeOnText(text).results[0];


describe('eslint-config-umeboshi', () => {

    let config;
    let baseConfig;

    beforeEach(() => {
        config = require('../index');
        baseConfig = require('eslint-config-umeboshi');
    });

    describe('Features', () => {

        test('shares env with `eslint-config-umeboshi`', () => {
            expect(config.env).toBe(baseConfig.env);
        });

        test('shares parser with `eslint-config-umeboshi`', () => {
            expect(config.parser).toBe(baseConfig.parser);
        });

        test('shares settings with `eslint-config-umeboshi`', () => {
            expect(config.settings).toBe(baseConfig.settings);
        });

        test('shares globals with `eslint-config-umeboshi`', () => {
            expect(config.globals).toBe(baseConfig.globals);
        });

        test('extends `airbnb` preset', () => {
            expect(config.extends).toEqual(['airbnb']);
        });

    });

    describe('Specific rules', () => {

        test('should allow `.js` file extension', () => {
            const { rules } = config;
            const rule = rules['react/jsx-filename-extension'];
            const [flag, options] = rule;
            expect(flag).toBe(1);
            expect(options.extensions).toEqual(['.js', '.jsx']);
        });

        test('should contain all of the rules of `eslint-config-umeboshi`', () => {
            const expectedRules = Object.keys(baseConfig.rules);
            const rulesKey = Object.keys(config.rules);

            expectedRules.forEach((k) => {
                expect(rulesKey).toContain(k);
            });
        });

        test('should disable `react/prefer-stateless-function`', () => {
            expect(config.rules['react/prefer-stateless-function']).toBe(0);
        });
    });

});