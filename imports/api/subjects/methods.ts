import * as Promise from 'bluebird';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { AccessDeniedError, BadRequestError } from '../../lib/meteor/errors';
import registerPromisedMeteorMethod from '../../lib/meteor/register-promised-method';
import { NotEmptyStringMatch } from '../../lib/meteor/matches';

import { Subjects } from '.';

export const insertSubject: (name: string) => Promise<String> =
	registerPromisedMeteorMethod('insertSubject', function subjectsInsert(name: string): string {
		name = name.trim();

		if (!Roles.userIsInRole(this.userId, 'admin')) {
			throw new AccessDeniedError();
		}

		if (Subjects.findOne({ name })) {
			throw new BadRequestError('This subject is already exists');
		}

		check(name, NotEmptyStringMatch);

		return Subjects.insert({ name });
	}
);
