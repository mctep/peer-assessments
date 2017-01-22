import * as React from 'react';
import { List } from 'semantic-ui-react';
import { Subject } from '../../../api/subjects';
import SubjectComponent from '../subject';

import './style.css';

interface Props {
	subjects: Subject[];

	selected?: Subject[];
	removable?: boolean;
	selectable?: boolean;

	onSelect?: (subject: Subject, selected: boolean) => void;
	onRemove?: (subject: Subject) => void;
}

export default class SubjectsList extends React.Component<Props, void> {
	private isSubjectSelected(subject: Subject): boolean {
		const selected: Subject[] = this.props.selected || [];
		return selected.indexOf(subject) !== -1;
	}

	private handleSubjectCheckboxChange = (e: React.FormEvent): void => {
		if (!this.props.onSelect) { return; }

		const element: HTMLInputElement = (e.target as HTMLInputElement);
		const subject: Subject = this.props.subjects.find((subj: Subject) => subj._id === element.value);

		if (!subject) { return; }

		this.props.onSelect(subject, element.checked);
	}

	private renderCheckbox(subject: Subject): JSX.Element {
		if (!this.props.selectable) { return null; }

		return (
			<input
				value={ subject._id }
				type="checkbox"
				className="subjects-list__checkbox"
				checked={ this.isSubjectSelected(subject) }
				onChange={ this.handleSubjectCheckboxChange }
			/>
		);
	}

	private renderSubject(subject: Subject): JSX.Element {
		return (
			<List.Item key={ subject._id } as="label" className="subjects-list__item">
				{ this.renderCheckbox(subject) }
				<SubjectComponent
					className="subjects-list__label"
					subject={ subject }
					basic={ !this.isSubjectSelected(subject) }
					color={ this.isSubjectSelected(subject) ? 'blue' : null }
					removable={ this.props.removable }
					onRemoveButtonClick={ this.props.onRemove }
				/>
			</List.Item>
		);
	}

	private renderSubjects = (): JSX.Element[] => {
		return this.props.subjects
		.map((subject: Subject) => this.renderSubject(subject));
	}

	public render(): JSX.Element {
		const subjects: Subject[] = this.props.subjects;

		if (!subjects.length) { return null; }

		return (
			<div className="subjects-list">
				<List
					horizontal
					selection={ this.props.selectable }
				>
					{ this.renderSubjects() }
				</List>
			</div>
		);
	}
}
