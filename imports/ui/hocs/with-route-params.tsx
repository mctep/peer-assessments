import * as React from 'react';

interface RouterProps {
	routeParams: {};
}

type ComponentConstructor<P> = React.ComponentClass<P> | React.StatelessComponent<P>;

export default function withRouteParams<P>(Comp: ComponentConstructor<P>): ComponentConstructor<P & RouterProps> {
		return (props: RouterProps): JSX.Element => <Comp { ...props.routeParams } />;
	}
