import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import { User } from './..';

Meteor.users.deny({
	insert: (): boolean => true,
	update: (): boolean => true,
	remove: (): boolean => true
});

Accounts.onCreateUser((options: User, user: User): User => {
	user.roles = ['user'];
	user.profile = options.profile;
	return user;
});

Meteor.publish('users', (): Mongo.Cursor<User> => {
	return Meteor.users.find({ roles: { $elemMatch: { $eq: 'user' } } });
});
