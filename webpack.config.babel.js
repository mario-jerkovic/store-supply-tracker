import path from 'path';
import webpack from 'webpack';
import precss from 'precss';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';

let appEntry, devtool, plugins, outputPath;

if (process.env.NODE_ENV === 'production') {
  appEntry = {
    app: [path.join(__dirname, 'client/index.js')],
    vendor: require('./webpack.config.dll.babel').vendorList,
  };
  outputPath = path.join(__dirname, 'build');
  devtool = 'source-map';
  plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Placeholder',
      template: './client/index.html',
      mobile: true,
      inject: false
    }),
    //new FaviconsWebpackPlugin('./client/assets/logo.png')
  ];
} else {
  appEntry = {
    app: [
      path.join(__dirname, 'client/index.js'),
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server'
    ],
  };
  outputPath = path.join(__dirname, 'vendor_dll');
  devtool = 'eval';
  plugins = [
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require(path.join(__dirname, 'vendor_dll/vendor-manifest.json'))
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true
    }),
    new HtmlWebpackPlugin({
      title: 'Placeholder',
      template: './client/index.html',
      dll: '/vendor_dll/vendor.dll.js',
      mobile: true,
      inject: false
    }),
    //new FaviconsWebpackPlugin('./client/assets/logo.png')
  ];
}

export default {
  progress: true,
  entry: appEntry,
  output: {
    path: outputPath,
    publicPath: '/',
    filename: '[name].js'
  },
  devtool,
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loaders: ['style', 'css']
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
      loader: 'url-loader?limit=10000&name=assets/[hash].[ext]'
    }]
  },
  postcss: () => [precss, autoprefixer],
  plugins
};
