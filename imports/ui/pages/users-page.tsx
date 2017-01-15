import * as React from 'react';
import { Card } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import wrapLink from '../components/wrap-link';

interface Props {
	users: Meteor.User[];
}

function subscribe(): Props {
	Meteor.subscribe('users');

	return {
		users: Meteor.users.find({}).fetch()
	};
}

class UsersPage extends React.Component<Props, void> {
	private renderUsers(): JSX.Element[] {
		return this.props.users.map((user: Meteor.User) => (
			<Card key={ user._id } as={ wrapLink(`/assessment/${user.username}`) }>
				<Card.Content>
					<Card.Header>
						{ user.username }
					</Card.Header>
				</Card.Content>
			</Card>
		));
	}

	public render(): JSX.Element {
		return (
			<div>
				<Card.Group>
					{ this.renderUsers() }
				</Card.Group>
			</div>
		);
	}
}

export default createContainer(subscribe, UsersPage);
