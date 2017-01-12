import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { IRouter, RouterState, withRouter } from 'react-router';
import { redirectIfUnauth } from '../lib/router';

interface Props {
	router: IRouter & RouterState;
}

class LogoutButton extends React.Component<Props, {}> {
	handleClick = () => {
		const { router } = this.props;
		Meteor.logout(() => {
			redirectIfUnauth(router.location, router.replace);
		});

	}

	render() {
		return (
			<button type="button" onClick={ this.handleClick }>
				Logout
			</button>
		);
	}
}

export default withRouter<{}>(LogoutButton);
