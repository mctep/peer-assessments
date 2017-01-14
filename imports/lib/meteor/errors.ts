import { Meteor } from 'meteor/meteor';

const BAD_REQUEST_STATUS: number = 400;
const ACCESS_DENIED_STATUS: number = 403;

export class AccessDeniedError extends Meteor.Error {
	constructor(message?: string) {
		super(ACCESS_DENIED_STATUS, message || 'Access Denied');
	}
}

export class BadRequestError extends Meteor.Error {
	constructor(message?: string) {
		super(BAD_REQUEST_STATUS, message || 'Bad Request');
	}
}
