import * as React from 'react';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router';

import authRequired from '../../ui/hocs/auth-required';
import Layout from '../../ui/components/layout';

import IndexPage from '../../ui/pages/index-page';
import UsersPage from '../../ui/pages/users-page';
import LoginPage from '../../ui/pages/login-page';
import SubjectsPage from '../../ui/pages/subjects-page';
import AssessmentUserPage from '../../ui/pages/assessment-user-page';
import NotFoundPage from '../../ui/pages/not-found-page';

export default class Routes extends React.Component<void, void> {
	public render(): JSX.Element {
		return (
			<Router history={ browserHistory }>
				<Route path="/">
					<Route component={ Layout }>
						<IndexRoute component={ authRequired(UsersPage) } />
						<Route path="/assessment/:username" component={ authRequired(AssessmentUserPage) } />
						<Route path="/subjects" component={ authRequired(SubjectsPage, 'admin') } />
					</Route>
				</Route>
				<Route path="/login" component={ LoginPage } />
				<Route path="/page-not-found" component={ NotFoundPage } />
				<Redirect from="*" to="/page-not-found" />
			</Router>
		);
	}
}
