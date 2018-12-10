const dev = require('../modernizr/dev');
const prod = require('../modernizr/prod');

const paths = {
    toPath: jest.fn(() => '')
};

describe('umeboshi-config/modernizr', () => {
    describe('dev', () => {
        test('exists', () => {
            expect(dev).toEqual(expect.any(Object));
        });
    });

    describe('prod', () => {
        test('exports a function', () => {
            expect(prod).toEqual(expect.any(Function));
        });

        test('accepts API paths', () => {
            prod({ paths });
            expect(paths.toPath).toHaveBeenCalledWith(expect.any(String));
        });

        test('shares dev options', () => {
            expect(prod({ paths }).options).toBe(dev.options);
        });

        test('crawls', () => {
            expect(prod({ paths })).toHaveProperty('crawl', true);
        });

        test('includes touch events by default', () => {
            expect(prod({ paths }).tests).toEqual([
                'pointerevents',
                'touchevents'
            ]);
        });
    });
});
