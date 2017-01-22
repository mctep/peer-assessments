import * as React from 'react';
import * as Promise from 'bluebird';
import { Meteor } from 'meteor/meteor';
import { Button } from 'semantic-ui-react';
import { User } from '../../../api/users';
import EditUserFormModal, { EditFormUserData } from './modal';
import { updateUser } from '../../../api/users/methods';

interface Props {
	user: User;
}

interface State {
	loading: boolean;
	modalOpened: boolean;
};

export default class EditUserForm extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			loading: false,
			modalOpened: false
		};
	}

	private userUpdating: Promise<void>;

	private componentWillUnmount(): void {
		if (this.userUpdating) {
			this.userUpdating.cancel();
		}
	}

	private handleModalClose = (): void => {
		this.setState({
			...this.state,
			modalOpened: false
		});
	}

	private handleOpenModalButtonClick = (): void => {
		this.setState({
			...this.state,
			modalOpened: true
		});
	}

	private handleEditFormSubmit = (data: EditFormUserData): void => {
		this.setState({
			...this.state,
			loading: true
		});

		this.userUpdating = updateUser({
			...data,
			id: this.props.user._id
		});

		this.userUpdating
		.then(() => {
			this.setState({
				...this.state,
				loading: false,
				modalOpened: false
			});
		})
		.finally(() => {
			delete this.userUpdating;
		});
	}

	public render(): JSX.Element {
		if (!Roles.userIsInRole(Meteor.user(), 'admin')) { return null; }

		const modal: JSX.Element = this.state.modalOpened ? (
			<EditUserFormModal
				loading={ this.state.loading }
				user={ this.props.user }
				onClose={ this.handleModalClose }
				onSubmit={ this.handleEditFormSubmit }
			/>
		) : null;

		return (
			<span>
				<Button
					basic
					type="button"
					color="orange"
					onClick={ this.handleOpenModalButtonClick }
				>
					Edit
				</Button>
				{ modal }
			</span>
		);
	}
}
