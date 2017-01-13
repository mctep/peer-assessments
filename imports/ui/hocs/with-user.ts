import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { User } from '../../api/users';

export interface IWithUser {
	user: User;
	loggingIn: boolean;
}

function subscribe(): IWithUser {
	return {
		user: Meteor.user(),
		loggingIn: Meteor.loggingIn()
	};
}

export type ComponentConstructor<P> = React.ComponentClass<P> | React.StatelessComponent<P>;

export function withUser<InP, OutP extends (InP & IWithUser)>(component: ComponentConstructor<OutP>): ComponentConstructor<InP> {
	return createContainer<InP, IWithUser, OutP>(subscribe, component);
}
