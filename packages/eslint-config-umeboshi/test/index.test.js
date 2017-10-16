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

    beforeEach(() => {
        config = require('../index');
    });

    describe('Features', () => {

        it('should extend airbnb-base', () => {
            expect(config.extends).toEqual(['eslint-config-airbnb-base']);
        });

        it('uses babel-eslint as parser', () => {
            expect(config.parser).toBe('babel-eslint');
        });

    });

    describe('Globals', () => {
        it('should accept Modernizr and __PRODUCTION__', () => {
            expect(config.globals).toEqual({
                Modernizr: true,
                __PRODUCTION__: true
            });
        });
    });

    describe('webpack importer', () => {

        let utils;

        beforeEach(() => {
            jest.resetModules();
            utils = require('umeboshi-scripts/lib/utils');
        });

        it('should try to resolve webpack base config', () => {
            utils.resolve = jest.fn(() => false);
            require('../index');

            expect(utils.resolve).toHaveBeenCalledWith('webpack/webpack.base.js', utils.CONFIG_LOAD_PATHS);
        });

        it('should add importer/resolve for webpack', () => {
            utils.resolve = jest.fn(() => '/test/mock.js');
            const { settings } = require('../index');

            const expected = {
                'import/resolver': {
                    webpack: {
                        config: '/test/mock.js'
                    }
                }
            };

            expect(settings).toEqual(expected);
        });

        it('should NOT add importer/resolve for webpack when webpack file resolution fails', () => {
            utils.resolve = jest.fn(() => false);
            const { settings } = require('../index');
            expect(settings).toEqual({});
        });

    });

});