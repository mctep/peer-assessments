import * as React from 'react';
import { withRouter, IRouter, RouterState } from 'react-router';
import { withUser, IWithUser, ComponentConstructor } from './with-user';
import { Role, User } from '../../api/users';

import Loader from '../components/loader';

interface Props {
	children: JSX.Element;
}

interface RouterProps {
	router: IRouter & RouterState;
}

export interface Location {
	pathname?: string;
	search?: string;
	hash?: string;
	query?: {};
}

export interface AuthRedirectQuery {
	retpath?: string;
}

function redirectToLogin(router: IRouter & RouterState): void {
	const query: AuthRedirectQuery = {};
	const location: Location = router.location;

	const retpath: string = [
		location.pathname,
		location.search,
		location.hash
	].filter(Boolean).join('');

	if (retpath && retpath !== '/') { query.retpath = retpath; };

	router.replace({ pathname: '/login', query });
}

function redirectToNotFound(router: IRouter): void {
	router.replace('/page-not-found');
}

export default function authRequired(Comp: ComponentConstructor<{}>, ...roles: Role[]): ComponentConstructor<{}> {
	/**
	 * Component that checks user loading and make redirect to login if neccessary.
	 * We cannot use Route.onEnter hook cause it is not reactive
	 * so we use meteor container.
	 */
	class AuthRequired extends React.Component<Props & IWithUser & RouterProps, {}> {
		private static redirect(props: IWithUser & RouterProps): void {
			const loggingIn: boolean = props.loggingIn;
			const user: User = props.user;
			const router: IRouter & RouterState = props.router;

			if (loggingIn) { return; }

			if (!user) { return redirectToLogin(router); }

			if (roles.length === 0) { return; }

			if (Roles.userIsInRole(user, roles)) { return; }

			redirectToNotFound(router);
		}

		private componentDidMount(): void {
			AuthRequired.redirect(this.props);
		}

		private componentWillReceiveProps(props: IWithUser & RouterProps): void {
			AuthRequired.redirect(props);
		}

		public render(): JSX.Element {
			// no information about user, so just show loader
			if (this.props.loggingIn) {
				return <Loader />;
			}

			// we should not show private components for anonymous users
			if (!this.props.user) {
				return null;
			}

			return <Comp />;
		}
	}

	return withUser<{}, IWithUser>(withRouter(AuthRequired));
}
