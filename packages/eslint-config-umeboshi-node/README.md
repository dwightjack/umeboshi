# eslint-config-umeboshi

> Shared config for Umeboshi templates based on [eslint-config-airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base)

This package exposes two separate configurations:

* `eslint-config-umeboshi`: eslint configuration for browser environment
* `eslint-config-umeboshi/node`: eslint configuration for node environment

**Note**: `eslint-config-umeboshi` will set two global variables: `Modernizr` and `__PRODUCTION__`. 

## Install

With [npm](https://www.npmjs.com):

```sh
npm install --save-dev eslint-config-umeboshi
```

Or [yarn](https://yarnpkg.com):

```sh
yarn add eslint-config-umeboshi --dev
```

## Usage

Add `"extends": "eslint-config-umeboshi"` or `"extends": "eslint-config-umeboshi/node"` to your `.eslintrc.json` file