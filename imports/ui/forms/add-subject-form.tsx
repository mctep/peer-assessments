import * as React from 'react';
import { Form, Input, Button } from 'semantic-ui-react';

export interface AddSubjectFormData {
	name: string;
}

interface Props {
	onSubmit?: (data: AddSubjectFormData) => void;
	onChange?: (data: AddSubjectFormData) => void;
	submitDisabled?: boolean;
}

export default class AddSubjectForm extends React.Component<Props, AddSubjectFormData> {
	public state: AddSubjectFormData = {
		name: ''
	};

	private componentDidUpdate(props: Props, state: AddSubjectFormData): void {
		if (this.state.name !== state.name && this.props.onChange) {
			this.props.onChange(this.state);
		}
	}

	private isSubmitDisabled(): boolean {
		return this.props.submitDisabled || !this.state.name;
	}

	private handleSubmit = (e: React.FormEvent): void => {
		e.preventDefault();

		if (this.props.onSubmit) {
			this.props.onSubmit(this.state);
		}
	}

	private handleNameChange = (e: React.FormEvent): void => {
		const name: string = (e.target as HTMLInputElement).value;
		this.setState({ name });
	}

	public render(): JSX.Element {
		return (
			<Form onSubmit={ this.handleSubmit } size="tiny">
				<Input
					type="text"
					name="name"
					value={ this.state.name }
					onChange={ this.handleNameChange }
					action
					placeholder="Subject Name"
				>
					<input />
					<Button
						primary
						disabled={ this.isSubmitDisabled() }
						type="submit"
					>
						Add
					</Button>
				</Input>
			</Form>
		);
	}
}
