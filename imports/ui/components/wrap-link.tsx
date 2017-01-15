import * as React from 'react';
import { MenuItemProps } from 'semantic-ui-react';
import { Link, IndexLink } from 'react-router';

export default function wrapLink(to: string, link?: typeof Link): (props: MenuItemProps) => JSX.Element {
	const Component: typeof Link = link || Link;
	return (props: MenuItemProps): JSX.Element => (
		<Component to={ to } className={ props.className } activeClassName="active">
			{ props.children }
		</Component>
	);
}
