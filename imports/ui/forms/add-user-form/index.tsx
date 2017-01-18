import * as React from 'react';
import * as Promise from 'bluebird';
import { Button, Icon } from 'semantic-ui-react';
import AddUserFormModal, { AddUserFormData } from './modal';
import { createNewUser } from '../../../api/users/methods';

interface Props {
	username?: string;
};

interface State {
	modalOpened: boolean;
	userCreating: boolean;
}

export default class AddUserForm extends React.Component<Props, State> {
	private usernameChecking: Promise<void>;
	private userCreating: Promise<string>;

	constructor(props: Props) {
		super(props);

		this.state = {
			modalOpened: false,
			userCreating: false
		};
	}

	private handleModalClose = (): void => {
		this.setState({ ...this.state, modalOpened: false });
	}

	private handleAddUserButtonClick = (): void => {
		this.setState({ ...this.state, modalOpened: true });
	}

	private handleAddUserFormSubmit = (data: AddUserFormData): void => {
		this.setState({
			...this.state,
			userCreating: true
		});

		this.userCreating = createNewUser({
			username: data.username,
			password: data.password,
			profile: {
				fullname: data.fullname
			}
		});

		this.userCreating
		.then(() => {
			this.setState({
				...this.state,
				userCreating: false
			}, this.handleModalClose);
		})
		.finally(() => {
			delete this.userCreating;
		});
	}

	public render(): JSX.Element {
		if (!Roles.userIsInRole(Meteor.user(), 'admin')) { return null; }

		const modal: JSX.Element = this.state.modalOpened ? (
			<AddUserFormModal
				loading={ this.state.userCreating }
				onClose={ this.handleModalClose }
				username={ this.props.username }
				onSubmit={ this.handleAddUserFormSubmit }
			/>
		) : null;

		return (
			<span>
				<Button
					floated="right"
					type="button"
					primary
					onClick={ this.handleAddUserButtonClick }
				>
					<Icon name="add user" />
					Add User
				</Button>
				{ modal }
			</span>
		);
	}
}
