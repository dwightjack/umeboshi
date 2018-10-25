# umeboshi-jamstack-react

Helper package to render React components as static HTML.

## Installation

```
npm install umeboshi-jamstack-react --save
```

or

```
yarn add umeboshi-jamstack-react
```

## Usage

Suppose we have the following structure:

```
|- components
|- pages
|  |- index.js <-- rendered on http://localhost:8000/
|  |- about.js <-- rendered on http://localhost:8000/about/
|- app.js
```

Let's create a `ssr.js` file alongside `app.js`:

```js
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

export { render };
```

## Importing Styles

Loading a component on the server-side will no import its CSS. In order to ensure we are loading every style needed on the page we can add the following lines to `app.js`:

```js
import { importStyles } from 'umeboshi-jamstack-react';

const ctx = require.context('@/components/', true, /\.s?css$/);

importStyles(ctx)(ctx.keys());
```
