import { Meteor } from 'meteor/meteor';

export const BAD_REQUEST_STATUS: number = 400;
export const ACCESS_DENIED_STATUS: number = 403;
export const NOT_FOUND_ERROR_STATUS: number = 404;

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

export class NotFoundError extends Meteor.Error {
	constructor(message?: string) {
		super(NOT_FOUND_ERROR_STATUS, message || 'Not Found');
	}
}
