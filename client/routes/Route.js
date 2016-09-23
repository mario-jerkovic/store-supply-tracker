import React from 'react';
import {
	Route,
	Redirect,
	IndexRoute,
} from 'react-router';

import ViewerQuery from './ViewerQuery';
import { AppContainer } from '../views/App';
import { HomeContainer } from '../views/Home';

export default (
	<Route path='/' component={AppContainer} queries={ViewerQuery}>
		<IndexRoute component={HomeContainer} queries={ViewerQuery} />
		<Redirect from='*' to='/' />
	</Route>
);