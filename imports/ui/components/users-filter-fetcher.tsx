import * as React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import escapeRegexp = require('escape-string-regexp');
import { User } from '../../api/users';

interface Props {
	filter?: string;
	onChange?: (users: User[]) => void;
}

interface SubsProps {
	items: User[];
}

function subscribe(props: Props): SubsProps {
	Meteor.subscribe('users');

	const query: { _id: {}, username?: RegExp } = {
		_id: { $ne: Meteor.userId() }
	};

	if (props.filter) {
		query.username = new RegExp(`^.*${escapeRegexp(props.filter)}.*$`, 'i');
	}

	return {
		items: Meteor.users.find(query).fetch()
			.sort((user1: User, user2: User) => {
				if (user1.username > user2.username) { return 1; }
				if (user1.username < user2.username) { return -1; }
				return 0;
			}),
	};
}

class UsersFilterFetcher extends React.Component<Props & SubsProps, void> {
	private componentDidUpdate(): void {
		if (this.props.onChange) {
			this.props.onChange(this.props.items);
		}
	}

	public render(): JSX.Element { return null; }
}

export default createContainer(subscribe, UsersFilterFetcher);
