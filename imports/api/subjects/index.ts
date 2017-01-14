import { Mongo } from 'meteor/mongo';

export type SubjectId = string;

export interface Subject {
	_id?: SubjectId;
	name: string;
}

export const Subjects: Mongo.Collection<Subject> = new Mongo.Collection<Subject>('subjects');

