# eslint-config-umeboshi-vue

> Shared config for Umeboshi Vue.js templates

This package extends [eslint-config-umeboshi](https://github.com/dwightjack/umeboshi/tree/master/packages/eslint-config-umeboshi) the [`strongly-recommended`](https://github.com/vuejs/eslint-plugin-vue#priority-b-strongly-recommended-improving-readability) preset of [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue) with some minor changes:

* no EOL enforcing
* `.vue` file extension can be omitted
* 4 spaces indentation in templates (`vue/html-indent`)
* `babel-parser` support

## Install

With [npm](https://www.npmjs.com):

```sh
npm install --save-dev eslint-config-umeboshi-vue
```

Or [yarn](https://yarnpkg.com):

```sh
yarn add eslint-config-umeboshi-vue --dev
```

## Usage

Add `"extends": "eslint-config-umeboshi-vue"` to your `.eslintrc.json` file