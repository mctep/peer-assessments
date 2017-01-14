import * as Promise from 'bluebird';

Promise.config({ cancellation: true });

/**
 * Wraps Meteor.call to standalone function that returns cancellable promise.
 * Some experiment helper. Supports just single argument for Meteor.call.
 * TODO support many arguments
 */
export default function registerMethod<Arg, Res>(name: string, foo: (arg?: Arg) => Res): (arg: Arg) => Promise<Res> {
	Meteor.methods({[name]: foo});
	return (arg?: Arg): Promise<Res> => Promise.promisify<Res, string, Arg>(Meteor.call)(name, arg);
}
