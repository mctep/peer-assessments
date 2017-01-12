import { IRouter } from 'react-router';
import * as React from 'react';

declare module 'react-router' {
	export function withRouter<P>(comp: React.ComponentClass<P & { router: IRouter }>): React.ComponentClass<P>;
}
