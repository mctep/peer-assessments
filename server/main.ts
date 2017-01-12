import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { User, Role } from '../imports/api/users';
import createAdminUser from './create-admin-user';

Meteor.users.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});

Meteor.methods({
	'accounts.isUsernameExists'(username: string) {
		return !!Accounts.findUserByUsername(username);
	}
});

Accounts.onCreateUser((options, user: User) => {
	user.roles = ['user'];
	return user;
});

Meteor.publish('users', function() {
	return Meteor.users.find({ roles: { $elemMatch: { $eq: 'user' } } });
});

Meteor.startup(() => {
	createAdminUser();
});
