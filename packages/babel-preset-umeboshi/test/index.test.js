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

    let presets;


    describe('presets', () => {

        beforeEach(() => {
            process.env.NODE_ENV = 'development';
        });

        it('has `env` as first preset', () => {
            expect(presets[0][0]).toBe(require.resolve('babel-preset-env'));
        });

        it('enforces useBuiltIns option to `entry`', () => {

            const options = presets[0][1];
            expect(options).toMatchObject({ useBuiltIns: 'entry' });
        });

        it('has `stage-2` preset as 2nd entry', () => {
            expect(presets[1]).toBe(require.resolve('babel-preset-stage-2'));
        });

        afterEach(() => {
            process.env.NODE_ENV = 'test';
        });
    });

    describe('NODE_ENV=test presets', () => {

        it('should set env preset to current node on test', () => {
            process.env.NODE_ENV = 'test';
            const { presets } = presetFn(); //eslint-disable-line no-shadow
            expect(presets[0][1].targets).toEqual({ node: 'current' });
        });

        it('should set env preset to current node on test when BABEL_ENV=test', () => {
            process.env.NODE_ENV = 'development';
            process.env.BABEL_ENV = 'test';

            const { presets } = presetFn(); //eslint-disable-line no-shadow
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

        it('DOES NOT add `transform-es2015-modules-commonjs` plugin on `NODE_ENV != "test"`', () => {
            process.env.NODE_ENV = 'development';
            const { plugins } = presetFn();
            expect(recurseMatch(plugins, (i) => i === commonJSTransform)).toBe(false);
        });

        it('adds `transform-es2015-modules-commonjs` plugin on `BABEL_ENV != "test"`', () => {
            process.env.NODE_ENV = 'development';
            process.env.BABEL_ENV = 'test';
            const { plugins } = presetFn();
            expect(recurseMatch(plugins, (i) => i === commonJSTransform)).toBe(true);
        });

        it('adds `transform-es2015-modules-commonjs` plugin on test environments', () => {
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

        it('should have runtime-plugin with options', () => {
            expect(match).toBeInstanceOf(Array);
        });

        it('should have runtime-plugin with options', () => {
            expect(match[0]).toBe(runtime);
        });

        it('polyfill and generator runtime should be disabled', () => {
            expect(match[1]).toEqual({ polyfill: false, regenerator: false });
        });
    });

});