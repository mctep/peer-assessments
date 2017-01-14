import { Meteor } from 'meteor/meteor';

import { AccessDeniedError } from '../../../lib/meteor/errors';

import { Assessments } from './..';
import { User } from '../../users';

Assessments.deny({
	insert: (): boolean => true,
	update: (): boolean => true,
	remove: (): boolean => true
});

Meteor.publish('userForAssessment', (userId: string): Mongo.Cursor<User> => {
	if (userId === this.userId) {
		throw new AccessDeniedError();
	}

	return Meteor.users.find({
		_id: userId,
		roles: { $elemMatch: { $eq: 'user' } }
	});
});

Meteor.publish('assessmentForUser', function assessmentForUser(userId: string): Mongo.Cursor<User> {
	if (userId === this.userId) {
		throw new AccessDeniedError();
	}

	if (Roles.userIsInRole(userId, 'admin')) {
		throw new AccessDeniedError();
	}

	return Assessments.find({
		who: this.userId,
		whom: userId
	});
});
