import * as React from 'react';
import LoginForm from './login-form';

export default class App extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				<h1>Hello</h1>
				<LoginForm onSubmit={ (data) => console.log(data) }/>
			</div>
		);
	}
}
