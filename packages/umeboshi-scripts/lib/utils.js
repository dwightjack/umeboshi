const path = require('path');
const fs = require('fs');
const readPkgUp = require('read-pkg-up');

const { pkg, path: pkgPath } = readPkgUp.sync({
    cwd: fs.realpathSync(process.cwd())
});

const APP_PATH = path.dirname(pkgPath);
const LOCAL_PATH = path.resolve(__dirname, '..');
const UME_SCRIPTS_REGEXP = /^umeboshi-scripts-/;
const UME_CONFIG_REGEXP = /^umeboshi-config-/;

//deps chain...
const { devDependencies = {}, dependencies = {} } = pkg;
const depsArray = Object.keys(Object.assign({}, devDependencies, dependencies)).sort();
const umeboshiScripts = depsArray.filter((p) => UME_SCRIPTS_REGEXP.test(p));
const umeboshiConfigs = depsArray.filter((p) => UME_CONFIG_REGEXP.test(p));

const SCRIPTS_LOAD_PATHS = [
    path.resolve(APP_PATH, 'scripts'),
    ...umeboshiScripts.map((p) => path.resolve(APP_PATH, 'node_modules', p)),
    LOCAL_PATH
];

const CONFIG_LOAD_PATHS = [
    path.resolve(APP_PATH, 'config'),
    ...umeboshiConfigs.map((p) => path.resolve(APP_PATH, 'node_modules', p)),
    path.resolve(APP_PATH, 'node_modules', 'umeboshi-config')
];

const toLocalPath = (...paths) => path.join(APP_PATH, ...paths);

const existsLocal = (...paths) => fs.existsSync(toLocalPath(...paths));


const resolvePath = (...paths) => {
    for (let i = 0, l = paths.length; i < l; i += 1) {
        if (fs.existsSync(paths[i])) {
            return paths[i];
        }
    }
    return false;
};

const resolve = (filepath, paths) => resolvePath(
    paths.map((p) => path.join(p, filepath))
);

const loadScript = (filepath, resolvePaths = SCRIPTS_LOAD_PATHS) => {
    const realpath = resolve(filepath, resolvePaths);
    return require(realpath);
};

const loadConfig = (filepath, resolvePaths = CONFIG_LOAD_PATHS) => {
    const realpath = resolve(filepath, resolvePaths);
    return require(realpath);
};

module.exports = {
    APP_PATH,
    LOCAL_PATH,
    toLocalPath,
    existsLocal,
    resolvePath,
    loadScript,
    loadConfig,
    resolve
};