import { Meteor } from 'meteor/meteor';

export interface PublicateParams {
	onError?: (error: Meteor.Error) => void;
}

export default function publicate<Arg, Cur>(name: string, handler: (arg?: Arg) => Cur):
(arg?: Arg, params?: PublicateParams) => Meteor.SubscriptionHandle {
	if (Meteor.isServer) {
		Meteor.publish(name, handler);
	}

	return (arg?: Arg, params?: PublicateParams): Meteor.SubscriptionHandle => Meteor.subscribe(name, arg, params);
}
