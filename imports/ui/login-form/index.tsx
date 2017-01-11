import * as React from 'react';

export interface LoginFormData {
	email: string;
	password: string;
}

export interface LoginFormProps {
	onSubmit(data: LoginFormData): void;
}

export default class LoginForm extends React.Component<LoginFormProps, LoginFormData> {
	constructor(props) {
		super (props);

		this.state = {
			email: '',
			password: ''
		};

		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	handleFormSubmit(e: React.SyntheticEvent) {
		e.preventDefault();

		this.props.onSubmit(this.state);
	}

	handleEmailChange(e: React.FormEvent) {
		const email = (e.target as HTMLInputElement).value;
		this.setState({ ...this.state, email });
	}

	handlePasswordChange(e: React.FormEvent) {
		const password = (e.target as HTMLInputElement).value;
		this.setState({ ...this.state, password });
	}

	render() {
		return (
			<form onSubmit={ this.handleFormSubmit }>
				<div>
					<input
						type="text"
						name="email"
						value={ this.state.email }
						onChange={ this.handleEmailChange }
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
