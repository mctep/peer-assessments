import * as React from 'react';
import { Label, Icon, LabelProps } from 'semantic-ui-react';

import { Subject } from '../../api/subjects';

type Colors = 'blue' | 'green' | 'olive' | 'yellow' | 'orange';

interface Props {
	subject: Subject;
	removable?: boolean;
	className?: string;
	basic?: boolean;
	color?: Colors;
	detail?: React.ReactNode;
	onRemoveButtonClick?: (subject: Subject) => void;
	children?: React.ReactNode;
}

export default class SubjectComponent extends React.Component<Props, void> {
	private handleRemoveButtonClick = (): void => {
		if (this.props.onRemoveButtonClick) {
			this.props.onRemoveButtonClick(this.props.subject);
		}
	}

	private renderRemoveButton(): JSX.Element {
		if (!this.props.removable) { return null; }
		return (
			<Icon
				name="close"
				onClick={ this.handleRemoveButtonClick }
			/>
		);
	}

	public render(): JSX.Element {
		const detail: JSX.Element = this.props.detail ? (
			<Label.Detail>
				{ this.props.detail }
			</Label.Detail>
		) : null;

		return (
			<Label
				basic={ this.props.basic }
				color={ this.props.color }
				className={ this.props.className }
			>
				{ this.props.subject.name }
				{ detail }
				{ this.props.children }
				{ this.renderRemoveButton() }
			</Label>
		);
	}
}
