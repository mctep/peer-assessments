import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { User, Role } from '../imports/api/users';
import { Subjects, Subject } from '../imports/api/subjects';
import { Assessments } from '../imports/api/assessments';
import createAdminUser from './create-admin-user';

Meteor.users.deny({
	insert: (): boolean => true,
	update: (): boolean => true,
	remove: (): boolean => true
});

Subjects.deny({
	insert: (): boolean => true,
	update: (): boolean => true,
	remove: (): boolean => true
});

Assessments.deny({
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

Meteor.publish('subjects', (): Mongo.Cursor<Subject> => {
	return Subjects.find({});
});

Meteor.startup((): void => {
	createAdminUser();
});
