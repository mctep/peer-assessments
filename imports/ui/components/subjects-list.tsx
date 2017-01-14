import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import escapeRegexp = require('escape-string-regexp');

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

class SubjectsList extends React.Component<InProps & SubsProps, void> {
	public componentDidUpdate(): void {
		if (this.props.onListChange) {
			this.props.onListChange(this.props.subjects);
		}
	}

	private renderSubjects(): JSX.Element[] {
		return this.props.subjects.map((subject: Subject): JSX.Element => {
			return (
				<li key={ subject._id }>
					{ subject.name }
				</li>
			);
		});
	}

	public render(): JSX.Element {
		return (
			<ul>
				{ this.renderSubjects() }
			</ul>
		);
	}
}

export default createContainer(subscribe, SubjectsList);
