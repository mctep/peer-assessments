import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import registerPromisedMeteorMethod from '../../lib/meteor/register-promised-method';
import { AccessDeniedError } from '../../lib/meteor/errors';

import { Credentials, User } from '.';

import * as Promise from 'bluebird';
Promise.config({ cancellation: true });

export const isUsernameExists: (username: string) => Promise<boolean> =
registerPromisedMeteorMethod('isUsernameExists',
	(username: string) => {
		if (!Roles.userIsInRole(Meteor.user(), 'admin')) {
			throw new AccessDeniedError();
		}

		return !!Meteor.users.findOne({ username });
	}
);

export const createNewUser: (user: User) => Promise<string> =
registerPromisedMeteorMethod('createNewUser',
	(user: User) => {
		if (!Roles.userIsInRole(Meteor.user(), 'admin')) {
			throw new AccessDeniedError();
		}

		return Accounts.createUser(user);
	}
);

export function loginWithPassword(credentials: Credentials): Promise<void> {
	const username: string = credentials.username;
	const password: string = credentials.password;

	return Promise.promisify<void, string, string>
	(Meteor.loginWithPassword)(username, password);
}
