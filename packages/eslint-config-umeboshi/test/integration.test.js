const fs = require('fs');
const path = require('path');
const { CLIEngine } = require('eslint');

const mockWebpackConf = require('./fixtures/webpack.conf.js');

describe('eslint-config-umeboshi [integration tests]', () => {
    let cli;
    let conf;

    const getFixture = (filename) =>
        fs.readFileSync(path.resolve(__dirname, 'fixtures', filename), {
            encoding: 'utf8'
        });
    const lint = (text) => cli.executeOnText(text).results[0];

    const expectZero = (results, key) => {
        if (Array.isArray(key)) {
            key.forEach((k) => expectZero(results, k));
            return;
        }
        const count = results[key];
        if (count > 0) {
            console.log(results.messages); //eslint-disable-line no-console
        }
        expect(count).toBe(0);
    };

    jest.mock('umeboshi-scripts/webpack', () => mockWebpackConf);

    beforeEach(() => {
        conf = require('../index');

        cli = new CLIEngine({
            useEslintrc: false,
            baseConfig: conf,
            rules: {
                // It is okay to import devDependencies in tests.
                'import/no-extraneous-dependencies': [
                    2,
                    { devDependencies: true }
                ]
            }
        });
    });

    test('should NOT produce errors validation', () => {
        const code = getFixture('success.js');
        const results = lint(code);
        expectZero(results, 'errorCount');
    });

    test('should NOT produce warnings validation', () => {
        const code = getFixture('success.js');
        const results = lint(code);
        expectZero(results, 'warningCount');
    });

    describe('specific rules', () => {
        const filterUnresolved = (messages) =>
            messages.filter(({ ruleId }) => ruleId === 'import/no-unresolved');

        test('import/no-unresolved ignores styles', () => {
            const code = `
                import styles from './styles.scss';
                import css from './styles.css';
            `.trim();
            const { messages } = lint(code);
            const unresolved = filterUnresolved(messages);
            expect(unresolved).toHaveLength(0);
        });

        test('import/no-unresolved fails with JS', () => {
            const code = `
                import unresolved from './missing-module';
            `.trim();
            const { messages } = lint(code);
            const unresolved = filterUnresolved(messages);
            expect(unresolved).toHaveLength(1);
        });
    });

    describe('webpack resolver', () => {
        test('should resolve aliased folders', () => {
            const code = getFixture('resolver.js');
            const results = lint(code);
            expectZero(results, ['errorCount', 'warningCount']);
        });
    });
});
