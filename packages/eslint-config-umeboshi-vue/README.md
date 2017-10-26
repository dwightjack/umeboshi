# eslint-config-umeboshi-vue

> Shared config for Umeboshi Vue.js templates based on [eslint-config-airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) and [eslint-config-umeboshi](https://github.com/dwightjack/umeboshi/tree/master/packages/eslint-config-umeboshi)

This package exposes two separate configurations:

* `eslint-config-umeboshi-vue`: Enables `.vue` files parsing with [`eslint-plugin-html`](https://github.com/BenoitZugmeyer/eslint-plugin-html)
* `eslint-config-umeboshi-vue/beta`: Leverages [`eslint-plugin-vue`](https://github.com/vuejs/eslint-plugin-vue) for advanced parsing and linting of both `<script>` and `<template>` blocks in `.vue` files. Kept in beta as the plugin itself is in beta stage.

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

Add `"extends": "eslint-config-umeboshi-vue"` or `"extends": "eslint-config-umeboshi-vue/beta"` to your `.eslintrc.json` file