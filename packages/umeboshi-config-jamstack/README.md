# umeboshi-config-jamstack

> Umeboshi config to render JAMstack-like websites

## Install

With [npm](https://www.npmjs.com):

```sh
npm install --save-dev umeboshi-config-jamstack
```

Or [yarn](https://yarnpkg.com):

```sh
yarn add umeboshi-config-jamstack -D
```

## Usage

Add the config to `umeboshi.config.js` file in your project's root folder.

Note: add the config **after** all other configurations!

```js
module.exports = {
    extends: {
        'umeboshi-config': {},
        // ... other configurations...
        'umeboshi-config-jamstack': {}
    }
};
```

## Configuration options

* `port`: Port at which the server-side rendering server will run. Defaults to `9000`. If the port is unavailable it will search the next available port. 

```js
module.exports = {
    extends: {
        'umeboshi-config': {},
        // ... other configurations...
        'umeboshi-config-jamstack': {
            //listen on port 8080
            port: 8080
        }
    }
};
```

## Usage

In some scenarios you would want your application to work differently whether you're rendering in the client or on the server. 

To that end, the config exposes a global `__SERVER__` variable which is `true` on server and `false` on the client.

### Eslint configuration

To prevent _undefined variable_ error in Eslint just add the following lines to your project's `eslintrc.json` file

```json
{
    "globals": {
        "__SERVER__": true
    }
}
```