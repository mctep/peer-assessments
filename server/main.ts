import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { User, Role } from '../imports/api/users';
import createAdminUser from './create-admin-user';

Meteor.users.deny({
	insert: (): boolean => true,
	update: (): boolean => true,
	remove: (): boolean => true
});

Meteor.methods({
	'accounts.isUsernameExists'(username: string): boolean {
		return !!Accounts.findUserByUsername(username);
	}
});

Accounts.onCreateUser((options: {}, user: User) => {
	user.roles = ['user'];
	return user;
});

Meteor.publish('users', () => {
	return Meteor.users.find({ roles: { $elemMatch: { $eq: 'user' } } });
});

Meteor.startup(() => {
	createAdminUser();
});
