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

// Note:- With this configuration, the transpiled server bundle will be output to the server-build folder in a file called index.js.
// Note:-  the use of target: 'node' and externals: [nodeExternals()] from webpack-node-externals, which will omit the files from node_modules in the bundle; the server can access these files directly.
// * This completes the dependency installation and webpack and Babel configuration.
// ** Add dev:build-server, dev:start, and dev scripts to the package.json file to build and serve the SSR application:

//npm install nodemon@2.0.15 --save-dev
//npm install npm-run-all@4.1.5 --save-dev