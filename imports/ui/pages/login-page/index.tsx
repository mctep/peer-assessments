import * as React from 'react';
import { Header, Grid } from 'semantic-ui-react';
import { withRouter, IRouter, RouterState } from 'react-router';
import { Meteor } from 'meteor/meteor';
import * as Promise from 'bluebird';

import Logotype from '../../components/logotype';
import LoginForm, { LoginFormData } from '../../forms/login-form';

import { createAndLoginUser } from '../../../api/users/methods';
import { AuthRedirectQuery, Location } from '../../hocs/auth-required';

import './style.css';

interface LoginPageProps {
	router: IRouter & RouterState;
	loggingIn: boolean;
}

class LoginPage extends React.Component<LoginPageProps, void> {
	private loggingIn?: Promise<void>;

	private componentWillUnmount(): void {
		if (this.loggingIn) {
			this.loggingIn.cancel();
		}
	}

	private handleFormSubmit = (data: LoginFormData): void => {
		const username: string = data.username;
		const password: string = data.password;

		this.loggingIn = createAndLoginUser(data);

		this.loggingIn
		.finally(() => delete this.loggingIn)
		.then(() => {
			const router: IRouter & RouterState = this.props.router;
			const location: Location = router.location;

			const query: AuthRedirectQuery = location.query as AuthRedirectQuery;
			router.replace(query && query.retpath || '/');
		})
		.catch(Meteor.Error, (error: Meteor.Error) => {
			console.log(error);
		});
	}

	public render(): JSX.Element {
		return (
			<Grid className="login-page" textAlign="center" verticalAlign="middle">
				<Grid.Column className="login-page__form-container">
					<Header as="h1">
						<Logotype />
					</Header>
					<LoginForm onSubmit={ this.handleFormSubmit } />
				</Grid.Column>
			</Grid>
		);
	}
}

export default withRouter(LoginPage);
