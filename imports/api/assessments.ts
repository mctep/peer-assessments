import { Mongo } from 'meteor/mongo';
import { SubjectId, Subjects } from './subjects';
import { UserId } from './users';
import * as Promise from 'bluebird';
import registerPromisedMeteorMethod from '../lib/meteor/register-promised-method';
import { check } from 'meteor/check';
import { NotEmptyStringMatch } from '../lib/meteor/matches';
import { AccessDeniedError, BadRequestError } from '../lib/meteor/errors';

export type Mark = 'exellent' | 'good' | 'normal' | 'bad';
export const allMarks: Mark[] = ['exellent', 'good', 'normal', 'bad'];

type AssessmentId = string;

export interface IMarks {
	exellent: SubjectId[];
	good: SubjectId[];
	normal: SubjectId[];
	bad: SubjectId[];
}

export interface Assessment {
	_id?: AssessmentId;
	who: UserId;
	whom: UserId;
	marks: IMarks;
}

export function createEmptyAssessment(who: UserId, whom: UserId): Assessment {
	return {
		who, whom,
		marks: {
			exellent: [],
			good: [],
			normal: [],
			bad: []
		}
	};
}

export const Assessments: Mongo.Collection<Assessment> = new Mongo.Collection<Assessment>('assessments');

export function getMarkedSubjectIds(marks: IMarks): SubjectId[] {
	return Object.keys(marks)
	.reduce((result: SubjectId[], mark: Mark) => result.concat(marks[mark]), []);
}

export const upsertAssessment: (assigmnet: Assessment) => Promise<AssessmentId> =
registerPromisedMeteorMethod('upsertAssessment',
	(assessment: Assessment): AssessmentId => {
		debugger;
		const who: string = assessment.who;
		const whom: string = assessment.whom;
		const marks: IMarks = assessment.marks;

		if (who !== Meteor.userId()) {
			throw new AccessDeniedError();
		}

		if (whom === Meteor.userId()) {
			throw new AccessDeniedError('You cannot assessment yourself');
		}

		check(marks, {
			exellent: Array,
			good: Array,
			normal: Array,
			bad: Array
		});

		const subjectsIds: SubjectId[] = getMarkedSubjectIds(marks);
		const subjectsCount: number = subjectsIds.length;

		if (subjectsCount !== (new Set(subjectsIds)).size) {
			throw new BadRequestError('Subjects in marks must be unique');
		}

		if (subjectsCount !== Subjects.find({ _id: { $in: subjectsIds } }).count()) {
			throw new BadRequestError('Every subject in marks must exist');
		}

		const upsertResult: { insertedId?: string } = Assessments.upsert({ who, whom }, { who, whom, marks });

		return assessment._id || upsertResult.insertedId;
	}
);
