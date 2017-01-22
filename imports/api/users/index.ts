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
	return user && user.profile && user.profile.fullname || '';
}

export function getUserName(user: User): string {
	return getUserFullname(user) || `@${user.username}`;
}
