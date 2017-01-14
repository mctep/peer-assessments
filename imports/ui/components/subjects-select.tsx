import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Subject, Subjects } from '../../api/subjects';

export interface Props {
	subjects: Subject[];
	onChange?: (subjects: Subject[]) => void;
}

interface State {
	selected: Subject[];
}

export default class SubjectSelect extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			selected: []
		};
	}

	public componentDidUpdate(props: Props, state: State): void {
		if (this.props.onChange) {
			const selectedChanged: boolean = this.state.selected !== state.selected;
			const subjectsChanged: boolean = this.props.subjects !== props.subjects;

			if (selectedChanged || subjectsChanged) {
				const selectedVisible: Subject[] = this.state.selected
				.filter((subject: Subject) =>
					this.props.subjects.indexOf(subject) !== -1
				);

				this.props.onChange(selectedVisible);
			}
		}
	}

	private handleSubjectCheckedChange = (e: React.FormEvent): void => {
		const element: HTMLInputElement = (e.target as HTMLInputElement);
		const subject: Subject = this.props.subjects.find((subj: Subject) => subj._id === element.value);

		if (!subject) { return; }

		const selected: Subject[] = [].concat(this.state.selected);

		if (element.checked) {
			selected.push(subject);
		} else {
			selected.splice(selected.indexOf(subject), 1);
		}

		this.setState({ ...this.state, selected });
	}

	private renderSubject(subject: Subject): JSX.Element {
		const checked: boolean = this.state.selected.indexOf(subject) !== -1;

		return (
			<li key={ subject._id }>
				<label>
					<input
						type="checkbox"
						value={ subject._id }
						checked={ checked }
						onChange={ this.handleSubjectCheckedChange }
					/>
					{ subject.name }
				</label>
			</li>
		);
	}

	public render(): JSX.Element {
		const subjects: JSX.Element[] = this.props.subjects
		.map((subject: Subject) => this.renderSubject(subject));

		return (
			<ul>
				{ subjects }
			</ul>
		);
	}
}
