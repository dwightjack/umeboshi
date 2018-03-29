describe('eslint-config-umeboshi', () => {

    let config;

    beforeEach(() => {
        config = require('../index');
    });

    describe('Features', () => {

        test('should extend airbnb-base', () => {
            expect(config.extends).toEqual(['eslint-config-airbnb-base']);
        });

        test('uses babel-eslint as parser', () => {
            expect(config.parser).toBe('babel-eslint');
        });

    });

    describe('Globals', () => {
        test('should accept Modernizr and __PRODUCTION__', () => {
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
            utils = require('umeboshi-dev-utils');
        });

        test('should try to resolve webpack base config', () => {
            utils.resolve = jest.fn(() => false);
            require('../index');

            expect(utils.resolve).toHaveBeenCalledWith('webpack/webpack.base.js', utils.CONFIG_LOAD_PATHS);
        });

        test('should add importer/resolve for webpack', () => {
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

        test('should NOT add importer/resolve for webpack when webpack file resolution fails', () => {
            utils.resolve = jest.fn(() => false);
            const { settings } = require('../index');
            expect(settings).toEqual({});
        });

    });

});