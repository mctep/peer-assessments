import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Credentials } from '../imports/api/users';
import createAdminUser from './create-admin-user';

Meteor.methods({
	'accounts.isUsernameExists'(username: string) {
		return !!Accounts.findUserByUsername(username);
	}
});

Meteor.startup(() => {
	// of course default password should not be in source code
	// it would be in process environment variable
	// or some local file which ignored by git
	createAdminUser({ password: 'admin' });
});
