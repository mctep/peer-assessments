import * as React from 'react';
import { withRouter, IRouter, RouterState } from 'react-router';
import { withUser, IWithUser, ComponentConstructor } from './with-user';
import { Role } from '../../api/users';

import Loader from '../components/loader';

interface Props {
	children: JSX.Element;
}

interface RouterProps {
	router: IRouter & RouterState;
}

export interface AuthRedirectQuery {
	retpath?: string;
}

function redirectToLogin(router): void {
	const query: AuthRedirectQuery = {};
	const { location } = router;
	const { pathname, search, hash } = location;
	const retpath = [pathname, search, hash].filter(Boolean).join('');

	if (retpath && retpath !== '/') { query.retpath = retpath; };

	router.replace({ pathname: '/login', query });
}

function redirectToNotFound(router): void {
	router.replace('/page-not-found');
}

export default function authRequired(Comp: ComponentConstructor<any>, ...roles: Role[]): ComponentConstructor<any> {
	/**
	 * Component that checks user loading and make redirect to login if neccessary.
	 * We cannot use Route.onEnter hook cause it is not reactive
	 * so we use meteor container.
	 */
	class AuthRequired extends React.Component<Props & IWithUser & RouterProps, {}> {
		private static redirect(props: IWithUser & RouterProps): void {
			const { loggingIn, user, router } = props;

			if (loggingIn) { return; }

			if (!user) { return redirectToLogin(router); }

			if (roles.length === 0) { return; }

			if (Roles.userIsInRole(user, roles)) { return; }

			redirectToNotFound(router);
		}

		componentDidMount(): void {
			AuthRequired.redirect(this.props);
		}

		componentWillReceiveProps(props: IWithUser & RouterProps): void {
			AuthRequired.redirect(props);
		}

		render(): JSX.Element {
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

	return withUser(withRouter(AuthRequired));
}
