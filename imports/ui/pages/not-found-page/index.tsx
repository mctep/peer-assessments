import * as React from 'react';
import { IndexLink } from 'react-router';
import { Header, Icon } from 'semantic-ui-react';
import Logotype from '../../components/logotype';
import CenteredLayout from '../../components/centered-layout';
import './style.css';

export default function NotFoundPage(): JSX.Element {
	return (
		<CenteredLayout>
			<Header as="h1">
				<IndexLink to="/">
					<Logotype />
				</IndexLink>
			</Header>
			<Header as="h1">
				<span className="page-not-found__message">
					Page Not Found
					<Icon className="page-not-found__icon" name="hand peace"/>
				</span>
			</Header>
		</CenteredLayout>
	);
}
