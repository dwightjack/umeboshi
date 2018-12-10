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
        let mockWebpackConf;

        beforeEach(() => {
            mockWebpackConf = jest.fn(() => '/test/mock.js');
            jest.mock('umeboshi-scripts/webpack', () => mockWebpackConf);
        });

        test('should add importer/resolve for webpack', () => {
            const { settings } = require('../index');
            const realpath = require.resolve('umeboshi-scripts/webpack');

            const expected = {
                'import/resolver': {
                    webpack: {
                        config: realpath
                    }
                }
            };

            expect(settings).toEqual(expected);
        });
    });
});
