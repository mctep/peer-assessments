import * as React from 'react';

import { Subject } from '../../api/subjects';

interface Props {
	subject: Subject;
	removable?: boolean;
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
			<button type="button" onClick={ this.handleRemoveButtonClick }>
				Remove
			</button>
		);
	}

	public render(): JSX.Element {
		return (
			<div>
				{ this.props.subject.name }
				{ this.renderRemoveButton() }
			</div>
		);
	}
}
