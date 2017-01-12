import * as React from 'react';
import { Link, IndexLink } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { User } from '../api/users';
import LogoutButton from './logout-button';

interface SubsProps {
	user: User;
}

function subscriptions(): SubsProps {
	return {
		user: Meteor.user() as User
	};
}

class Layout extends React.Component<SubsProps, {}> {
	static renderAdminMenu(): JSX.Element {
		return (
			<ul>
				<li><Link to="/users">Users</Link></li>
			</ul>
		);
	}

	static renderUserMenu(): JSX.Element {
		return (
			<ul>
			</ul>
		);
	}

	renderMenu(): JSX.Element {
		const { user } = this.props;

		if (user.roles.indexOf('admin') !== -1) {
			return Layout.renderAdminMenu();
		}

		return Layout.renderUserMenu();
	}

	render(): JSX.Element {
		return (
			<div>
				<div>
					<IndexLink to="/">Peer Assessment</IndexLink>
					{ this.renderMenu() }
					<LogoutButton />
				</div>
				<div>{ this.props.children }</div>
			</div>
		);
	}
}

export default createContainer(subscriptions, Layout);
