import * as Promise from 'bluebird';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { AccessDeniedError, BadRequestError } from '../../lib/meteor/errors';
import registerPromisedMeteorMethod from '../../lib/meteor/register-promised-method';

import { Assessment, IMarks, Mark, AssessmentId, Assessments } from '.';
import { UserId } from '../users';
import { SubjectId, Subjects } from '../subjects';

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

export function getMarkedSubjectIds(marks: IMarks): SubjectId[] {
	return Object.keys(marks)
	.reduce((result: SubjectId[], mark: Mark) => result.concat(marks[mark]), []);
}

export const upsertAssessment: (assigmnet: Assessment) => Promise<AssessmentId> =
registerPromisedMeteorMethod('upsertAssessment',
	(assessment: Assessment): AssessmentId => {
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
