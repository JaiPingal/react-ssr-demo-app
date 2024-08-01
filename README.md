### SSR React Template App

This project is a template for a React application with Server-Side Rendering (SSR). It sets up a basic structure for an SSR app using React and Express.
### Table of Contents

1. [Project Setup](#project-setup)
2. [Installation and Configuration](#installation-and-configuration)
3. [Creating an Express Server and Rendering the App Component](#creating-an-express-server-and-rendering-the-app-component)
4. [Configuring webpack, Babel](#configuring-webpack-babel)
5. [Add scripts](#add-scripts)
6. [Project Structure](#project-structure)
7. [Learning Points](#learning-points)

### Features

- **Server-Side Rendering**: Initial HTML is rendered on the server for faster load times and better SEO.
- **React**: Front-end library for building user interfaces.
- **Express**: Node.js framework used for server-side rendering.

### Project Setup 

**Create React App with setup**

This project was bootstrapped with Create React App.

-OR-

```base
$ npx create-react-ssr-demo-app
$ cd react-ssr-demo-app
$ npm start
```
* create a new Home.js component in src

```js

function Home(props) {
  return <h1>Hello {props.greet}!</h1>;
};

export default Home;
```
* Next render the Home in the App component. 
Open the App.js file in the src directory and replace the existing lines of code with these new lines of code:

```js
import Home from './Home';

function App() {
  return <Home greet="Server side rendering..."/>;
}

export default App;
```

### Installation and Configuration
* install the all dependencies:

```base
$ npm install express
$ npm install --save-dev webpack webpack-cli webpack-node-externals @babel/core babel-loader @babel/preset-env  @babel/preset-react babel-preset-react-app
```

* Then, replace the contents of the index.js file in src  with the following code:

```js

import React from 'react';
import App from './App';

import { hydrateRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = hydrateRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
```

#### Creating an Express Server and Rendering the App Component

* create a server folder in the root directory  and a file index.js names with the following this

 $${\color{lightblue}server/index.js}$$

 ```js
 import path from 'path';
import fs from 'fs';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';

import App from '../src/App';

const PORT = process.env.PORT || 3006;
const app = express();

// ...

app.get('/', (req, res) => {
    const app = ReactDOMServer.renderToString(<App />);
    const indexFile = path.resolve('./build/index.html');
  
    fs.readFile(indexFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Something went wrong:', err);
        return res.status(500).send('Oops, better luck next time!');
      }
  
      return res.send(
        data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
      );
    });
  });
  
  app.use(express.static('./build'));
  
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
 ```
 ***Three important things are taking place here:***

* Express is used to serve contents from the build directory as static files.
* ReactDOMServer’s renderToString is used to render the app to a static HTML string.
* The static index.html file from the built client app is read. The app’s static content is injected into the <div> with an id of "root".This is sent as a response to the request.

#### Configuring webpack, Babel
* Next, create a new Babel configuration file in the project’s root directory: '.babelrc.json' Then, add the env and react-app presets:

```json
{
    "presets": [
      "@babel/preset-env",
      ["@babel/preset-react", {"runtime": "automatic"}]
    ]
  }

```
* Now, create a webpack config for the server that uses Babel Loader to transpile the code. Start by creating the webpack.server.js file in the project’s root directory:

```js
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './server/index.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve('server-build'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
};
```
With this configuration, the transpiled server bundle will be output to the server-build folder in a file called index.js.

Note the use of target: 'node' and externals: [nodeExternals()] from webpack-node-externals, which will omit the files from node_modules in the bundle; the server can access these files directly.

#### Add scripts
Now, revisit package.json and add helper npm scripts:

```json
"scripts": {
  "dev:build-server": "NODE_ENV=development webpack --config webpack.server.js --mode=development -w",
  "dev:start": "nodemon ./server-build/index.js",
  "dev": "npm-run-all --parallel build dev:*",
  // ...
},
```
* The dev:build-server script sets the environment to "development" and invokes webpack with the configuration file you created earlier. The dev:start script invokes nodemon to serve the built output.

* The dev script invokes npm-run-all to run in parallel the build script and all scripts that start with dev:* - including dev:build-server and dev:start.

* Note: You do not need to modify the existing "start", "build", "test", and "eject" scripts in the package.json file.

* nodemon is used to restart the server when changes are made. npm-run-all is used to run multiple commands in parallel.

***Let’s install those packages now by entering the following commands in your terminal window:***

```base
$ npm install nodemon --save-dev
$ npm install npm-run-all --save-dev
```
* With this in place, you can run the following to build the client-side app, bundle and transpile the server code, and start up the server on :3006:
```base
$ npm run dev
```
$${\color{black}Note}$$ The server webpack config will now watch for changes and the server will restart on changes. For the client app, however, will require to be manually rebuilt each time a change is made.


### Project Structure

ssr-react-template-app

├── public

│   └── index.html       # Template HTML file

├── src

│   ├── components       # React components

│   ├── App.js           # Main App component

│   ├── index.js         # Client-side entry point

├── server

│   ├── server.js        # Express server for SSR

├── package.json         # Project metadata and scripts

└── README.md            # Project documentation

### Learning Points


### What is SSR?

SSR, or Server-Side Rendering, is a technique used in web development where the HTML for a web page is generated on the server and sent to the client, rather than being rendered by the browser using JavaScript on the client side. In the context of React, this means that the React components are rendered on the server and the resulting HTML is sent to the client.

### How SSR Works in React

1. **Initial Request**: When a user requests a page, the server receives the request.
2. **Render on Server**: The server runs the React application to generate the HTML for the requested page. This involves rendering the React components to a string using a method like `ReactDOMServer.renderToString()`.
3. **Send HTML to Client**: The server sends the fully rendered HTML page to the client.
4. **Hydration**: Once the HTML is loaded in the browser, React takes over the static content and makes it interactive by "hydrating" the HTML with JavaScript. This involves attaching event listeners and making the page dynamic.

### Benefits of SSR

- **Improved Performance**: The initial load time is faster because the browser can display the HTML immediately without waiting for JavaScript to load and execute.
- **SEO Benefits**: Search engines can easily crawl and index the fully rendered HTML content, which can improve the site's visibility in search engine results.
- **Better User Experience**: Users see the content more quickly, which can reduce bounce rates and improve overall user satisfaction.
