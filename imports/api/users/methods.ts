import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { Credentials } from '.';

import * as Promise from 'bluebird';
Promise.config({ cancellation: true });

export function loginWithPassword(credentials: Credentials): Promise<void> {
	const username: string = credentials.username;
	const password: string = credentials.password;

	return Promise.promisify<void, string, string>
	(Meteor.loginWithPassword)(username, password);
}

export function createAndLoginUser(credentials: Credentials): Promise<void> {
	const username: string = credentials.username;
	const password: string = credentials.password;

	return new Promise<void>((resolve: () => void, reject: () => void, onCancel: (cb: () => void) => void): void => {
		let canceled: boolean;
		canceled = false;

		onCancel(() => { canceled = true; });

		Promise.promisify<boolean, string, string>
		(Meteor.call)('accounts.isUsernameExists', credentials.username)
		.then((exists: boolean) => {
			if (canceled) { return; }
			if (exists) { return; }

			return Promise.promisify<void, Credentials>
			(Accounts.createUser)(credentials);
		})
		.then(() => {
			if (canceled) { return; }

			return Promise.promisify<void, string, string>
			(Meteor.loginWithPassword)(username, password);
		})
		.then(resolve, reject);
	});
}
