import * as React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export default function(): JSX.Element {
	return (
		<Dimmer page active inverted>
			<Loader size="big">
				Loading
			</Loader>
		</Dimmer>
	);
}

