import path from 'path';
import webpack from 'webpack';

export const vendorList = [
  'react',
  'react-dom',
  'material-ui',
  'react-relay',
  'react-router',
  'react-router-relay',
  'react-tap-event-plugin',
  'redbox-react',
  'react-transform-catch-errors',
  'react-transform-hmr',
  'babel-runtime/core-js',
  'babel-polyfill',
  'whatwg-fetch',
  'lodash',
  'babel-polyfill',
  'dot-object',
];

export default {
  entry: {
    vendor: vendorList
  },
  output: {
    filename: '[name].dll.js',
    path: path.join(__dirname, 'vendor_dll'),
    name: '[name]_[hash]',
    library: '[name]_[hash]'
  },
  module: {
    exprContextRegExp: /$^/,
    exprContextCritical: false,
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
      loader: 'url-loader?limit=10000&name=assets/[hash].[ext]'
    }]
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: path.join(__dirname, 'vendor_dll/[name]-manifest.json')
    })
  ]
};
