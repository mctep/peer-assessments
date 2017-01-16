import { Meteor } from 'meteor/meteor';

import { AccessDeniedError, NotFoundError } from '../../../lib/meteor/errors';

import { Assessments, Assessment } from './..';
import { User } from '../../users';

Assessments.deny({
	insert: (): boolean => true,
	update: (): boolean => true,
	remove: (): boolean => true
});

Meteor.publish('userForAssessment', function userForAssessment(username: string): Mongo.Cursor<User> {
	const user: User = Meteor.users.findOne({ username });

	if (!user) {
		this.error(new NotFoundError());
	}

	if (user._id === this.userId) {
		this.error(new AccessDeniedError());
	}

	return Meteor.users.find({
		_id: user._id,
		roles: { $elemMatch: { $eq: 'user' } }
	});
});

Meteor.publish('assessmentForUser', function assessmentForUser(username: string): Mongo.Cursor<User> {
	const user: User = Meteor.users.findOne({ username: username });

	if (!user) {
		this.error(new NotFoundError());
	}

	if (user._id === this.userId) {
		this.error(new AccessDeniedError());
	}

	if (Roles.userIsInRole(user._id, 'admin')) {
		this.error(new AccessDeniedError());
	}

	return Assessments.find({
		who: this.userId,
		whom: user._id
	});
});

Meteor.publish('assessments', function assessments(): Mongo.Cursor<Assessment> {
	const isAdmin: boolean = Roles.userIsInRole(this.userId, 'admin');

	if (isAdmin) { return Assessments.find(); }

	return Assessments.find({ who: this.userId });
});
