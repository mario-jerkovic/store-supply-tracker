'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	progress: true,
	entry: {
		app: [
			// The script refreshing the browser on none hot updates
			'webpack-dev-server/client?http://localhost:8080',
			'webpack/hot/only-dev-server',
			path.join(__dirname, 'client/index.js')
		]
	},
	output: {
		path: path.join(__dirname, 'vendor_dll'),
		publicPath: '/',
		filename: '[name].js'
	},
	devtool: 'eval-cheap-module-source-map',
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
		// https://webpack.github.io/docs/list-of-plugins.html#2-explicit-vendor-chunk
		new webpack.DllReferencePlugin({
			context: '.',
			manifest: require(path.join(__dirname, 'vendor_dll/vendor-manifest.json'))
		}),
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			title: 'Placeholder',
			template: './client/index.html',
			dll: '/vendor_dll/vendor.dll.js',
			mobile: true,
			inject: false
		})
	]
};
