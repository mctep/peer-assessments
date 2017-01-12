import * as React from 'react';
import { Meteor } from 'meteor/meteor';

export default class LogoutButton extends React.Component<{}, {}> {
	handleClick = () => {
		Meteor.logout();
	}

	render() {
		return (
			<button type="button" onClick={ this.handleClick }>
				Logout
			</button>
		);
	}
}

