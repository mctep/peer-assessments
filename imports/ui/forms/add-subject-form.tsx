import * as React from 'react';

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
			<form onSubmit={ this.handleSubmit }>
				<div>
					<input
						type="text"
						name="name"
						value={ this.state.name }
						onChange={ this.handleNameChange }
					/>
					<button
						disabled={ this.isSubmitDisabled() }
						type="submit"
					>
						Add
					</button>
				</div>
			</form>
		);
	}
}
