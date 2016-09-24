/* eslint-disable no-console, no-shadow */
import path from 'path';
import webpack from 'webpack';
import express from 'express';
import httpProxy from 'http-proxy';
import WebpackDevServer from 'webpack-dev-server';
import historyApiFallback from 'connect-history-api-fallback';
import webpackConfig from '../webpack.config';
import config from './config/environment';

const proxy = httpProxy.createProxyServer();

const proxyOptions = [
	{ path: '/graphql', target: `http://localhost:${config.apiPort}/` },
	{ path: '/batch', target: `http://localhost:${config.apiPort}/` }
];

export const startRelayServer = () => {
	if (config.env === 'development') {
		// Launch Relay by using webpack.config.js
		const relayServer = new WebpackDevServer(webpack(webpackConfig), {
			publicPath: webpackConfig.output.publicPath,
			proxy: proxyOptions,
			stats: {
				// Set assets to true for more detailed build log in console
				// Keep everything else as it is
				assets: false,
				colors: true,
				version: true,
				hash: true,
				timings: true,
				chunks: false,
				chunkModules: true
			},
			quiet: false,
			noInfo: false,
			hot: true,
			historyApiFallback: true
		});

		// Serve static resources
		relayServer.use('/', express.static(path.join(__dirname, '../build')));

		// Skip rest of code and return webpack development server instance
		return relayServer;
	}

	// Launch Relay by creating a normal express server
	const relayServer = express();
	relayServer.use(historyApiFallback());
	relayServer.use('/', express.static(path.join(__dirname, '../build')));

	// Set proxy to to real graphql server instance
	proxyOptions.forEach((proxyOption) => {
		relayServer.all(proxyOption.path, (req, res, next) => {
			proxy.web(req, res, proxyOption, (err) => {
				const msg = "cannot proxy to " + proxyOption.target + " (" + err.message + ")";
				res.statusCode = 502;
				res.end(msg);
			});
		});
	});

	// Return server instance
	return relayServer;
};