const preset = require('../index');
const env = require('babel-preset-env');
const stage2 = require('babel-preset-stage-2');

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

        it('has `env` as first preset', () => {
            expect(preset.presets[0][0]).toBe(env);
        });

        it('enforces useBuiltIns option to `entry`', () => {
            const options = preset.presets[0][1];
            expect(options).toMatchObject({ useBuiltIns: 'entry' });
        });

        it('has `stage-2` preset as 2nd entry', () => {
            expect(preset.presets[1]).toBe(stage2);
        });
    });

    describe('test plugins', () => {

        let commonJSTransform;


        beforeEach(() => {
            jest.resetModules();
            commonJSTransform = require('babel-plugin-transform-es2015-modules-commonjs');
        });

        afterEach(() => {
            //jest default
            process.env.NODE_ENV = 'test';
        });

        it('DOES NOT add `transform-es2015-modules-commonjs` plugin on `NODE_ENV != "test"`', () => {
            process.env.NODE_ENV = 'development';
            const { plugins } = require('../index');
            expect(recurseMatch(plugins, (i) => i === commonJSTransform)).toBe(false);
        });

        it('adds `transform-es2015-modules-commonjs` plugin on `BABEL_ENV != "test"`', () => {
            process.env.NODE_ENV = 'development';
            process.env.BABEL_ENV = 'test';
            const { plugins } = require('../index');
            expect(recurseMatch(plugins, (i) => i === commonJSTransform)).not.toBe(false);
        });

        it('adds `transform-es2015-modules-commonjs` plugin on test environments', () => {
            const { plugins } = require('../index');
            expect(recurseMatch(plugins, (i) => i === commonJSTransform)).not.toBe(false);
        });

    });

    describe('runtime plugin', () => {

        let runtime;
        let match;

        beforeEach(() => {
            jest.resetModules();
            runtime = require('babel-plugin-transform-runtime');
            const { plugins } = require('../index');
            match = recurseFind(plugins, runtime);
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