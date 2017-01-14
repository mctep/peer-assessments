import * as React from 'react';
import { IndexLink } from 'react-router';
import * as cn from 'classnames';
import './style.css';

interface Props {
	className?: string;
}

export default function Logotype(props: Props): JSX.Element {
	return (
		<span className={ cn('logotype', props.className) }>
			<span className="logotype__first-word">
				Pe<span className="logotype__major-letter">e</span>r
			</span>
			<span className="logotype__second-word">
				Ass<span className="logotype__major-letter">e</span>ssments
			</span>
		</span>
	);
}
