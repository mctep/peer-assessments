import * as React from 'react';

import { Subject } from '../../api/subjects';
import { Mark } from '../../api/assessments';
import SubjectComponent from './subject';

interface Props {
	mark: Mark;
	subjects: Subject[];
	disabled?: boolean;
	onAddSelectedSubjectsButtonClick?: (mark: Mark) => void;
	onRemoveSubjectButtonClick?: (mark: Mark, subject: Subject) => void;
}

const titleByMark: {[key: string]: string} = {
	exellent: 'Exellent',
	good: 'Good',
	normal: 'Normal',
	bad: 'Bad'
};

export default class MarkedSubjects extends React.Component<Props, void> {
	private handleAddSelectedSubjectsButtonClick = (): void => {
		if (this.props.onAddSelectedSubjectsButtonClick) {
			this.props.onAddSelectedSubjectsButtonClick(this.props.mark);
		}
	}

	private handleRemoveSubjectClick = (subject: Subject): void => {
		if (this.props.onRemoveSubjectButtonClick) {
			this.props.onRemoveSubjectButtonClick(this.props.mark, subject);
		}
	}

	private renderTitle(): string {
		return titleByMark[this.props.mark];
	}

	private renderAddSelectedSubjectsButton(): JSX.Element {
		return (
			<button
				type="button"
				disabled={ this.props.disabled }
				onClick={ this.handleAddSelectedSubjectsButtonClick }
			>
				Add Selected Subjects
			</button>
		);
	}

	private renderSubjects(): JSX.Element {
		const subjects: JSX.Element[] = this.props.subjects
		.map((subject: Subject) => (
			<li key={ subject._id }>
				<SubjectComponent
					subject={ subject }
					onRemoveButtonClick={ this.handleRemoveSubjectClick }
					removable
				/>
			</li>
		));

		return (
			<ul>
				{ subjects }
			</ul>
		);
	}

	public render(): JSX.Element {
		return (
			<div>
				<label>
					{ this.renderAddSelectedSubjectsButton() }
					{ this.renderTitle() }
				</label>
				{ this.renderSubjects() }
			</div>
		);
	}
}
