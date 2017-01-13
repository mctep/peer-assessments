import * as React from 'react';
import { Link, IndexLink } from 'react-router';
import { withUser, IWithUser } from '../hocs/with-user';
import Logotype from '../components/logotype';
import LogoutButton from '../components/logout-button';

class Layout extends React.Component<IWithUser, void> {
	static renderAdminMenu(): JSX.Element {
		return (
			<ul>
				<li><Link to="/users">Users</Link></li>
				<li><Link to="/subjects">Subjects</Link></li>
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

		if (!user) { return null; }

		if (Roles.userIsInRole(user, 'admin')) {
			return Layout.renderAdminMenu();
		}

		return Layout.renderUserMenu();
	}

	renderLogoutButton(): JSX.Element {
		const { user } = this.props;

		if (!user) { return null; }

		return <LogoutButton />;
	}

	render(): JSX.Element {
		return (
			<div>
				<div>
					<Logotype />
					{ this.renderMenu() }
					<LogoutButton />
				</div>
				<div>{ this.props.children }</div>
			</div>
		);
	}
}

export default withUser(Layout);
