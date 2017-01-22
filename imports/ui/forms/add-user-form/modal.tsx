import * as React from 'react';
import * as Promise from 'bluebird';
import { isUsernameExists } from '../../../api/users/methods';

import { Accounts } from 'meteor/accounts-base';

import {
	Modal,
	Form,
	Button,
	Icon,
	Input,
	Message
} from 'semantic-ui-react';

import PasswordInput from '../../components/password-input';

export interface AddUserFormData {
	username: string;
	password: string;
	fullname: string;
}

interface State {
	data: AddUserFormData;
	usernameExists: boolean;
	usernameChecking: boolean;
}

interface Props {
	onClose: () => void;
	username?: string;
	onSubmit?: (data: AddUserFormData) => void;
	loading?: boolean;
}

export default class AddUserFormModal extends React.Component<Props, State> {
	private usernameChecking: Promise<boolean>;

	constructor(props: Props) {
		super(props);

		this.state = {
			data: {
				username: this.props.username || '',
				password: '',
				fullname: ''
			},
			usernameExists: false,
			usernameChecking: false
		};
	}

	private componentDidMount(): void {
		this.checkUsername();
	}

	private componentWillUnmount(): void {
		if (this.usernameChecking) {
			this.usernameChecking.cancel();
		}
	}

	private componentDidUpdate(props: Props, state: State): void {
		if (this.state.data.username !== state.data.username) {
			this.checkUsername();
		}
	}

	private checkUsername(): void {
		if (this.usernameChecking) {
			this.usernameChecking.cancel();
		}

		if (!this.state.data.username) {
			this.setState({ ...this.state, usernameExists: false });
			return;
		}

		this.setState({ ...this.state, usernameChecking: true });
		this.usernameChecking = isUsernameExists(this.state.data.username);

		this.usernameChecking.then((usernameExists: boolean) => {
			this.setState({
				...this.state,
				usernameChecking: false,
				usernameExists
			});
		})
		.finally(() => {
			delete this.usernameChecking;
		});
	}

	private handleFormSubmit = (e: React.FormEvent): void => {
		e.preventDefault();
		if (this.props.onSubmit) {
			this.props.onSubmit(this.state.data);
		}
	}

	private handleInputChange = (e: React.FormEvent): void => {
		const element: HTMLInputElement = (e.target as HTMLInputElement);
		const name: string = element.name;
		const value: string = element.value;
		this.setState({
			...this.state,
			data: {
				...this.state.data,
				[name]: value
			}
		});
	}

	private handlePasswordChange = (password: string): void => {
		this.setState({
			...this.state,
			data: {
				...this.state.data,
				password
			}
		});
	}

	private renderUsernameInput(): JSX.Element {
		const message: JSX.Element = this.state.usernameExists ? (
			<Message warning>
				This user exists
			</Message>
		) : null;

		return (
			<Form.Field>
				<label>Username / Login</label>
				<Input
					type="text"
					name="username"
					value={ this.state.data.username }
					onChange={ this.handleInputChange }
					loading={ this.state.usernameChecking }
					icon={ this.state.usernameChecking ? 'user' : null }
				/>
				{ message }
			</Form.Field>
		);
	}

	public render(): JSX.Element {
		const submitDisabled: boolean =
			this.state.usernameChecking ||
			this.state.usernameExists ||
			this.props.loading ||
			!this.state.data.username.trim() ||
			!this.state.data.password.trim();

		return (
			<Modal
				open
				size="small"
				dimmer="inverted"
				onClose={ this.props.onClose }
			>
				<Modal.Header>
					Add New User
				</Modal.Header>
				<Modal.Content>
					<Form onSubmit={ this.handleFormSubmit } warning loading={ this.props.loading }>
						{ this.renderUsernameInput() }
						<Form.Field>
							<label>Password</label>
							<PasswordInput onChange={ this.handlePasswordChange } />
						</Form.Field>
						<Form.Field>
							<label>Full Name</label>
							<input
								type="text"
								name="fullname"
								value={ this.state.data.fullname }
								onChange={ this.handleInputChange }
							/>
						</Form.Field>
						<button
							disabled={ submitDisabled }
							type="submit"
							style={{ display: 'none' }}
						/>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button
						primary
						onClick={ this.handleFormSubmit }
						disabled={ submitDisabled }
					>
						<Icon name="add user" />
						Add
					</Button>
					<Button onClick={ this.props.onClose }>Cancel</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}
