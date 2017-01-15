import * as React from 'react';
import { Header } from 'semantic-ui-react';
import { withRouter, IRouter, RouterState } from 'react-router';
import { Meteor } from 'meteor/meteor';
import * as Promise from 'bluebird';

import Logotype from '../../components/logotype';
import CenteredLayout from '../../components/centered-layout';
import LoginForm, { LoginFormData } from '../../forms/login-form';

import { loginWithPassword } from '../../../api/users/methods';
import { AuthRedirectQuery, Location } from '../../hocs/auth-required';

import './style.css';

interface LoginPageProps {
	router: IRouter & RouterState;
	loggingIn: boolean;
}

interface State {
	error?: Meteor.Error;
}

class LoginPage extends React.Component<LoginPageProps, State> {
	constructor(props: LoginPageProps) {
		super(props);

		this.state = { error: null };
	}

	private loggingIn?: Promise<void>;

	private componentWillUnmount(): void {
		if (this.loggingIn) {
			this.loggingIn.cancel();
		}
	}

	private handleFormSubmit = (data: LoginFormData): void => {
		const username: string = data.username;
		const password: string = data.password;

		this.loggingIn = loginWithPassword(data);

		this.loggingIn
		.finally(() => delete this.loggingIn)
		.then(() => {
			const router: IRouter & RouterState = this.props.router;
			const location: Location = router.location;

			const query: AuthRedirectQuery = location.query as AuthRedirectQuery;
			router.replace(query && query.retpath || '/');
		})
		.catch(Meteor.Error, (error: Meteor.Error) => {
			this.setState({
				...this.state,
				error
			});
		});
	}

	public render(): JSX.Element {
		const errorMessage: string = this.state.error ? 'Username or Password is incorrect' : null;

		return (
			<CenteredLayout className="login-page">
				<Header as="h1">
					<Logotype />
				</Header>
				<LoginForm
					onSubmit={ this.handleFormSubmit }
					errorMessage={ errorMessage }
				/>
			</CenteredLayout>
		);
	}
}

export default withRouter(LoginPage);
