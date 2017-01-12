import * as React from 'react';

export interface LoginFormData {
	username: string;
	password: string;
}

export interface LoginFormProps {
	onSubmit: (data: LoginFormData) => void;
}

export default class LoginForm extends React.Component<LoginFormProps, LoginFormData> {
	constructor(props) {
		super (props);

		this.state = {
			username: '',
			password: ''
		};
	}

	handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		this.props.onSubmit(this.state);
	}

	handleUsernameChange = (e: React.FormEvent) => {
		const username = (e.target as HTMLInputElement).value;
		this.setState({ ...this.state, username });
	}

	handlePasswordChange = (e: React.FormEvent) => {
		const password = (e.target as HTMLInputElement).value;
		this.setState({ ...this.state, password });
	}

	render() {
		return (
			<form onSubmit={ this.handleFormSubmit }>
				<div>
					<input
						type="text"
						name="username"
						value={ this.state.username }
						onChange={ this.handleUsernameChange }
					/>
				</div>
				<div>
					<input
						type="password"
						name="password"
						value={ this.state.password }
						onChange={ this.handlePasswordChange }
					/>
				</div>
				<div>
					<button type="submit">Login</button>
				</div>
			</form>
		);
	}
}
