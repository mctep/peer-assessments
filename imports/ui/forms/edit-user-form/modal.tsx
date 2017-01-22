import * as React from 'react';
import { Modal, Form, Checkbox, Input, Button } from 'semantic-ui-react';
import { User, getUserFullname } from '../../../api/users';
import PasswordInput from '../../components/password-input';

export interface EditFormUserData {
	password?: string;
	fullname?: string;
	toDelete?: boolean;
}

interface Props {
	user: User;
	loading?: boolean;
	onClose: () => void;
	onSubmit?: (data: EditFormUserData) => void;
}

interface State {
	data: EditFormUserData;
}

export default class EditFormUserModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			data: {
				password: '',
				fullname: getUserFullname(this.props.user),
				toDelete: false
			}
		};
	}

	private componentWillReceiveProps(props: Props, state: State): void {
		if (getUserFullname(this.props.user) !== getUserFullname(props.user)) {
			this.setDataState({ fullname: getUserFullname(props.user) });
		}
	}

	private setDataState(data: EditFormUserData): void {
		this.setState({
			...this.state,
			data: {
				...this.state.data,
				...data
			}
		});
	}

	private handleFormSubmit = (e: React.FormEvent): void => {
		e.preventDefault();
		if (this.props.onSubmit) {
			this.props.onSubmit(this.state.data);
		}
	}

	private handleToDeleteCheckboxChange = (e: React.FormEvent): void => {
		this.setDataState({ toDelete: !this.state.data.toDelete });
	}

	private handlePasswordChange = (password: string): void => {
		this.setDataState({ password });
	}

	private handleFullnameInputChange = (e: React.FormEvent): void => {
		const fullname: string = (e.target as HTMLInputElement).value;
		this.setDataState({ fullname });
	}

	public render(): JSX.Element {
		const submitDisabled: boolean =
			this.props.loading ||
			!this.state.data.toDelete &&
			!this.state.data.password &&
			getUserFullname(this.props.user) === this.state.data.fullname.trim();

		return (
			<Modal
				open
				size="small"
				dimmer="inverted"
				onClose={ this.props.onClose }
			>
				<Modal.Header>
					Edit User { this.props.user.username }
				</Modal.Header>
				<Modal.Content>
					<Form onSubmit={ this.handleFormSubmit } loading={ this.props.loading }>
						<Form.Field>
							<Checkbox
								name="toDelete"
								label="Delete user"
								checked={ this.state.data.toDelete }
								onChange={ this.handleToDeleteCheckboxChange }
							/>
						</Form.Field>
						<Form.Field>
							<label disabled={ this.state.data.toDelete }>Password</label>
							<PasswordInput
								disabled={ this.state.data.toDelete }
								onChange={ this.handlePasswordChange }
							/>
						</Form.Field>
						<Form.Field>
							<label disabled={ this.state.data.toDelete }>Fullname</label>
							<Input
								name="fullname"
								disabled={ this.state.data.toDelete }
								type="text"
								value={ this.state.data.fullname }
								onChange={ this.handleFullnameInputChange }
							/>
						</Form.Field>
						<button
							type="submit"
							style={{ display: 'none' }}
							disabled={ submitDisabled }
						/>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button
						primary
						onClick={ this.handleFormSubmit }
						disabled={ submitDisabled }
					>
						Save
					</Button>
					<Button onClick={ this.props.onClose }>Cancel</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}
