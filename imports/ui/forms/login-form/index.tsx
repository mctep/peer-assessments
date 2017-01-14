import * as React from 'react';
import { Segment, Input, Form } from 'semantic-ui-react';

import './style.css';

export interface LoginFormData {
	username: string;
	password: string;
}

export interface LoginFormProps {
	onSubmit: (data: LoginFormData) => void;
}

export default class LoginForm extends React.Component<LoginFormProps, LoginFormData> {
	constructor(props: LoginFormProps) {
		super (props);

		this.state = {
			username: '',
			password: ''
		};
	}

	private handleFormSubmit = (e: React.FormEvent): void => {
		e.preventDefault();

		this.props.onSubmit(this.state);
	}

	private handleUsernameChange = (e: React.FormEvent): void => {
		const username: string = (e.target as HTMLInputElement).value;
		this.setState({ ...this.state, username });
	}

	private handlePasswordChange = (e: React.FormEvent): void => {
		const password: string = (e.target as HTMLInputElement).value;
		this.setState({ ...this.state, password });
	}

	public render(): JSX.Element {
		const submitDisabled: boolean = !this.state.password || !this.state.username;

		return (
			<Segment>
				<Form onSubmit={ this.handleFormSubmit }>
					<Form.Input
						fluid
						placeholder="Username"
						icon="user"
						iconPosition="left"
						type="text"
						name="username"
						value={ this.state.username }
						onChange={ this.handleUsernameChange }
					/>
					<Form.Input
						fluid
						icon="lock"
						iconPosition="left"
						placeholder="Password"
						type="password"
						name="password"
						value={ this.state.password }
						onChange={ this.handlePasswordChange }
					/>

					<Form.Button
						type="submit"
						color="blue"
						className="login-form__submit-button"
						disabled={ submitDisabled }
					>
						Login
					</Form.Button>
				</Form>
			</Segment>
		);
	}
}
