const path = require('path');
const fs = require('fs');
const readPkgUp = require('read-pkg-up');
const Paths = require('./lib/paths');
const get = require('lodash/get');
const isFunction = require('lodash/isFunction');
const WebpackChain = require('webpack-chain');

const { pkg, path: pkgPath } = readPkgUp.sync({
    cwd: fs.realpathSync(process.cwd())
});

const fileCheckCache = {};

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
    //path.resolve(APP_PATH, 'config'),
    ...umeboshiConfigs.map((p) => path.resolve(APP_PATH, 'node_modules', p)),
    path.resolve(APP_PATH, 'node_modules', 'umeboshi-config')
];

/**
 * Checks if value is a function and executes it with passed-in `args`, else returns it as-is.
 *
 * @param {*} value Object to evaluate.
 * @param {...*} [args] Function arguments
 * @return {*}
 */
const evaluate = (value, ...args) => (
    isFunction(value) ? value(...args) : value
);

/**
 * Merges two configuration objects. If `source` is a function, executes it with `config` as it's first argument.
 *
 * @param {object} config Destination object
 * @param {object|function} [source] Object to merge with destination. If a function, it will be executed with the `config` object as parameter
 * @param {...*} [args] Optional arguments passed to the function
 * @return {object}
 */
const mergeConfig = (config, source, ...args) => {
    if (!source) {
        return config;
    }
    if (isFunction(source)) {
        return source(config, ...args);
    }
    return Object.assign(config, source);
};

/**
 * Returns a plain webpack config or an array of configs
 *
 * @param {object|object[]} config Config to resolve. Either a plain object or a webpack-chain instance
 * @return {object|object[]}
 */
const toWebpackConfig = (config) => {
    if (Array.isArray(config)) {
        return config.map(toWebpackConfig);
    }
    return isFunction(config.toConfig) ? config.toConfig() : config;
};

/**
 * Resolves a path local to the project root folder.
 * Works as `path.resolve` with the project root as its first argument
 *
 * @param {...string} paths - Path chain to resolve
 * @return {string}
 */
const toLocalPath = (...paths) => path.resolve(APP_PATH, ...paths);

/**
 * Checks if a file or directory exists
 *
 * Results are cached to improve performances.
 *
 * @param {string} filepath - Path to the file or directory to be checked
 * @return {boolean}
 */
const exists = (filepath) => {
    if (fileCheckCache[filepath] === undefined) {
        fileCheckCache[filepath] = fs.existsSync(filepath);
    }
    return fileCheckCache[filepath];
};


/**
 * Checks if a given path exists in the project root folder.
 *
 * @see toLocalPath
 * @see exists
 * @param {...string} paths - Path chain to resolve
 * @return {boolean}
 */
const existsLocal = (...paths) => exists(toLocalPath(...paths));

/**
 * Checks a list of paths for existence (`fs.existsSync`) and returns the first match.
 * Returns `false` if all checks fail.
 *
 * @see exists
 * @param {...string} paths - Paths to match
 * @return {string|boolean}
 */
const resolvePath = (...paths) => {
    for (let i = 0, l = paths.length; i < l; i += 1) {
        if (exists(paths[i])) {
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
 * Loads a script. Default resolution order: current project, `umeboshi-script-*` custom packages, `umeboshi-scripts` package.
 *
 * @see load
 * @param {string} filepath - File path to load
 * @param {string[]} [resolvePaths] - Array of base paths to use in path resolution
 */
const loadScript = (filepath, resolvePaths = SCRIPTS_LOAD_PATHS) => {
    return load(filepath, resolvePaths);
};

/**
 * Loads a configuration. Default resolution order: current project, `umeboshi-config-*` custom packages `umeboshi-config` package.
 *
 * @see load
 * @param {string} filepath - File path to load
 * @param {string[]} [resolvePaths] - Array of base paths to use in path resolution
 */
const loadConfig = (filepath, resolvePaths = CONFIG_LOAD_PATHS) => {
    return load(filepath, resolvePaths);
};

/**
 * Tries to load a `umeboshi.config.js` file from the project root folder and returns it.
 *
 * If not found returns `undefined`.
 *
 * @param {string} [frag] Return a specific property from the configuration object
 * @return {*}
 */
const loadUmeboshiConfig = (frag) => {
    if (!existsLocal('umeboshi.config.js')) {
        return {};
    }

    try {
        const conf = require(toLocalPath('umeboshi.config.js'));
        return frag ? get(conf, frag) : conf;
    } catch (e) {
        console.error(e); //eslint-disable-line no-console
        return undefined;
    }

};

/**
 * Returns a new instance of `webpack-chain`
 *
 * @return {WebpackChain}
 */
const webpackConfig = () => new WebpackChain();

const paths = mergeConfig(loadConfig('paths.js'), loadUmeboshiConfig('paths'));

module.exports = {
    paths: Paths(APP_PATH, paths),
    APP_PATH,
    SCRIPTS_LOAD_PATHS,
    CONFIG_LOAD_PATHS,
    toLocalPath,
    exists,
    existsLocal,
    resolvePath,
    loadScript,
    loadConfig,
    loadUmeboshiConfig,
    resolve,
    evaluate,
    mergeConfig,
    toWebpackConfig,
    webpackConfig
};