# babel-preset-umeboshi

> Standard Babel 7 preset for Umeboshi templates

This preset includes:

-   [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) with `loose=true` and `useBuiltIns='usage'`.
-   ['@babel/plugin-syntax-dynamic-import'](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import)
-   [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html)
-   [@babel/plugin-proposal-object-rest-spread](https://babeljs.io/docs/en/babel-plugin-proposal-object-rest-spread)
-   `@babel/plugin-transform-modules-commonjs` on test environments (`BABEL_ENV = 'test'` or `NODE_ENV = 'test'`)

Regenerator transform and generator polyfill are always included in order to support [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function). If you won't use these features and wish to save some KB you can disable them via [preset options](#preset-options).

## Install

With [npm](https://www.npmjs.com):

```sh
npm install --save-dev babel-preset-umeboshi
```

Or [yarn](https://yarnpkg.com):

```sh
yarn add babel-preset-umeboshi --dev
```

## Usage

Add the preset to `.babelrc` file in your project's root folder.

```json
{
    "presets": ["umeboshi"]
}
```

## Preset options

### Async support for legacy environment

By default both `async/await` and async `import()` are supported. Anyway in order to support older environments the preset needs to transpile them to generators and include the related runtime. This will result in an increased bundle size.  
If you plan not to use such features, or your target browsers already support them, you can disable transpilation by the following setup:

```json
{
    "presets": [
        [
            "umeboshi",
            {
                "async": false,
                "asyncImport": false
            }
        ]
    ]
}
```

### Custom targets

You can setup `@babel/preset-env` target option by adding a target property on the preset options. Refer to the [official documentation](https://babeljs.io/docs/en/babel-preset-env#targets) for supported values:

```json
{
    "presets": [
        [
            "umeboshi",
            {
                "targets": "> 0.25%, not dead"
            }
        ]
    ]
}
```
