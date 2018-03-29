describe('eslint-config-vue/rules', () => {

    let rules;

    beforeEach(() => {
        rules = require('../rules');
    });

    test('should allow extension omission for .js and .vue files', () => {
        const expected = [
            'error',
            'always',
            { js: 'never', vue: 'never' }
        ];
        expect(rules['import/extensions']).toEqual(expected);
    });

    test('should disable `eol-last` rule', () => {
        expect(rules['eol-last']).toBe(0);
    });

});