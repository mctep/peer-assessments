import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { NotEmptyStringMatch } from '../lib/meteor/matches';
import * as Promise from 'bluebird';
import registerPromisedMeteorMethod from '../lib/meteor/register-promised-method';

export type SubjectId = string;

export interface Subject {
	_id?: SubjectId;
	name: string;
}

export const Subjects: Mongo.Collection<Subject> = new Mongo.Collection<Subject>('subjects');

const ACCESS_DENIED_STATUS: number = 403;
const BADREQUEST_STATUS: number = 400;

export const subjectInsertMethod: (name: string) => Promise<String> =
	registerPromisedMeteorMethod('subjects.insert', function subjectsInsert(name: string): string {
		name = name.trim();

		if (!Roles.userIsInRole(this.userId, 'admin')) {
			throw new Meteor.Error(ACCESS_DENIED_STATUS, 'Access Denied');
		}

		if (Subjects.findOne({ name })) {
			throw new Meteor.Error(BADREQUEST_STATUS, 'This subject is already exists');
		}

		check(name, NotEmptyStringMatch);

		return Subjects.insert({ name });
	}
);
