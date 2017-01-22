import * as Promise from 'bluebird';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { AccessDeniedError, BadRequestError, NotFoundError } from '../../lib/meteor/errors';
import registerPromisedMeteorMethod from '../../lib/meteor/register-promised-method';
import { NotEmptyStringMatch } from '../../lib/meteor/matches';

import { Subjects, Subject } from '.';
import { Assessments } from '../assessments';

export const insertSubject: (name: string) => Promise<string> =
registerPromisedMeteorMethod('insertSubject',
	(name: string): string => {
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

export const removeSubject: (subject: Subject) => Promise<void> =
registerPromisedMeteorMethod('removeSubject', (subject: Subject): void => {
	if (!Roles.userIsInRole(Meteor.user(), 'admin')) {
		throw new AccessDeniedError();
	}

	if (!Subjects.findOne(subject._id)) {
		throw new NotFoundError();
	}

	Assessments.update({}, {
		$pull: {
			'marks.exellent': subject._id,
			'marks.good': subject._id,
			'marks.normal': subject._id,
			'marks.bad': subject._id
		}
	}, { multi: true });

	Subjects.remove(subject._id);
});
