import * as React from 'react';
import { withRouter, IRouter, RouterState } from 'react-router';
import { Meteor } from 'meteor/meteor';
import * as Promise from 'bluebird';

import LoginForm, { LoginFormData } from '../forms/login-form';

import { Accounts } from 'meteor/accounts-base';

import { Credentials, createAndLoginUser } from '../../api/users';
import { redirectToRetpath } from '../../lib/router';

interface LoginPageProps {
	router: IRouter & RouterState;
	loggingIn: boolean;
}

class LoginPage extends React.Component<LoginPageProps, {}> {
	private loggingIn: Promise<void>;

	componentWillUnmount() {
		if (this.loggingIn) {
			this.loggingIn.cancel();
		}
	}

	handleFormSubmit = (data: LoginFormData): void => {
		const { username, password } = data;

		this.loggingIn = createAndLoginUser(data);

		this.loggingIn
		.finally(() => {
			delete this.loggingIn;
		})
		.then(() => {
			const { router } = this.props;
			redirectToRetpath(router.location, router.replace);
		})
		.catch(Meteor.Error, (error) => {
			console.log(error);
		});
	}

	render() {
		return (
			<div>
				<h1>Login</h1>
				<LoginForm onSubmit={ this.handleFormSubmit } />
			</div>
		);
	}
}

export default withRouter(LoginPage);
