import * as React from 'react';
import { Segment, Divider, Header, List, Message } from 'semantic-ui-react';
import { withRouter, IRouter } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import withRouteParams from '../hocs/with-route-params';

import { User, getUserName } from '../../api/users';
import { subscribeUsers } from '../../api/users/publications';

import { Assessment, Assessments, Mark } from '../../api/assessments';
import { subscribeUserForAssessment, subscribeAllAssessmentsForUser } from '../../api/assessments/publications';

import { Subject, Subjects } from '../../api/subjects';
import { subscribeSubjects } from '../../api/subjects/publications';

import { NOT_FOUND_ERROR_STATUS } from '../../lib/meteor/errors';
import Loader from '../components/loader';
import AssessmentComponent, { AssessmentDirection } from '../components/assessment';

interface RouteParams {
	username: string;
}

interface Subs {
	loading: boolean;
	user?: User;
	leftAssessments?: Assessment[];
	receivedAssessments?: Assessment[];
	users?: User[];
	subjects?: Subject[];
}

function subscribe(props: RouteParams & { router: IRouter }): Subs {
	let redirected: boolean = false;
	function onError(error: Meteor.Error): void {
		if (redirected) { return; }

		if (error.error === NOT_FOUND_ERROR_STATUS) {
			redirected = true;
			props.router.replace('/page-not-found');
		}
	}

	const userHandle: Meteor.SubscriptionHandle = subscribeUserForAssessment(props.username, { onError });
	const assessmentHandle: Meteor.SubscriptionHandle = subscribeAllAssessmentsForUser(props.username, { onError });
	const subjectsHandle: Meteor.SubscriptionHandle = subscribeSubjects();
	const usersHandle: Meteor.SubscriptionHandle = subscribeUsers();

	if (!(userHandle.ready() && assessmentHandle.ready() && subjectsHandle.ready())) {
		return { loading: true };
	}

	const user: User = Meteor.users.findOne({ username: props.username });

	return {
		loading: false,
		user: Meteor.users.findOne({ username: props.username }),
		leftAssessments: Assessments.find({ who: user._id }).fetch(),
		receivedAssessments: Assessments.find({ whom: user._id }).fetch(),
		users: Meteor.users.find().fetch(),
		subjects: Subjects.find().fetch()
	};
}

interface AssessmentGroup {
	key: string;
	mark: Mark;
	subject: Subject;
	users: User[];
}

class AssessmentAdminPage extends React.Component<RouteParams & Subs, void> {
	private renderAssessments(assessments: Assessment[], direction: AssessmentDirection): JSX.Element[] {
		const getUserById: (id: string) => User = (id: string): User =>
			this.props.users.find((user: User) => user._id === id);

		const getSubjectById: (id: string) => Subject = (id: String): Subject =>
			this.props.subjects.find((subject: Subject) => subject._id === id);

		const assessmentsGroup: {[key: string]: AssessmentGroup} = {};

		assessments.forEach((assessment: Assessment) => {
			Object.keys(assessment.marks).forEach((mark: Mark) => {
				assessment.marks[mark].forEach((subjectId: string) => {
					const key: string = `${mark}-${subjectId}`;

					assessmentsGroup[key] = assessmentsGroup[key] || {
						key,
						mark,
						subject: getSubjectById(subjectId),
						users: []
					};

					const user: User = getUserById(direction === 'left' ? assessment.who : assessment.whom);

					if (!user) { return; }

					assessmentsGroup[key].users.push(user);
				});
			});
		});

		return Object.keys(assessmentsGroup)
		.map((key: string) => assessmentsGroup[key])
		.sort((a: AssessmentGroup, b: AssessmentGroup) => b.users.length - a.users.length)
		.map((assessment: AssessmentGroup) => (
			<List.Item key={ assessment.key }>
				<AssessmentComponent
					direction={ direction }
					mark={ assessment.mark }
					subject={ assessment.subject }
					users={ assessment.users }
					user={ this.props.user }
				/>
			</List.Item>
		));
	}

	private renderReceivedAssessments(): JSX.Element {
		if (!this.props.receivedAssessments.length) { return null; }
		return (
			<Segment>
				<Header as="h2">
					Received:
				</Header>
				<Divider />
				<List>
					{ this.renderAssessments(this.props.receivedAssessments, 'left') }
				</List>
			</Segment>
		);
	}

	private renderLeftAssessments(): JSX.Element {
		if (!this.props.leftAssessments.length) { return null; }
		return (
			<Segment>
				<Header as="h2">
					Left:
				</Header>
				<Divider />
				<List>
					{ this.renderAssessments(this.props.leftAssessments, 'received') }
				</List>
			</Segment>
		);
	}

	private renderEmptyAssessments(): JSX.Element {
		if (this.props.leftAssessments.length || this.props.receivedAssessments.length) {
			return null;
		}

		return (
			<Message
				icon="tasks"
				header={ `Looks like ${getUserName(this.props.user)} has not participate in peer assessment`}
				content="Ask him to harry up."
			/>
		);
	}

	public render(): JSX.Element {
		if (this.props.loading) {
			return <Loader />;
		}

		return (
			<div>
				<Header as="h1">
					Assessments for { getUserName(this.props.user) }
				</Header>
				{ this.renderReceivedAssessments() }
				{ this.renderLeftAssessments() }
				{ this.renderEmptyAssessments() }
			</div>
		);
	}
}

export default withRouteParams(
	withRouter(
		createContainer<RouteParams, Subs, RouteParams & Subs>(
			subscribe,
			AssessmentAdminPage
		)
	)
);
