import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { IMarks, Mark, allMarks } from '../../api/assessments';
import { Subject, SubjectId } from '../../api/subjects';
import SubjectsListSelectWithFilter from '../components/subjects-list/select-with-filter';
import MarkedSubjects from '../components/marked-subjects';
import withSubjects, { IWithSubjects } from '../hocs/with-subjects';

interface Props {
	marks: IMarks;
	onSubmit?: (data: IMarks) => void;
	defaultValue?: IMarks;
}

interface State {
	availableSubjects: Subject[];
	selectedSubjects: Subject[];
}

function filterSubjectsByIds(subjects: Subject[], ids: SubjectId[]): Subject[] {
	return subjects.filter((subject: Subject) =>
		ids.indexOf(subject._id) !== -1
	);
}

function filterUnmarkedSubjects(subjects: Subject[], marks: IMarks): Subject[] {
	const markedSubjectIds: SubjectId[] = Object.keys(marks)
	.reduce((result: SubjectId[], mark: Mark) => result.concat(marks[mark]), []);

	return subjects.filter((subject: Subject) =>
		markedSubjectIds.indexOf(subject._id) === -1
	);
}

class MarksForm extends React.Component<Props & IWithSubjects, State> {
	constructor(props: Props & IWithSubjects) {
		super(props);

		this.state = {
			selectedSubjects: [],
			availableSubjects: filterUnmarkedSubjects(this.props.subjects, this.props.marks)
		};
	}

	public componentWillReceiveProps(props: Props & IWithSubjects): void {
		if (this.props.subjects !== props.subjects) {
			this.setState({
				...this.state,
				availableSubjects: filterUnmarkedSubjects(props.subjects, props.marks)
			});
		}
	}

	private handleSubjectsSelect = (selectedSubjects: Subject[]): void => {
		this.setState({ ...this.state, selectedSubjects });
	}

	private handleAddSelectedSubjectButtonClick = (mark: Mark): void => {
		const selectedSubjectsIds: SubjectId[] = this.state.selectedSubjects
		.map((subj: Subject) => subj._id);

		const marks: IMarks = {
			...this.props.marks,
			[mark]: [].concat(this.props.marks[mark], selectedSubjectsIds)
		};

		this.props.onSubmit(marks);
	}

	private handleRemoveSubjectButtonClick = (mark: Mark, subject: Subject): void => {
		const marks: IMarks = {
			...this.props.marks,
			[mark]: this.props.marks[mark]
				.filter((id: SubjectId) => id !== subject._id)
		};

		this.props.onSubmit(marks);
	}

	private renderMark(mark: Mark): JSX.Element {
		const subjects: Subject[] = filterSubjectsByIds(
			this.props.subjects, this.props.marks[mark]
		);

		return (
			<li key={ mark }>
				<MarkedSubjects
					disabled={ !this.state.selectedSubjects.length }
					mark={ mark }
					subjects={ subjects }
					onAddSelectedSubjectsButtonClick={ this.handleAddSelectedSubjectButtonClick }
					onRemoveSubjectButtonClick={ this.handleRemoveSubjectButtonClick }
				/>
			</li>
		);
	}

	private renderMarks(): JSX.Element {
		const marks: JSX.Element[] = allMarks.map((mark: Mark) => this.renderMark(mark));
		return <ul>{ marks }</ul>;
	}

	public render(): JSX.Element {
		return (
			<Grid>
				<Grid.Column width="6">
					<SubjectsListSelectWithFilter
						subjects={ this.state.availableSubjects }
						onChange={ this.handleSubjectsSelect }
					/>
				</Grid.Column>
				<Grid.Column width="10">
					{ this.renderMarks() }
				</Grid.Column>
			</Grid>
		);
	}
}

export default withSubjects<Props, Props & IWithSubjects>(MarksForm);
