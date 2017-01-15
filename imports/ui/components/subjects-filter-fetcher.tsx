import * as React from 'react';
import { Card, Button } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import escapeRegexp = require('escape-string-regexp');
import SubjectComponent from './subject';

import SubjectList from './subjects-list';
import { Subject, Subjects } from '../../api/subjects';

interface InProps {
	filter?: string;
	onListChange?: (subjects: Subject[]) => void;
}

interface SubsProps {
	subjects: Subject[];
}

function subscribe(props: InProps): SubsProps {
	Meteor.subscribe('subjects');

	const query: { name?: RegExp } = {};

	if (props.filter) {
		query.name = new RegExp(`.*${escapeRegexp(props.filter)}.*`);
	}

	return {
		subjects: Subjects.find(query).fetch()
	};
}

class SubjectsFilterFetcher extends React.Component<InProps & SubsProps, void> {
	public componentDidUpdate(): void {
		if (this.props.onListChange) {
			this.props.onListChange(this.props.subjects);
		}
	}

	public render(): JSX.Element {
		return (
			<SubjectList subjects={ this.props.subjects } removable />
		);
	}
}

export default createContainer(subscribe, SubjectsFilterFetcher);
