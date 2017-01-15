import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Header, Divider } from 'semantic-ui-react';

import AddSubjectForm, { AddSubjectFormData } from '../forms/add-subject-form';
import { Subject, Subjects } from '../../api/subjects';
import { insertSubject } from '../../api/subjects/methods';
import SubjectsFilterFetcher from '../components/subjects-filter-fetcher';

interface State {
	newSubjectName?: string;
	createSubjectDisabled: boolean;
}

export default class SubjectsPage extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			createSubjectDisabled: false,
			newSubjectName: ''
		};
	}

	private handleSubjectAdd = (data: AddSubjectFormData): void => {
		// TODO handle errors
		insertSubject(data.name);
	}

	private handleNewSubjectChange = (data: AddSubjectFormData): void => {
		this.setState({ ...this.state, newSubjectName: data.name });
	}

	private handleListChange = (subjects: Subject[]): void => {
		// it's a hack. we should not use fetched data from child components.
		// but it works in the most cases and it is pretty simple
		const isTheSameSubjectExists: boolean = !!subjects.length && subjects.some((subject: Subject): boolean =>
			subject.name === this.state.newSubjectName.trim());

		this.setState({
			...this.state,
			createSubjectDisabled: isTheSameSubjectExists
		});
	}

	public render(): JSX.Element {
		return (
			<div>
				<Header as="h1">Add or Remove Assessment Subjects</Header>
				<AddSubjectForm
					onSubmit={ this.handleSubjectAdd }
					onChange={ this.handleNewSubjectChange }
					submitDisabled={ this.state.createSubjectDisabled }
				/>
				<Divider />
				<SubjectsFilterFetcher
					filter={ this.state.newSubjectName.trim() }
					onListChange={ this.handleListChange }
				/>
			</div>
		);
	}
}
