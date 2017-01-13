import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

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
	renderUsers(): JSX.Element[] {
		return this.props.users.map((user) => (
			<li key={ user._id }>
				{ user.username }
			</li>
		));
	}
	render(): JSX.Element {
		return (
			<div>
				{ this.renderUsers() }
			</div>
		);
	}
}

export default createContainer(subscribe, UsersPage);
