import * as React from 'react';
import { Link } from 'react-router';
import LogoutButton from '../logout-button';

export default class IndexPage extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				index
				<LogoutButton />
			</div>
		);
	}
}
