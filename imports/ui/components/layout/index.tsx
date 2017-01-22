import * as React from 'react';
import { Menu, MenuItemProps, Container } from 'semantic-ui-react';
import { Link, IndexLink } from 'react-router';
import { withUser, IWithUser } from '../../hocs/with-user';
import { User } from '../../../api/users';
import Logotype from '../../components/logotype';

import './style.css';

function wrapLink(to: string, link?: typeof Link): (props: MenuItemProps) => JSX.Element {
	const Component: typeof Link = link || Link;
	return (props: MenuItemProps): JSX.Element => (
		<Component to={ to } className={ props.className } activeClassName="active">
			{ props.children }
		</Component>
	);
}

class Layout extends React.Component<IWithUser, void> {
	private static renderAdminMenu(): JSX.Element[] {
		return [
			<Menu.Item key="subjects" as={ wrapLink('/subjects') }>
				Subjects
			</Menu.Item>
		];
	}

	private static renderUserMenu(): JSX.Element[] {
		return null;
	}

	private renderMenu(): JSX.Element[] {
		const user: User = this.props.user;

		if (!user) { return null; }

		if (Roles.userIsInRole(user, 'admin')) {
			return Layout.renderAdminMenu();
		}

		return Layout.renderUserMenu();
	}

	private renderRightMenu(): JSX.Element {
		const user: User = this.props.user;

		if (!user) { return null; }

		return (
			<Menu.Menu position="right">
				<Menu.Item>
					{ 'Hello\u00a0' }
					<b>{ user.username }</b>!
				</Menu.Item>
				<Menu.Item onClick={ (): void => Meteor.logout() }>
					Logout
				</Menu.Item>
			</Menu.Menu>
		);
	}

	public render(): JSX.Element {
		return (
			<div>
				<Menu fluid>
					<Container>
						<Menu.Item header as={ wrapLink('/', IndexLink) }>
							<Logotype className="layout__logotype" />
						</Menu.Item>
						{ this.renderMenu() }
						{ this.renderRightMenu() }
					</Container>
				</Menu>

				<Container>{ this.props.children }</Container>
			</div>
		);
	}
}

export default withUser(Layout);
