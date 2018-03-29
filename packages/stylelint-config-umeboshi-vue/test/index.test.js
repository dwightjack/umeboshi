const pkg = require('../package.json');

describe('stylelint-config-umeboshi', () => {

    let config;

    beforeEach(() => {
        config = require('../index');
    });

    describe('Dependencies', () => {

        test('stylelint is a peer', () => {
            expect(pkg).toHaveProperty('peerDependencies.stylelint');
        });

        [
            'stylelint-config-umeboshi',
            'stylelint-processor-html'
        ].forEach((key) => {
            test(`${key} is a dependency`, () => {
                expect(pkg.dependencies).toHaveProperty(key);
            });
        });
    });

    describe('Features', () => {

        test('extends stylelint-config-standard`', () => {
            expect(config.extends).toEqual(['stylelint-config-umeboshi']);
        });

        test('uses html processors', () => {
            expect(config.processors).toContain(require.resolve('stylelint-processor-html'));
        });
    });

    describe('Rules', () => {
        test('disable empty source', () => {
            expect(config.rules['no-empty-source']).toBe(null);
        });
    });

});