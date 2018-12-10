const server = require('../../server/dev');

const paths = {
    toAbsPath: jest.fn(() => '')
};

describe('config/server', () => {
    let hosts;
    let env;
    let webpackConfig;

    beforeEach(() => {
        hosts = {
            localhost: {}
        };
        env = {};
        webpackConfig = {};
    });
    test('is an high order function', () => {
        const fn = server({ paths, hosts });
        expect(fn).toEqual(expect.any(Function));
    });

    test('configures dist.root as content base', () => {
        paths.toAbsPath.mockImplementation(() => 'TEST-VALUE');
        const cfg = server({ paths, hosts })(env, webpackConfig);
        expect(cfg.contentBase[0]).toBe('TEST-VALUE');
        expect(paths.toAbsPath).toHaveBeenCalledWith('dist.root');
    });

    test('hot by default', () => {
        const cfg = server({ paths, hosts })(env, webpackConfig);
        expect(cfg.hot).toBe(true);
        expect(cfg.hotOnly).toBe(false);
    });

    test('sets the port either to env.port or localhost.port', () => {
        const cfg = server({ paths, hosts })({ port: 9 }, webpackConfig);
        const cfg2 = server({
            paths,
            hosts: {
                localhost: { port: 10 }
            }
        })(env, webpackConfig);
        expect(cfg.port).toBe(9);
        expect(cfg2.port).toBe(10);
    });

    test('inherits public path from env', () => {
        const cfg = server({ paths, hosts })(
            { publicPath: 'DEMO' },
            webpackConfig
        );
        expect(cfg.publicPath).toBe('DEMO');
    });

    test('inherits stats from the webpack config', () => {
        webpackConfig.stats = {};
        const cfg = server({ paths, hosts })(env, webpackConfig);
        expect(cfg.stats).toBe(webpackConfig.stats);
    });
});
