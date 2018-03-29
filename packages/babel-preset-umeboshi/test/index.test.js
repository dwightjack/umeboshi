const presetFn = require('../index');

const recurseMatch = (arr, matcher) => {
    for (let i = 0; i < arr.length; i += 1) {
        const item = arr[i];
        if (Array.isArray(item)) {
            const result = recurseMatch(item, matcher);
            if (result === true) { return true; }
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

        test('has `env` as first preset', () => {
            const { presets } = presetFn();
            expect(presets[0][0]).toBe(require.resolve('babel-preset-env'));
        });

        test('enforces useBuiltIns option to `entry`', () => {
            const { presets } = presetFn();
            const options = presets[0][1];
            expect(options).toMatchObject({ useBuiltIns: 'entry' });
        });

        test('has `stage-2` preset as 2nd entry', () => {
            const { presets } = presetFn();
            expect(presets[1]).toBe(require.resolve('babel-preset-stage-2'));
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
            commonJSTransform = require.resolve('babel-plugin-transform-es2015-modules-commonjs');
        });

        afterEach(() => {
            //jest default
            process.env.NODE_ENV = 'test';
        });

        test('DOES NOT add `transform-es2015-modules-commonjs` plugin on `NODE_ENV != "test"`', () => {
            process.env.NODE_ENV = 'development';
            process.env.BABEL_ENV = '';
            const { plugins } = presetFn();
            expect(recurseMatch(plugins, (i) => i === commonJSTransform)).toBe(false);
        });

        test('adds `transform-es2015-modules-commonjs` plugin on `BABEL_ENV != "test"`', () => {
            process.env.NODE_ENV = 'development';
            process.env.BABEL_ENV = 'test';
            const { plugins } = presetFn();
            expect(recurseMatch(plugins, (i) => i === commonJSTransform)).toBe(true);
        });

        test('adds `transform-es2015-modules-commonjs` plugin on test environments', () => {
            const { plugins } = presetFn();
            expect(recurseMatch(plugins, (i) => i === commonJSTransform)).not.toBe(false);
        });

    });

    describe('runtime plugin', () => {

        let runtime;
        let match;

        beforeEach(() => {
            process.env.NODE_ENV = 'development';
            runtime = require.resolve('babel-plugin-transform-runtime');
            const { plugins } = presetFn();
            match = recurseFind(plugins, runtime);
        });

        afterEach(() => {
            //jest default
            process.env.NODE_ENV = 'test';
        });

        test('should have runtime-plugin with options', () => {
            expect(match).toBeInstanceOf(Array);
        });

        test('should have runtime-plugin with options', () => {
            expect(match[0]).toBe(runtime);
        });

        test('polyfill is disabled', () => {
            expect(match[1].polyfill).toBe(false);
        });

        test('regenerator is on by default', () => {
            expect(match[1].regenerator).toBe(true);
        });

        test('can disable regenerator with a configuration flag', () => {
            const { plugins } = presetFn(null, { async: false, asyncImport: false });
            const [, matched] = recurseFind(plugins, runtime);
            expect(matched.regenerator).toBe(false);
        });

        test('includes regenerator if `async` option is true', () => {
            const { plugins } = presetFn(null, { async: true, asyncImport: false });
            const [, matched] = recurseFind(plugins, runtime);
            expect(matched.regenerator).toBe(true);
        });

        test('includes regenerator if `asyncImport` option is true', () => {
            const { plugins } = presetFn(null, { async: false, asyncImport: true });
            const [, matched] = recurseFind(plugins, runtime);
            expect(matched.regenerator).toBe(true);
        });
    });

});