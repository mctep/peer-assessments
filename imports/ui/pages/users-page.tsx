import * as React from 'react';
import { Card, Button, Input, Form, Divider, Header, Icon } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import wrapLink from '../components/wrap-link';
import { Assessment, Assessments } from '../../api/assessments';
import UserCard from '../components/user-card';
import UsersFilterFetcher from '../components/users-filter-fetcher';
import AddUserForm from '../forms/add-user-form';
import { User } from '../../api/users';
import EditUserFormButton from '../forms/edit-user-form';

interface Props {
	assessments: Assessment[];
}

function subscribe(): Props {
	Meteor.subscribe('assessments');

	return {
		assessments: Assessments.find().fetch()
	};
}

interface State {
	users: User[];
	filter: string;
}

class UsersPage extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			users: [],
			filter: ''
		};
	}
	private static getLeftAsessments(user: User, assessments: Assessment[]): Assessment[] {
		return assessments.filter((assessment: Assessment) => assessment.who === user._id);
	}

	private static getReceivedAsessments(user: User, assessments: Assessment[]): Assessment[] {
		return assessments.filter((assessment: Assessment) => assessment.whom === user._id);
	}

	private handleUsernameInputChage = (e: React.FormEvent): void => {
		const filter: string = (e.target as HTMLInputElement).value;
		this.setState({ ...this.state, filter });
	}

	private handleUserListChange = (users: User[]): void => {
		this.setState({ ...this.state, users });
	}

	private renderUsers(): JSX.Element[] {
		return this.state.users.map((user: User) => (
			<UserCard
				key={ user._id }
				user={ user }
				leftAssessments={ UsersPage.getLeftAsessments(user, this.props.assessments) }
				receivedAssessments={ UsersPage.getReceivedAsessments(user, this.props.assessments) }
			>
				<Button basic color="blue" type="button" as={ wrapLink(`/assess/${user.username}`) }>
					Assess
				</Button>
				{ <EditUserFormButton user={ user } /> }
			</UserCard>
		));
	}

	private renderUserForm(): JSX.Element {
		return (
			<Form>
				<Form.Input
					type="text"
					name="username"
					placeholder="Username"
					onChange={ this.handleUsernameInputChage }
				/>
			</Form>
		);
	}

	public render(): JSX.Element {
		return (
			<div>
				<Header as="h1">
					Filter and Assess Users
					{ <AddUserForm username={ this.state.filter } /> }
				</Header>
				{ this.renderUserForm() }
				<UsersFilterFetcher
					filter={ this.state.filter }
					onChange={ this.handleUserListChange }
				/>
				<Divider />
				<Card.Group>
					{ this.renderUsers() }
				</Card.Group>
			</div>
		);
	}
}

export default createContainer(subscribe, UsersPage);
