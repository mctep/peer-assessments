import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

export default function createAdminUser(data: { password: string }) {
	if (Meteor.users.find().count() !== 0) { return; }

	Accounts.createUser({
		username: 'admin',
		password: data.password,
		profile: {
			admin: true
		}
	});
}
