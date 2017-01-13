import * as React from 'react';

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
