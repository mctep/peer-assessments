import * as React from 'react';
import { Input, Divider } from 'semantic-ui-react';
import escapeRegexp = require('escape-string-regexp');
import { Subject } from '../../../api/subjects';
import SubjectsSelect, { Props as SubjectsSelectProps } from './select';

interface State {
	filter: string;
	subjects: Subject[];
}

export default class SubjectsSelectWithFilter extends React.Component<SubjectsSelectProps, State> {
	private static filterAvaliableSubjects(subjects: Subject[], filter: string): Subject[] {
		const reg: RegExp = new RegExp(`.*${escapeRegexp(filter.trim())}`);
		return subjects.filter((subject: Subject) =>
			reg.test(subject.name)
		);
	}

	constructor(props: SubjectsSelectProps) {
		super(props);

		this.state = {
			filter: '',
			subjects: props.subjects
		};
	}

	public componentWillReceiveProps(props: SubjectsSelectProps): void {
		if (props.subjects !== this.props.subjects) {
			this.filterAvaliableSubjects(props.subjects);
		}
	}

	public componentDidUpdate(props: SubjectsSelectProps, state: State): void {
		if (this.state.filter.trim() !== state.filter.trim()) {
			this.filterAvaliableSubjects(this.props.subjects);
		}
	}

	private filterAvaliableSubjects(allSubjects: Subject[]): void {
		const reg: RegExp = new RegExp(`.*${escapeRegexp(this.state.filter.trim())}`, 'i');
		const subjects: Subject[] = allSubjects
		.filter((subject: Subject) =>
			reg.test(subject.name)
		);

		this.setState({ ...this.state, subjects });
	}

	private handleInputChange = (e: React.FormEvent): void => {
		const filter: string = (e.target as HTMLInputElement).value;
		this.setState({ ...this.state, filter });
	}

	public render(): JSX.Element {
		return (
			<div>
				<Input
					placeholder="Filter Subjects"
					fluid
					type="text"
					onChange={ this.handleInputChange }
					value={ this.state.filter }
				/>
				<Divider />
				<SubjectsSelect
					subjects={ this.state.subjects }
					onChange={ this.props.onChange }
				/>
			</div>
		);
	}
}
