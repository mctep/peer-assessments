import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import * as Promise from 'bluebird';

export type SubjectId = string;

export interface Subject {
	_id?: SubjectId;
	name: string;
}

export const Subjects: Mongo.Collection<Subject> = new Mongo.Collection<Subject>('subjects');

const NotEmptyString: Function = Match.Where((val: string): boolean => {
	check(val, String);
	return val.length > 0;
});

const ACCESS_DENIED_STATUS: number = 403;
const BADREQUEST_STATUS: number = 400;

function registerMethod<Arg, Res>(name: string, foo: (arg?: Arg) => Res): (arg: Arg) => Promise<Res> {
	Meteor.methods({[name]: foo});
	return (arg?: Arg): Promise<Res> => Promise.promisify<Res, string, Arg>(Meteor.call)(name, arg);
}

export const subjectInsertMethod: (name: string) => Promise<String> =
	registerMethod('subjects.insert', function subjectsInsert(name: string): string {
		name = name.trim();

		if (!Roles.userIsInRole(this.userId, 'admin')) {
			throw new Meteor.Error(ACCESS_DENIED_STATUS, 'Access Denied');
		}

		if (Subjects.findOne({ name })) {
			throw new Meteor.Error(BADREQUEST_STATUS, 'This subject is already exists');
		}

		check(name, NotEmptyString);

		return Subjects.insert({ name });
	}
);
