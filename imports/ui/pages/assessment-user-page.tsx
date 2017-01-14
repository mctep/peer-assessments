import * as React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { User } from '../../api/users';
import { Assessments, Assessment, IMarks } from '../../api/assessments';
import { createEmptyAssessment, upsertAssessment } from '../../api/assessments/methods';
import withRouteParams from '../hocs/with-route-params';
import Loader from '../components/loader';
import MarksForm from '../forms/marks-form';

interface RouteParams {
	userId: string;
}

interface IWithAssessmentUser {
	loading: boolean;
	user: User;
	assessment: Assessment;
	onAssessmentChange: (assessment: Assessment) => void;
}

function subscribe(props: RouteParams): IWithAssessmentUser {
	const userHandle: Meteor.SubscriptionHandle = Meteor.subscribe('userForAssessment', props.userId);
	const assessmentHandle: Meteor.SubscriptionHandle = Meteor.subscribe('assessmentForUser', props.userId);

	const loading: boolean = !(userHandle.ready() && assessmentHandle.ready());

	const user: User = Meteor.users.findOne(props.userId);
	const assessment: Assessment = Assessments.findOne({
		who: Meteor.userId(),
		whom: props.userId
	}) || createEmptyAssessment(Meteor.userId(), props.userId);


	return { loading, user, assessment, onAssessmentChange: upsertAssessment };
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
			<MarksForm
				onSubmit={ this.handleMarksChange }
				marks={ this.props.assessment.marks }
			/>
		);
	}
}

export default withRouteParams(
	createContainer<RouteParams, IWithAssessmentUser, RouteParams & IWithAssessmentUser>(
		subscribe,
		AssessmentUserPage
	)
);

