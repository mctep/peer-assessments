import * as React from 'react';
import { withRouter, IRouter } from 'react-router';
import { Header } from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data';
import { User } from '../../api/users';
import { Assessments, Assessment, IMarks } from '../../api/assessments';
import { createEmptyAssessment, upsertAssessment } from '../../api/assessments/methods';
import {
	subscribeUserForAssessment,
	subscribeAssessmentsForUser
} from '../../api/assessments/publications';
import withRouteParams from '../hocs/with-route-params';
import Loader from '../components/loader';
import MarksForm from '../forms/marks-form';
import { NOT_FOUND_ERROR_STATUS } from '../../lib/meteor/errors';

interface RouteParams {
	username: string;
}

interface IWithAssessmentUser {
	loading: boolean;
	user?: User;
	assessment?: Assessment;
	onAssessmentChange: (assessment: Assessment) => void;
}

function subscribe(props: RouteParams & { router: IRouter }): IWithAssessmentUser {
	// TODO !?!?! Research more about subscribtion error handling.
	// Very strange error handling.
	let redirected: boolean = false;
	function onError(error: Meteor.Error): void {
		if (redirected) { return; }

		if (error.error === NOT_FOUND_ERROR_STATUS) {
			redirected = true;
			props.router.replace('/page-not-found');
		}
	}

	const userHandle: Meteor.SubscriptionHandle = subscribeUserForAssessment(props.username, { onError });
	const assessmentHandle: Meteor.SubscriptionHandle = subscribeAssessmentsForUser(props.username, { onError });

	const loading: boolean = !(userHandle.ready() && assessmentHandle.ready());

	const subProps: IWithAssessmentUser = {
		loading,
		user: null,
		assessment: null,
		onAssessmentChange: upsertAssessment
	};

	if (loading) { return subProps; }

	const user: User = Meteor.users.findOne({ username: props.username });
	const assessment: Assessment = Assessments.findOne({
		who: Meteor.userId(),
		whom: user._id
	}) || createEmptyAssessment(Meteor.userId(), user._id);

	subProps.user = user;
	subProps.assessment = assessment;

	return subProps;
}

class AssessmentUserPage extends React.Component<RouteParams & IWithAssessmentUser, {}> {
	private handleMarksChange = (marks: IMarks): void => {
		this.props.onAssessmentChange({
			...this.props.assessment,
			marks
		});
	}

	public render(): JSX.Element {
		if (this.props.loading) {
			return <Loader />;
		}

		return (
			<div>
				<Header as="h1">
					Please Assess User{ ' ' }
					@{ this.props.user.username }
				</Header>
				<MarksForm
					onSubmit={ this.handleMarksChange }
					marks={ this.props.assessment.marks }
				/>
			</div>
		);
	}
}

export default withRouteParams(
	withRouter(
		createContainer<RouteParams, IWithAssessmentUser, RouteParams & IWithAssessmentUser>(
			subscribe,
			AssessmentUserPage
		)
	)
);

