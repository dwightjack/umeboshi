const preset = require('../index');

describe('babel-preset-umeboshi', () => {

    describe('presets', () => {

        beforeEach(() => {
            process.env.NODE_ENV = 'development';
        });

        it('has `umeboshi` as first preset. Without options', () => {
            expect(preset().presets[0]).toBe(require.resolve('babel-preset-umeboshi'));
        });

        it('has `react` as second preset. Without options', () => {
            expect(preset().presets[1]).toBe(require.resolve('babel-preset-react'));
        });

        afterEach(() => {
            process.env.NODE_ENV = 'test';
        });
    });

    describe('plugins', () => {

        beforeEach(() => {
            process.env.NODE_ENV = 'development';
        });

        afterEach(() => {
            //jest default
            process.env.NODE_ENV = 'test';
        });

        it('DOES NOT have any plugin in development', () => {
            process.env.NODE_ENV = 'development';
            expect(preset().plugins.length).toBe(0);
        });

        it('adds 3 plugins in production', () => {
            process.env.NODE_ENV = 'production';

            const expected = [
                require.resolve('babel-plugin-transform-react-constant-elements'),
                require.resolve('babel-plugin-transform-react-inline-elements'),
                require.resolve('babel-plugin-transform-react-remove-prop-types')
            ];

            expect(preset().plugins).toEqual(expected);
        });

    });

});