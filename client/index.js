import 'babel-polyfill';
import 'whatwg-fetch';
import 'normalize.css';

import React from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';
import useRelay from 'react-router-relay';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {
  Router,
  browserHistory,
  applyRouterMiddleware,
} from 'react-router';

import { Routes } from './routes';

/**
 * Needed for onTouchTap
 * Check this repo: https://github.com/zilverline/react-tap-event-plugin
 *
 * */
injectTapEventPlugin();

/**
 * Creating root DOM node to host our React App
 *
 * */
const rootNode = document.createElement('div');
document.body.appendChild(rootNode);

ReactDOM.render(
  <Router
    routes={Routes}
    history={browserHistory}
    render={applyRouterMiddleware(useRelay)}
    environment={Relay.Store}
  />, rootNode);
