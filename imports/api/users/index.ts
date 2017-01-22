export type Role = 'user' | 'admin';

export interface Credentials {
	username: string;
	password: string;
}

export type UserId = string;

export interface User extends Meteor.User {
	roles?: Role[];
	password?: string;
}

export function getUserFullname(user: User): string {
	return user.profile && user.profile.fullname || '';
}
