import * as React from 'react';
import {
	Segment,
	Card,
	Button,
	Divider,
	Label,
	ButtonProps,
	Rating
} from 'semantic-ui-react';

import * as cn from 'classnames';

import { Subject } from '../../../api/subjects';
import { Mark } from '../../../api/assessments';
import SubjectList from './../subjects-list';

import markSettings, { MarkSetting } from '../mark-settings';
import './style.css';

interface Props {
	mark: Mark;
	subjects: Subject[];
	disabled?: boolean;
	onAddSelectedSubjectsButtonClick?: (mark: Mark) => void;
	onRemoveSubjectButtonClick?: (mark: Mark, subject: Subject) => void;
}

export default class MarkedSubjects extends React.Component<Props, void> {
	private handleAddSelectedSubjectsButtonClick = (): void => {
		if (this.props.onAddSelectedSubjectsButtonClick) {
			this.props.onAddSelectedSubjectsButtonClick(this.props.mark);
		}
	}

	private handleRemoveSubject = (subject: Subject): void => {
		if (this.props.onRemoveSubjectButtonClick) {
			this.props.onRemoveSubjectButtonClick(this.props.mark, subject);
		}
	}

	private renderLabel(): JSX.Element {
		const markSetting: MarkSetting = markSettings[this.props.mark];
		const disabled: boolean = this.props.disabled;

		return (
			<Label
				ribbon
				as="label"
				color={ markSetting.color }
				className={ cn('marked-subjects__label', { disabled }) }
			>
				<button
					className="marked-subjects__button"
					disabled={ disabled }
					type="button"
					onClick={ this.handleAddSelectedSubjectsButtonClick }
				/>
				{ markSetting.title }
			</Label>
		);
	}

	private renderSubjects(): JSX.Element {
		if (!this.props.subjects.length) { return null; }

		return (
			<div>
				<Divider />
				<SubjectList
					subjects={ this.props.subjects }
					removable
					onRemove={ this.handleRemoveSubject }
				/>
			</div>
		);
	}

	public render(): JSX.Element {
		return (
			<Segment>
				{ this.renderLabel() }
				{ this.renderSubjects() }
			</Segment>
		);
	}
}
