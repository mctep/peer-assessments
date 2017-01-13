import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withUser, IWithUser } from '../hocs/with-user';

class LogoutButton extends React.Component<IWithUser, void> {
	private handleClick = (): void => {
		Meteor.logout();
	}

	public render(): JSX.Element {
		if (!this.props.user) { return null; }

		return (
			<button type="button" onClick={ this.handleClick }>
				Logout
			</button>
		);
	}
}

export default withUser(LogoutButton);
