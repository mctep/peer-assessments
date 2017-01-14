import * as React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export default function(): JSX.Element {
	return (
		<Dimmer page active>
			<Loader inverted size="big">
				Loading
			</Loader>
		</Dimmer>
	);
}

