import * as React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { withRouter, IRouter, RouterState } from 'react-router';

import Loader from './loader';

interface Props {
	children: JSX.Element;
}

interface SubsProps {
	loggingIn: boolean;
	user?: Meteor.User;
}

interface RouterProps {
	router: IRouter & RouterState;
}

function subscriptions(): SubsProps {
	return {
		loggingIn: Meteor.loggingIn(),
		user: Meteor.user()
	};
}

export interface AuthRedirectQuery {
	retpath?: string;
}

/**
 * Component that checks user loading and make redirect to login if neccessary.
 * We cannot use Route.onEnter hook cause it is not reactive
 * so we use meteor container.
 */
class RequiredAuth extends React.Component<Props & SubsProps & RouterProps, {}> {
	private static redirectIfUnauth(props: SubsProps & RouterProps): void {
		const { loggingIn, user, router } = props;

		if (loggingIn || user) { return; }

		const query: AuthRedirectQuery = {};
		const { pathname, search, hash } = location;
		const retpath = [pathname, search, hash].filter(Boolean).join('');

		if (retpath && retpath !== '/') { query.retpath = retpath; };

		router.replace({ pathname: '/login', query });
	}

	componentDidMount() {
		RequiredAuth.redirectIfUnauth(this.props);
	}

	componentWillReceiveProps(props: SubsProps & RouterProps) {
		RequiredAuth.redirectIfUnauth(props);
	}

	render() {
		// no information about user, so just show loader
		if (this.props.loggingIn) {
			return <Loader />;
		}

		// we should not show private components for anonymous users
		if (!this.props.user) {
			return null;
		}

		return this.props.children;
	}
}

export default createContainer(subscriptions, withRouter(RequiredAuth));

