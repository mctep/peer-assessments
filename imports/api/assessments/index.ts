import { Mongo } from 'meteor/mongo';

import { SubjectId, Subjects } from '../subjects';
import { UserId } from '../users';

export type Mark = 'exellent' | 'good' | 'normal' | 'bad';
export const allMarks: Mark[] = ['exellent', 'good', 'normal', 'bad'];

export type AssessmentId = string;

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

export const Assessments: Mongo.Collection<Assessment> = new Mongo.Collection<Assessment>('assessments');

