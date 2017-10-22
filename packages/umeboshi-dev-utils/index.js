const path = require('path');
const fs = require('fs');
const readPkgUp = require('read-pkg-up');

const { pkg, path: pkgPath } = readPkgUp.sync({
    cwd: fs.realpathSync(process.cwd())
});

const APP_PATH = path.dirname(pkgPath);
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
    path.resolve(APP_PATH, 'node_modules', 'umeboshi-scripts')
];

const CONFIG_LOAD_PATHS = [
    path.resolve(APP_PATH, 'config'),
    ...umeboshiConfigs.map((p) => path.resolve(APP_PATH, 'node_modules', p)),
    path.resolve(APP_PATH, 'node_modules', 'umeboshi-config')
];

/**
 * Resolves a path local to the project root folder.
 * Works as `path.resolve` with the project root as its first argument
 *
 * @param {...string} paths - Path chain to resolve
 * @return {string}
 */
const toLocalPath = (...paths) => path.resolve(APP_PATH, ...paths);

/**
 * Checks if a given path exists in the project root folder
 *
 * @see toLocalPath
 * @param {...string} paths - Path chain to resolve
 * @return {boolean}
 */
const existsLocal = (...paths) => fs.existsSync(toLocalPath(...paths));

/**
 * Checks a list of paths for existence (`fs.existsSync`) and returns the first match.
 * Returns `false` if all checks fail.
 *
 * @param {...string} paths - Paths to match
 * @return {string|boolean}
 */
const resolvePath = (...paths) => {
    for (let i = 0, l = paths.length; i < l; i += 1) {
        if (fs.existsSync(paths[i])) {
            return paths[i];
        }
    }
    return false;
};

/**
 * Resolves a file path from an array of base path. Returns the first match or `false`.
 *
 * @see resolvePath
 * @param {string} filepath - File path to resolve
 * @param {string[]} paths - Array of base paths to use in path resolution
 * @returns {string|boolean}
 */
const resolve = (filepath, paths) => resolvePath(
    ...paths.map((p) => path.join(p, filepath))
);

/**
 * Tries to resolve and load a module given it's relative path an array of base paths.
 *
 * @see resolve
 * @param {string} filepath - File path to load
 * @param {string[]} resolvePaths - Array of base paths to use in path resolution
 * @return {*}
 */
const load = (filepath, resolvePaths) => {
    const realpath = resolve(filepath, resolvePaths);
    if (realpath === false) {
        throw new Error(`Unable to load file ${filepath}. Resolve folders: ${resolvePaths.join(', ')}`);
    }
    return require(realpath);
};

/**
 * Loads a script. Default resolution order: current project, `umeboshi-script-` package, `umeboshi-scripts-x` package plugins.
 *
 * @see load
 * @param {string} filepath - File path to load
 * @param {string[]} [resolvePaths] - Array of base paths to use in path resolution
 */
const loadScript = (filepath, resolvePaths = SCRIPTS_LOAD_PATHS) => {
    return load(filepath, resolvePaths);
};

/**
 * Loads a configuration. Default resolution order: current project, `umeboshi-config-` package, `umeboshi-config-x` package plugins.
 *
 * @see load
 * @param {string} filepath - File path to load
 * @param {string[]} [resolvePaths] - Array of base paths to use in path resolution
 */
const loadConfig = (filepath, resolvePaths = CONFIG_LOAD_PATHS) => {
    return load(filepath, resolvePaths);
};

module.exports = {
    APP_PATH,
    SCRIPTS_LOAD_PATHS,
    CONFIG_LOAD_PATHS,
    toLocalPath,
    existsLocal,
    resolvePath,
    loadScript,
    loadConfig,
    resolve
};