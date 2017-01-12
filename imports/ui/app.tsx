import * as React from 'react';

import {
	Router,
	Route,
	IndexRoute,
	RouterState,
	RedirectFunction,
	browserHistory
} from 'react-router';

import { redirectIfUnauth } from '../lib/router';

import IndexPage from './pages/index-page';
import UsersPage from './pages/users-page';
import LoginPage from './pages/login-page';

function requireAuth(nextState: RouterState, replace: RedirectFunction) {
	redirectIfUnauth(nextState.location, replace);
}

export default class App extends React.Component<{}, {}> {
	render() {
		return (
			<Router history={ browserHistory }>
				<Route path="/" onEnter={ requireAuth }>
					<IndexRoute component={ IndexPage } />
					<Route path="/users" component={ UsersPage } />
				</Route>
				<Route path="/login" component={ LoginPage } />
			</Router>
		);
	}
}
