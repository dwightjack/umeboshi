const presetFn = require('../index');

const recurseMatch = (arr, matcher) => {
    for (let i = 0; i < arr.length; i += 1) {
        const item = arr[i];
        if (Array.isArray(item)) {
            const result = recurseMatch(item, matcher);
            if (result === true) {
                return true;
            }
        }

        if (matcher(item) === true) {
            return true;
        }
    }
    return false;
};

const recurseFind = (arr, match) => {
    return arr.find((item) => {
        if (Array.isArray(item) && item.indexOf(match) !== -1) {
            return true;
        }
        return item === match;
    });
};

describe('babel-preset-umeboshi', () => {
    describe('presets', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'development';
        });

        test('has `env` preset', () => {
            const { presets } = presetFn();
            expect(presets).toEqual([
                [require.resolve('@babel/preset-env'), expect.any(Object)]
            ]);
        });

        test('enforces useBuiltIns option to `usage`', () => {
            const { presets } = presetFn();
            const options = presets[0][1];
            expect(options).toMatchObject({ useBuiltIns: 'usage' });
        });

        afterEach(() => {
            process.env.NODE_ENV = 'test';
        });
    });

    describe('NODE_ENV=test presets', () => {
        test('should set env preset to current node on test', () => {
            process.env.NODE_ENV = 'test';
            const { presets } = presetFn();
            expect(presets[0][1].targets).toEqual({ node: 'current' });
        });

        test('should set env preset to current node on test when BABEL_ENV=test', () => {
            process.env.NODE_ENV = 'development';
            process.env.BABEL_ENV = 'test';

            const { presets } = presetFn();
            expect(presets[0][1].targets).toEqual({ node: 'current' });

            process.env.NODE_ENV = 'test';
        });
    });

    describe('test plugins', () => {
        let commonJSTransform;

        beforeEach(() => {
            process.env.NODE_ENV = 'development';
            commonJSTransform = require.resolve(
                '@babel/plugin-transform-modules-commonjs'
            );
        });

        afterEach(() => {
            //jest default
            process.env.NODE_ENV = 'test';
        });

        test('DOES NOT add `@babel/plugin-transform-modules-commonjs` plugin on `NODE_ENV != "test"`', () => {
            process.env.NODE_ENV = 'development';
            process.env.BABEL_ENV = '';
            const { plugins } = presetFn();
            expect(recurseMatch(plugins, (i) => i === commonJSTransform)).toBe(
                false
            );
        });

        test('adds `@babel/plugin-transform-modules-commonjs` plugin on `BABEL_ENV != "test"`', () => {
            process.env.NODE_ENV = 'development';
            process.env.BABEL_ENV = 'test';
            const { plugins } = presetFn();
            expect(recurseMatch(plugins, (i) => i === commonJSTransform)).toBe(
                true
            );
        });

        test('adds `@babel/plugin-transform-modules-commonjs` plugin on test environments', () => {
            const { plugins } = presetFn();
            expect(
                recurseMatch(plugins, (i) => i === commonJSTransform)
            ).not.toBe(false);
        });
    });

    describe('syntax plugins', () => {
        let plugins;

        beforeEach(() => {
            ({ plugins } = presetFn());
        });

        test('includes class properties plugin', () => {
            expect(plugins).toContain(
                require.resolve('@babel/plugin-proposal-class-properties')
            );
        });

        test('includes rest spread plugin', () => {
            expect(plugins).toContain(
                require.resolve('@babel/plugin-proposal-object-rest-spread')
            );
        });

        test('includes dynamic import plugin', () => {
            process.env.NODE_ENV = 'development';
            process.env.BABEL_ENV = '';
            ({ plugins } = presetFn());
            expect(plugins).toContain(
                require.resolve('@babel/plugin-syntax-dynamic-import')
            );
            process.env.NODE_ENV = 'test';
        });
    });

    describe('runtime plugin', () => {
        let runtime;
        let match;

        beforeEach(() => {
            process.env.NODE_ENV = 'development';
            runtime = require.resolve('@babel/plugin-transform-runtime');
            const { plugins } = presetFn();
            match = recurseFind(plugins, runtime);
        });

        afterEach(() => {
            //jest default
            process.env.NODE_ENV = 'test';
        });

        test('should have runtime-plugin', () => {
            expect(match).toBe(runtime);
        });
    });
});
