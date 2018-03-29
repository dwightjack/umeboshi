describe('eslint-config-umeboshi-vue', () => {

    let config;

    beforeEach(() => {
        config = require('../index');
    });

    describe('Features', () => {

        test('should extend eslint-config-umeboshi', () => {
            expect(config.extends).toEqual(['eslint-config-umeboshi']);
        });

        test('should use `html` plugin', () => {
            expect(config.plugins).toEqual(['html']);
        });

        test('should expose shared rules', () => {
            const rules = require('../rules');

            expect(config.rules).toBe(rules);
        });

    });

});