import { Meteor } from 'meteor/meteor';

import { Subjects, Subject } from './..';

Subjects.deny({
	insert: (): boolean => true,
	update: (): boolean => true,
	remove: (): boolean => true
});

Meteor.publish('subjects', (): Mongo.Cursor<Subject> => {
	return Subjects.find({});
});
