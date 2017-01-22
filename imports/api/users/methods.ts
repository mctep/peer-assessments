import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import registerPromisedMeteorMethod from '../../lib/meteor/register-promised-method';
import { AccessDeniedError, NotFoundError, BadRequestError } from '../../lib/meteor/errors';
import { Assessments } from '../assessments';
import { Credentials, User, getUserFullname } from '.';

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

		if (getUserFullname(user)) {
			user.profile.fullname = user.profile.fullname.trim();
		}

		if (!user.username.trim() || !user.password.trim()) {
			throw new BadRequestError();
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

interface IUserUpdate {
	id: string;
	password?: string;
	fullname?: string;
	toDelete?: boolean;
}

export const updateUser: (user: IUserUpdate) => Promise<void> =
registerPromisedMeteorMethod('updateUser',
	(user: IUserUpdate) => {
		if (!Roles.userIsInRole(Meteor.user(), 'admin')) {
			throw new AccessDeniedError();
		}

		const userForUpdate: Meteor.User = Meteor.users.findOne(user.id);

		if (!userForUpdate) {
			throw new NotFoundError();
		}

		if (user.toDelete) {
			Assessments.remove({ who: user.id });
			Assessments.remove({ whom: user.id });
			Meteor.users.remove(user.id);
			return;
		}

		const fullname: string = user.fullname.trim();

		if (getUserFullname(userForUpdate) !== fullname) {
			Meteor.users.update(user.id, {
				$set: { 'profile.fullname': fullname }
			});
		}

		if (Meteor.isServer) {
			const password: string = user.password.trim();

			if (password) {
				Accounts.setPassword(user.id, password);
			}
		}
	}
);
