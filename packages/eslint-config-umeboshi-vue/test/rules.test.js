describe('eslint-config-vue/rules', () => {

    let rules;

    beforeEach(() => {
        rules = require('../rules');
    });

    it('should allow extension omission for .js and .vue files', () => {
        const expected = [
            'error',
            'always',
            { js: 'never', vue: 'never' }
        ];
        expect(rules['import/extensions']).toEqual(expected);
    });

    it('should disable `eol-last` rule', () => {
        expect(rules['eol-last']).toBe(0);
    });

});