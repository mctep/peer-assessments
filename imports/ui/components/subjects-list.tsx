import * as React from 'react';
import { Card, Button } from 'semantic-ui-react';
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
				<Card key={ subject._id }>
					<Card.Content>
						<Card.Header>
							{ subject.name }
							<Button
								floated="right"
								size="mini"
								basic
								color="red"
							>
								Remove
							</Button>
						</Card.Header>
					</Card.Content>
				</Card>
			);
		});
	}

	public render(): JSX.Element {
		return (
			<Card.Group>
				{ this.renderSubjects() }
			</Card.Group>
		);
	}
}

export default createContainer(subscribe, SubjectsList);
