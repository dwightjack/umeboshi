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
            'stylelint-config-standard',
            'stylelint-order',
            'stylelint-scss'
        ].forEach((key) => {
            test(`${key} is a dependency`, () => {
                expect(pkg.dependencies).toHaveProperty(key);
            });
        });
    });

    describe('Features', () => {
        test('extends stylelint-config-standard`', () => {
            expect(config.extends).toEqual(['stylelint-config-standard']);
        });

        test('uses scss plugin', () => {
            expect(config.plugins).toContain('stylelint-scss');
        });

        test('uses order plugin', () => {
            expect(config.plugins).toContain('stylelint-order');
        });
    });

    describe('Rules', () => {
        let rules;

        beforeAll(() => {
            rules = config.rules; //eslint-disable-line prefer-destructuring
        });

        test('4 space indentation', () => {
            expect(rules.indentation[0]).toBe(4);
        });

        test('uses scss/at-rule-no-unknown instead of at-rule-no-unknown', () => {
            expect(rules['at-rule-no-unknown']).toBe(null);
            expect(rules['scss/at-rule-no-unknown']).toBe(true);
        });
    });

    describe('css-modules', () => {
        let rules;

        beforeAll(() => {
            rules = config.rules; //eslint-disable-line prefer-destructuring
        });

        ['export', 'import', 'global', 'local'].forEach((key) => {
            test(`allows css-modules "${key}" keyword`, () => {
                const ignored =
                    rules['selector-pseudo-class-no-unknown'][1]
                        .ignorePseudoClasses;
                expect(ignored).toContain(key);
            });
        });

        ['composes', 'compose-with'].forEach((key) => {
            test(`allows css-modules "${key}" property`, () => {
                const ignored =
                    rules['property-no-unknown'][1].ignoreProperties;
                expect(ignored).toContain(key);
            });
        });
    });

    describe('order plugin', () => {
        test('has a custom properties order', () => {
            const rule = config.rules['order/properties-order'];
            expect(rule).toBeInstanceOf(Array);
            expect(rule.length).toBeGreaterThan(0);
        });

        test('does NOT force alphabetical order', () => {
            const rule = config.rules['order/properties-alphabetical-order'];
            expect(rule).toBeUndefined();
        });

        test('does NOT have a custom ordering', () => {
            const rule = config.rules['order/order'];
            expect(rule).toBeUndefined();
        });
    });
});
