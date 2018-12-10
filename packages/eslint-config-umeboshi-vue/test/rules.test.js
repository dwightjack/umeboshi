describe('eslint-config-vue/rules', () => {
    let rules;

    beforeEach(() => {
        ({ rules } = require('../index'));
    });

    test('should allow extension omission for .js and .vue files', () => {
        const expected = ['error', 'always', { js: 'never', vue: 'never' }];
        expect(rules['import/extensions']).toEqual(expected);
    });

    test('should disable `eol-last` rule', () => {
        expect(rules['eol-last']).toBe(0);
    });

    test('should enforce 4 space indentation for vue templates', () => {
        expect(rules['vue/html-indent'][0]).toBe('error');
        expect(rules['vue/html-indent'][1]).toBe(4);
    });
});
