import { RedirectFunction } from 'react-router';

interface Location {
	pathname?: string;
	search?: string;
	hash?: string;
	query?: {
		retpath?: string
	};
}

export function redirectIfUnauth(location: Location, replace: RedirectFunction) {
	if (Meteor.loggingIn() || Meteor.userId()) { return; }

	const query: { retpath?: string } = {};
	const { pathname, search, hash } = location;
	const retpath = [pathname, search, hash].filter(Boolean).join('');

	if (retpath && retpath !== '/') { query.retpath = retpath; };

	replace({ pathname: '/login', query });
}

export function redirectToRetpath(location: Location, replace: RedirectFunction) {
	replace(location.query && location.query.retpath || '/');
}
