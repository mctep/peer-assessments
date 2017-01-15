import * as React from 'react';
import { Card, Checkbox, List } from 'semantic-ui-react';
import * as cn from 'classnames';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Subject, Subjects } from '../../../api/subjects';

import SubjectsList from '.';

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

	private handleSubjectSelectedChange = (subject: Subject, isSelected: boolean): void => {
		const selected: Subject[] = [].concat(this.state.selected);

		if (isSelected) {
			selected.push(subject);
		} else {
			selected.splice(selected.indexOf(subject), 1);
		}

		this.setState({ ...this.state, selected });
	}

	public render(): JSX.Element {
		return (
			<SubjectsList
				subjects={ this.props.subjects }
				selected={ this.state.selected }
				onSelect={ this.handleSubjectSelectedChange }
				selectable
			/>
		);
	}
}
