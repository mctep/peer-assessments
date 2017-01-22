import * as React from 'react';
import { Card, List, Icon, CardProps } from 'semantic-ui-react';
import { User } from '../../../api/users';
import { Assessment, IMarks, Mark } from '../../../api/assessments';
import markSettings, { MarkSetting } from '../mark-settings';

import './style.css';

interface Props {
	user: User;
	leftAssessments?: Assessment[];
	receivedAssessments?: Assessment[];
	children?: React.ReactNode[];
}

interface AssessmentsCount {
	exellent: number;
	good: number;
	normal: number;
	bad: number;
}


export default class UserCard extends React.Component<Props & CardProps, void> {
	private static countAssessmentsByMark(assessments: Assessment[]): AssessmentsCount {
		const assessmentsCount: AssessmentsCount = {
			exellent: 0,
			good: 0,
			normal: 0,
			bad: 0
		};

		assessments.forEach((assessment: Assessment) => {
			const marks: IMarks = assessment.marks;
			Object.keys(marks).forEach((mark: Mark) => {
				const count: number = assessment.marks[mark].length;
				assessmentsCount[mark] += count;
			});
		});

		return assessmentsCount;
	}

	private renderAssessmentsCountList(assessments?: Assessment[]): JSX.Element {
		if (!assessments || !assessments.length) { return null; }

		const assessmentsCount: AssessmentsCount = UserCard.countAssessmentsByMark(assessments);

		const items: JSX.Element[] = Object.keys(assessmentsCount).map((mark: Mark) => {
			if (!assessmentsCount[mark]) { return null; }

			const settings: MarkSetting = markSettings[mark];

			return (
				<List.Item key={ mark }>
					<Icon
						name={ settings.icon }
						color={ settings.color }
						className="user-card__star-icon"
					/>
					{ assessmentsCount[mark] }
				</List.Item>
			);
		}).filter(Boolean);

		if (!items.length) { return null; }

		return (
			<div>
				<List horizontal>
					{ items }
				</List>
			</div>
		);
	}

	private renderLeftAssessmentsContent(): JSX.Element {
		const leftAssessmentsCountList: JSX.Element =
		this.renderAssessmentsCountList(this.props.leftAssessments);

		if (!leftAssessmentsCountList) { return null; }

		return (
			<Card.Content extra>
				Assessments left
				{ leftAssessmentsCountList }
			</Card.Content>
		);
	}

	private renderReceivedAssessmentsContent(): JSX.Element {
		const receivedAssessmentsCountList: JSX.Element =
		this.renderAssessmentsCountList(this.props.receivedAssessments);

		if (!receivedAssessmentsCountList) { return null; }

		return (
			<Card.Content extra>
				Assessments received
				{ receivedAssessmentsCountList }
			</Card.Content>
		);
	}

	private renderContent(): JSX.Element {
		const user: User = this.props.user;
		const username: string = `@${user.username}`;

		const meta: string = user.profile && user.profile.fullname && username || '';
		const header: string = meta ? user.profile.fullname : username;

		const metaElement: JSX.Element = meta ? (
			<Card.Meta>
				{ meta }
			</Card.Meta>
		) : null;

		return (
			<Card.Content>
				<Card.Header>
					{ header }
				</Card.Header>
				{ metaElement }
			</Card.Content>
		);
	}

	private renderChildren(): JSX.Element {
		if (!this.props.children) { return null; }

		return (
			<Card.Content extra>
				{ this.props.children }
			</Card.Content>
		);
	}

	public render(): JSX.Element {
		return (
			<Card as={ this.props.as }>
				{ this.renderContent() }
				{ this.renderLeftAssessmentsContent() }
				{ this.renderReceivedAssessmentsContent() }
				{ this.renderChildren() }
			</Card>
		);
	}
}
