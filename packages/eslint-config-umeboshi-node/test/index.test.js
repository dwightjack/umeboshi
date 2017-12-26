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


describe('eslint-config-umeboshi-node', () => {

    let config;

    beforeEach(() => {
        config = require('../index');
    });

    describe('Features', () => {

        it('uses `eslint-plugin-node`', () => {
            expect(config.plugins).toEqual(['node']);
        });

        it('should extend eslint recommended settings', () => {
            expect(config.extends[0]).toBe('eslint:recommended');
        });

        it('should extend node plugin recommended', () => {
            expect(config.extends[1]).toBe('plugin:node/recommended');
        });

        it('should include selected airbnb rules', () => {
            const expected = [
                'eslint-config-airbnb-base/rules/best-practices',
                'eslint-config-airbnb-base/rules/errors',
                'eslint-config-airbnb-base/rules/node',
                'eslint-config-airbnb-base/rules/style',
                'eslint-config-airbnb-base/rules/variables',
                'eslint-config-airbnb-base/rules/es6'
            ].map(require.resolve);

            const rules = config.extends.filter(
                (r) => r.indexOf('eslint-config-airbnb') !== -1
            );

            expect(rules).toEqual(expected);
        });

    });

    describe('Environment', () => {

        it('should allow es6 syntax', () => {
            const { env } = require('../index');
            expect(env.es6).toBe(true);
        });

        it('should set node env', () => {
            const { env } = require('../index');
            expect(env.node).toBe(true);
        });

    });

    describe('Specific rules', () => {

        it('should disable `node/no-unpublished-require` rule', () => {
            const { rules } = require('../index');
            expect(rules).toMatchObject({
                'node/no-unpublished-require': 'off'
            });
        });

        it('should disable `global-require` rule', () => {
            const { rules } = require('../index');
            expect(rules).toMatchObject({
                'global-require': 'off'
            });
        });

    });

});