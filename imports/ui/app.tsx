import * as React from 'react';

import {
	Router,
	Route,
	IndexRoute,
	browserHistory,
	Link,
	Redirect
} from 'react-router';

import authRequired from './hocs/auth-required';

import Layout from './components/layout';
import IndexPage from './pages/index-page';
import UsersPage from './pages/users-page';
import LoginPage from './pages/login-page';
import NotFoundPage from './pages/not-found-page';

export default class App extends React.Component<void, void> {
	public render(): JSX.Element {
		return (
			<Router history={ browserHistory }>
				<Route path="/">
					<Route component={ Layout }>
						<IndexRoute component={ authRequired(IndexPage) } />
						<Route path="/users" component={ authRequired(UsersPage) } />
						<Route path="/subjects" component={ authRequired(UsersPage, 'admin') } />
					</Route>
				</Route>
				<Route path="/login" component={ LoginPage } />
				<Route path="/page-not-found" component={ NotFoundPage } />
				<Redirect from="*" to="/page-not-found" />
			</Router>
		);
	}
}
