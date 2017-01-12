import * as React from 'react';

import {
	Router,
	Route,
	IndexRoute,
	browserHistory,
	Link
} from 'react-router';

import RequiredAuth from './required-auth';

import Layout from './layout';
import IndexPage from './pages/index-page';
import UsersPage from './pages/users-page';
import LoginPage from './pages/login-page';

export default class App extends React.Component<{}, {}> {
	render() {
		return (
			<Router history={ browserHistory }>
				<Route path="/" component={ RequiredAuth }>
					<Route component={ Layout }>
						<IndexRoute component={ IndexPage } />
						<Route path="/users" component={ UsersPage } />
					</Route>
				</Route>
				<Route path="/login" component={ LoginPage } />
			</Router>
		);
	}
}
