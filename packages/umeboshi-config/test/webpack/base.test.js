const base = require('../../webpack/webpack.base');

const paths = {
    toAbsPath: jest.fn(() => ''),
    get: jest.fn(() => ''),
    toPath: jest.fn(() => ''),
    assetsPath: jest.fn(() => '')
};
describe('config/webpack/base', () => {
    test('exposes a function that returns a webpack-chain instance', () => {
        expect(base).toEqual(expect.any(Function));
        expect(base({ paths }).toConfig).toEqual(expect.any(Function));
    });

    test('sets a name onto the config', () => {
        expect(base({ paths }).get('name')).toBe('client');
    });
});
