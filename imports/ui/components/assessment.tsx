import * as React from 'react';
import { Link } from 'react-router';
import { User, getUserName } from '../../api/users';
import { Mark } from '../../api/assessments';
import { Subject } from '../../api/subjects';
import SubjectComponent from './subject';
import markSettings from './mark-settings';

export type AssessmentDirection = 'left' | 'received';

interface Props {
	direction: AssessmentDirection;
	users: User[];
	user: User;
	mark: Mark;
	subject: Subject;
}

export default function AssessmentComponent(props: Props): JSX.Element {
	const users: JSX.Element[] = props.users.map((user: User, index: number): JSX.Element => {
		const comma: string = (index + 1) !== props.users.length ? ', ' : '';
		return (
			<span key={ user._id }>
				<Link to={ `/assessments/${user.username}` }>
					{ getUserName(user) }
				</Link>
				{ comma }
			</span>
		);
	});

	return (
		<span>
			<strong>{ `${props.users.length} x ` }</strong>
			<SubjectComponent
				className="image"
				basic
				color={ markSettings[props.mark].color }
				subject={ props.subject }
			>
			</SubjectComponent>
			{ props.direction === 'left' ? 'from ' : 'to ' }
			{ users }
		</span>
	);
}
