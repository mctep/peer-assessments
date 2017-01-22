import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import { User } from '.';
import registerPublication from '../../lib/meteor/register-publication';

if (Meteor.isServer) {
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
}

export const subscribeUsers: () => Meteor.SubscriptionHandle =
registerPublication('subscribeUsers', (): Mongo.Cursor<User> =>
	Meteor.users.find({ roles: { $elemMatch: { $eq: 'user' } } })
);
