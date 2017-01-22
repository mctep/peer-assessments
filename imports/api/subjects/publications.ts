import { Meteor } from 'meteor/meteor';

import { Subjects, Subject } from '.';
import registerPublication from '../../lib/meteor/register-publication';

if (Meteor.isServer) {
	Subjects.deny({
		insert: (): boolean => true,
		update: (): boolean => true,
		remove: (): boolean => true
	});
}

export const subscribeSubjects: () => Meteor.SubscriptionHandle =
registerPublication('subscribeSubjects', (): Mongo.Cursor<Subject> =>
	Subjects.find({})
);

