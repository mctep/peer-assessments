import { Meteor } from 'meteor/meteor';

import { AccessDeniedError, NotFoundError } from '../../lib/meteor/errors';
import registerPublication, { PublicateParams } from '../../lib/meteor/register-publication';

import { Assessments, Assessment } from '.';
import { User } from '../users';

if (Meteor.isServer) {
	Assessments.deny({
		insert: (): boolean => true,
		update: (): boolean => true,
		remove: (): boolean => true
	});
}

export const subscribeUserForAssessment: (username: string, params?: PublicateParams) => Meteor.SubscriptionHandle =
registerPublication('subscribeUserForAssessment',
function subscribeUserForAssessment(username: string): Mongo.Cursor<User> {
	if (!this.userId) {
		this.error(new AccessDeniedError());
		return;
	}

	const user: User = Meteor.users.findOne({ username });

	if (!user) {
		this.error(new NotFoundError());
		return;
	}

	if (user._id === this.userId) {
		this.error(new NotFoundError());
		return;
	}

	return Meteor.users.find({
		_id: user._id,
		roles: { $elemMatch: { $eq: 'user' } }
	});
});

export const subscribeAssessmentsForUser: (username: string, params?: PublicateParams) => Meteor.SubscriptionHandle =
registerPublication('subscribeAssessmentsForUser',
function subscribeAssessmentsForUser(username: string): Mongo.Cursor<Assessment> {
	if (!this.userId) {
		this.error(new AccessDeniedError());
		return;
	}

	const user: User = Meteor.users.findOne({ username: username });

	if (!user) {
		this.error(new NotFoundError());
		return;
	}

	if (user._id === this.userId) {
		this.error(new NotFoundError());
		return;
	}

	if (Roles.userIsInRole(user._id, 'admin')) {
		this.error(new NotFoundError());
		return;
	}

	return Assessments.find({
		who: this.userId,
		whom: user._id
	});
});

export const subscribeAllAssessmentsForUser: (username: string, params?: PublicateParams) => Meteor.SubscriptionHandle =
registerPublication('subscribeAllAssessmentsForUser',
function subscribeAllAssessmentsForUser(username: string): Mongo.Cursor<Assessment> {
	if (!this.userId) {
		this.error(new AccessDeniedError());
		return;
	}

	if (!Roles.userIsInRole(this.userId, 'admin')) {
		this.error(new NotFoundError());
		return;
	}

	const user: User = Meteor.users.findOne({ username: username });

	if (!user) {
		this.error(new NotFoundError());
		return;
	}

	if (user._id === this.userId) {
		this.error(new NotFoundError());
		return;
	}

	return Assessments.find({ $or: [{ who: user._id }, { whom: user._id }] });
});

export const subscribeAssessments: () => Meteor.SubscriptionHandle =
registerPublication('subscribeAssessments',
function subscribeAssessments(): Mongo.Cursor<Assessment> {
	const isAdmin: boolean = Roles.userIsInRole(this.userId, 'admin');

	if (isAdmin) { return Assessments.find(); }

	return Assessments.find({ who: this.userId });
});
