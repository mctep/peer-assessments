import * as React from 'react';
import * as Promise from 'bluebird';
import { isUsernameExists } from '../../../api/users/methods';

import { Accounts } from 'meteor/accounts-base';

import {
	Modal,
	Form,
	Button,
	ButtonProps,
	Icon,
	Input,
	Message
} from 'semantic-ui-react';

const ButtonPatched: React.ComponentClass<ButtonProps & { title?: string }> = Button;

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

const PASSWORD_LENGTH_DEFAULT: number = 12;
const PASSWORD_CHARS_DEFAULT: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_!#+/';
function getRandomPassword(
	length: number = PASSWORD_LENGTH_DEFAULT,
	chars: string = PASSWORD_CHARS_DEFAULT
): string {
	let password: string = '';

	while (length > 0) {
		password += chars[Math.ceil(Math.random() * chars.length)];
		length -= 1;
	}

	return password;
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

	private handleGeneratePasswordClick = (): void => {
		this.setState({
			...this.state,
			data: {
				...this.state.data,
				password: getRandomPassword()
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

	private renderPasswordInput(): JSX.Element {
		const action: JSX.Element = (
			<ButtonPatched
				type="button"
				icon="setting"
				title="Genearate Password"
				onClick={ this.handleGeneratePasswordClick }
			/>
		);

		return (
			<Form.Field>
				<label>Password</label>
				<Input
					type="text"
					name="password"
					value={ this.state.data.password }
					onChange={ this.handleInputChange }
					action={ action }
				/>
			</Form.Field>
		);
	}

	public render(): JSX.Element {
		const submitDisabled: boolean =
			this.state.usernameChecking ||
			this.state.usernameExists ||
			this.props.loading;

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
						{ this.renderPasswordInput() }
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
