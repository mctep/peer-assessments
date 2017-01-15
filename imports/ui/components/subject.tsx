import * as React from 'react';
import { Label, Icon } from 'semantic-ui-react';

import { Subject } from '../../api/subjects';

interface Props {
	subject: Subject;
	removable?: boolean;
	className?: string;
	active?: boolean;
	onRemoveButtonClick?: (subject: Subject) => void;
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
		return (
			<Label
				basic={ !this.props.active }
				color={ this.props.active ? 'blue' : null }
				className={ this.props.className }
			>
				{ this.props.subject.name }
				{ this.renderRemoveButton() }
			</Label>
		);
	}
}
