import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import { User } from './..';

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

Accounts.onCreateUser((options: {}, user: User): User => {
	user.roles = ['user'];
	return user;
});

Meteor.publish('users', (): Mongo.Cursor<User> => {
	return Meteor.users.find({ roles: { $elemMatch: { $eq: 'user' } } });
});
