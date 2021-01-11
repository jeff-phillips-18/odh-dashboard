const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '4000';
const RELATIVE_DIRNAME = process.env.RELATIVE_DIRNAME;
const SRC_DIR = process.env.SRC_DIR;
const DIST_DIR = process.env.DIST_DIR;

module.exports = merge(
  {
    plugins: [
      new Dotenv({
        path: path.resolve(RELATIVE_DIRNAME, '.env.development.local'),
        systemvars: true,
        silent: true
      }),
      new Dotenv({
        path: path.resolve(RELATIVE_DIRNAME, '.env.development'),
        systemvars: true,
        silent: true
      })
    ]
  },
  common('development'),
  {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
      contentBase: DIST_DIR,
      host: HOST,
      port: PORT,
      compress: true,
      inline: true,
      historyApiFallback: true,
      hot: true,
      overlay: true,
      open: true
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          include: [
            SRC_DIR,
            path.resolve(RELATIVE_DIRNAME, 'node_modules/patternfly'),
            path.resolve(RELATIVE_DIRNAME, 'node_modules/@patternfly/patternfly'),
            path.resolve(RELATIVE_DIRNAME, 'node_modules/@patternfly/react-styles/css'),
            path.resolve(RELATIVE_DIRNAME, 'node_modules/@patternfly/react-core/dist/styles/base.css'),
            path.resolve(RELATIVE_DIRNAME, 'node_modules/@patternfly/react-core/dist/esm/@patternfly/patternfly'),
            path.resolve(
              RELATIVE_DIRNAME,
              'node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css'
            ),
            path.resolve(
              RELATIVE_DIRNAME,
              'node_modules/@patternfly/react-table/node_modules/@patternfly/react-styles/css'
            ),
            path.resolve(
              RELATIVE_DIRNAME,
              'node_modules/@patternfly/react-inline-edit-extension/node_modules/@patternfly/react-styles/css'
            )
          ],
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  }
);
