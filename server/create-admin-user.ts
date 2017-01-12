export default function createAdminUser(): void {
	if (Meteor.users.find().count() !== 0) { return; }

	const { username, password } = Meteor.settings['admin'];

	const userId = Accounts.createUser({ username, password });

	Roles.removeUsersFromRoles(userId, ['user']);
	Roles.addUsersToRoles(userId, 'admin');
}
