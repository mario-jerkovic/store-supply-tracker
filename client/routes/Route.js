import React from 'react';
import {
	Route,
	Redirect,
	IndexRoute,
} from 'react-router';

import ViewerQuery from './ViewerQuery';
import { AppComponent } from '../views/App';
import { HomeContainer } from '../views/Home';
import { ViewContainer } from '../views/View';

export default (
	<Route component={AppComponent}>
		<Route path='/' component={ViewContainer} queries={ViewerQuery}>
			<IndexRoute component={HomeContainer} queries={ViewerQuery} />
			<Redirect from='*' to='/' />
		</Route>
	</Route>
);