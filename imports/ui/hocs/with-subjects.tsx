import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Subject, Subjects } from '../../api/subjects';
import { subscribeSubjects } from '../../api/subjects/publications';

export interface IWithSubjects {
	subjects: Subject[];
}

function subscribe(): IWithSubjects {
	subscribeSubjects();

	return {
		subjects: Subjects.find({}).fetch()
	};
}

type ComponentConstructor<P> = React.ComponentClass<P> | React.StatelessComponent<P>;

export default function withSubjects<InP, OutP extends (InP & IWithSubjects)>(component: ComponentConstructor<OutP>): ComponentConstructor<InP> {
	return createContainer<InP, IWithSubjects, OutP>(subscribe, component);
}
