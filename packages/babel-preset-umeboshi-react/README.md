# babel-preset-umeboshi-react

> Babel preset for Umeboshi React templates

This preset includes:

-   [babel-preset-umeboshi](https://github.com/dwightjack/umeboshi/tree/master/packages/babel-preset-umeboshi)
-   [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)

In production it will apply the following transforms:

-   [transform-react-remove-prop-types](https://www.npmjs.com/package/babel-plugin-transform-react-remove-prop-types)

## Install

With [npm](https://www.npmjs.com):

```sh
npm install --save-dev babel-preset-umeboshi-react
```

Or [yarn](https://yarnpkg.com):

```sh
yarn add babel-preset-umeboshi-react --dev
```

## Usage

Add the preset to `.babelrc` file in your project's root folder.

```json
{
    "presets": ["umeboshi-react"]
}
```
