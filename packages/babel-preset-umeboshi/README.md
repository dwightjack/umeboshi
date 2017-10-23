# babel-preset-umeboshi

> Standard Babel preset for Umeboshi templates

This preset includes:

* [babel-preset-env](https://github.com/babel/babel/tree/master/experimental/babel-preset-env) with [`loose=true`](https://github.com/babel/babel/tree/master/experimental/babel-preset-env#modules) and [`useBuiltIns='entry'`](https://github.com/babel/babel/tree/master/experimental/babel-preset-env#usebuiltins) options. Target browsers: `['> 1%', 'last 2 versions', 'not ie < 11']`
* [babel-preset-stage-2](https://github.com/babel/babel/tree/master/packages/babel-preset-stage-2)
* `transform-runtime` plugin excluding polyfill and generator runtime.
* `transform-es2015-modules-commonjs` on test environments (`BABEL_ENV = 'test'` or `NODE_ENV = 'test'`)

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

By default both `async/await` and async `import()` are supported. Anyway in order to support older environments the preset needs to transpile them to generators and include the related runtime. This will result in an increased bundle size.  
If you plan not to use such features, you can disable them with the following setup:

```json
{
  "presets": [
      ["umeboshi", {
          async: false,
          asyncImport: false
    }]
  ]
}
```