describe('eslint-config-umeboshi/node', () => {


    let config;

    beforeEach(() => {
        config = require('../node');
    });

    describe('Features', () => {

        it('should extend airbnb-base', () => {
            expect(config.extends).toEqual(['eslint-config-airbnb-base']);
        });

        it('should not use any parser', () => {
            expect(config.parser).toBeUndefined();
        });

        it('should not have any globals', () => {
            expect(config.globals).toBeUndefined();
        });

        it('should disable browser env but enable es6', () => {
            expect(config.env).toEqual({
                browser: false,
                es6: true
            });
        });

    });

    describe('Rules', () => {

        it('should allow global require', () => {
            expect(config.rules['global-require']).toBe(0);
        });

        it('should allow commonjs', () => {
            expect(config.rules['no-commonjs']).toBe(0);
        });

        it('should allow any kind of dependency', () => {
            expect(
                config.rules['import/no-extraneous-dependencies']
            ).toEqual([2, { devDependencies: true, optionalDependencies: true, peerDependencies: true }]);
        });

        it('should allow dynamic require', () => {
            expect(config.rules['import/no-dynamic-require']).toBe(0);
        });

    });

});