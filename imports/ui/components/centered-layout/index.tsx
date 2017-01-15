import * as React from 'react';
import { Grid } from 'semantic-ui-react';

import './style.css';

interface Props {
	className?: string;
	children?: React.ReactNode[];
}

export default function CenteredLayout(props: Props): JSX.Element {
	return (
		<Grid className="centered-layout" textAlign="center" verticalAlign="middle">
			<Grid.Column className={ props.className }>
				{ props.children }
			</Grid.Column>
		</Grid>
	);
}
