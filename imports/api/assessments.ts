import { Mongo } from 'meteor/mongo';
import { SubjectId } from './subjects';
import { UserId } from './users';

type Mark = 'exellent' | 'good' | 'normal' | 'bad';

type AssessmentId = string;

interface Assessment {
	_id: AssessmentId;
	who: UserId;
	whom: UserId;
	marks: {
		exellent: Set<SubjectId>;
		good: Set<SubjectId>;
		normal: Set<SubjectId>;
		bad: Set<SubjectId>;
	};
}

export const Assessments: Mongo.Collection<Assessment> = new Mongo.Collection<Assessment>('assessments');
