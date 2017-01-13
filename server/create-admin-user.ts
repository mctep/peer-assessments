export default function createAdminUser(): void {
	if (Meteor.users.find().count() !== 0) { return; }

	const username: string = Meteor.settings['admin'].username;
	const password: string = Meteor.settings['admin'].password;

	const userId: string = Accounts.createUser({ username, password });

	Roles.removeUsersFromRoles(userId, ['user']);
	Roles.addUsersToRoles(userId, 'admin');
}
