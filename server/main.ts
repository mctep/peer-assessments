import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Credentials } from '../imports/api/users';

Meteor.methods({
	'accounts.isUsernameExists'(username: string) {
		return !!Accounts.findUserByUsername(username);
	}
});

Meteor.startup(() => {
	// code to run on server at startup
});
