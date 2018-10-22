const preset = require('../index');

describe('babel-preset-umeboshi-react', () => {
    describe('presets', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'development';
        });

        test('has `umeboshi` as first preset. Without options', () => {
            expect(preset().presets[0]).toBe(
                require.resolve('babel-preset-umeboshi')
            );
        });

        test('has `react` as second preset. Without options', () => {
            expect(preset().presets[1]).toBe(
                require.resolve('@babel/preset-react')
            );
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

        test('Has HOT reload plugin in development', () => {
            process.env.NODE_ENV = 'development';
            expect(preset().plugins).toEqual(['react-hot-loader/babel']);
        });

        test('adds 3 plugins in production', () => {
            process.env.NODE_ENV = 'production';

            const expected = [
                [
                    require.resolve(
                        'babel-plugin-transform-react-remove-prop-types'
                    ),
                    expect.any(Object)
                ]
            ];

            expect(preset().plugins).toEqual(expected);
        });
    });
});
