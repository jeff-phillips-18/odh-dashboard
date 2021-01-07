const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const rimraf = require('rimraf');

const RELATIVE_DIRNAME = process.env.RELATIVE_DIRNAME;
const SRC_DIR = process.env.SRC_DIR;
const DIST_DIR = process.env.DIST_DIR;

if (process.env.OUTPUT_ONLY !== 'true') {
  console.info(`Cleaning OUTPUT DIR...\n  ${DIST_DIR}\n`);
}

rimraf(DIST_DIR, () => {});

module.exports = merge(common('production'), {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].bundle.css'
    })
  ],
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
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  }
});
