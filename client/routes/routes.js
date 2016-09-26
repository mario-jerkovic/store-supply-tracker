import React from 'react';
import {
  Route,
  Redirect,
  IndexRoute,
} from 'react-router';

import viewerQuery from './viewerQuery';
import { AppComponent } from '../views/App';
import { ViewContainer } from '../views/View';
import { ArticlesContainer } from '../views/Articles';
import { ReceiptsContainer } from '../views/Receipts';

export default (
  <Route getComponent={(nextState, cb) => cb(null, AppComponent)}>
    <Route
      path="/"
      queries={viewerQuery}
      getComponent={(nextState, cb) => cb(null, ViewContainer)}
    >
      <IndexRoute
        queries={viewerQuery}
        getComponent={(nextState, cb) => cb(null, ArticlesContainer)}
      />
      <Route
        path="/receipts"
        queries={viewerQuery}
        getComponent={(nextState, cb) => cb(null, ReceiptsContainer)}
      />
      <Redirect from="*" to="/" />
    </Route>
  </Route>
);
