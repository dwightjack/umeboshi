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

-   `port`: Port at which the server-side rendering server will run. Defaults to `9000`. If the port is unavailable it will search the next available port.

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

### Independent Server and Client apps

```sh
yarn add umeboshi-jamstack-react
```

```js
// app.js
import { importStyles } from 'umeboshi-jamstack-react';
const ctx = require.context('@/components/', true, /\.s?css$/);
importStyles(ctx)(ctx.keys());

// other client-side js here...
```

```js
// ssr.js
import {
    createRender,
    createRouter,
    importPages
} from 'umeboshi-jamstack-react';

// dynamically load all files within the pages folder
const ctx = require.context('@/pages/', true, /\.jsx?$/);

// convert files to a routing structure
const routes = importPages(ctx)(ctx.keys());

// create a router
const router = createRouter(routes);

// create a renderer suitable for umeboshi-config-jamstack
const render = createRender({ router });

export { render, router };
```

### Usage with React Router

```js
// pages/router.js
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from './index';
import Posts from './posts';

const routes = [
    {
        path: '/',
        component: Index
    },
    {
        path: '/posts',
        component: Posts
    }
];

const Router = ({ routes }) => {
    return (
        <Switch>
            {routes.map(({ path, component }) => (
                <Route exact path={path} component={component} />
            ))}
        </Switch>
    );
};

export { Router, routes };
```

```js
// app.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Router, routes } from '@/pages/router';

ReactDOM.hydrate(
    <BrowserRouter>
        <Router routes={routes} />
    </BrowserRouter>,
    document.getElementById('app-root')
);
```

```js
// ssr.js
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Router, routes } from '@/pages/router';

const render = (ctx) => {
    const context = {};
    const html = ReactDOMServer.renderToString(
        <StaticRouter location={ctx.url} context={context}>
            <Router routes={routes} />
        </StaticRouter>
    );

    return Promise.resolve({
        html,
        head: {},
        template: context.template || 'default'
    });
};

const router = {
    routes
};

export { render, router };
```
