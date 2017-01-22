import * as React from 'react';
import { Input, Button, ButtonProps } from 'semantic-ui-react';

const ButtonPatched: React.ComponentClass<ButtonProps & { title?: string }> = Button;

const PASSWORD_LENGTH_DEFAULT: number = 12;
const PASSWORD_CHARS_DEFAULT: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_!#+/';
function getRandomPassword(
	length: number = PASSWORD_LENGTH_DEFAULT,
	chars: string = PASSWORD_CHARS_DEFAULT
): string {
	let password: string = '';

	while (length > 0) {
		password += chars[Math.ceil(Math.random() * chars.length)];
		length -= 1;
	}

	return password;
}

interface Props {
	disabled?: boolean;
	onChange?: (password: string) => void;
}

interface State {
	value: string;
}

export default class PasswordInput extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = { value: '' };
	}

	private componentDidUpdate(props: Props, state: State): void {
		if (this.props.onChange && this.state.value !== state.value) {
			this.props.onChange(this.state.value);
		}
	}

	private handleInputChange = (e: React.FormEvent): void => {
		const value: string = (e.target as HTMLInputElement).value;
		this.setState({
			...this.state,
			value
		});
	}

	private handleGeneratePasswordClick = (): void => {
		this.setState({
			...this.state,
			value: getRandomPassword()
		});
	}

	public render(): JSX.Element {
		const action: JSX.Element = (
			<ButtonPatched
				type="button"
				icon="setting"
				title="Genearate Password"
				onClick={ this.handleGeneratePasswordClick }
			/>
		);

		return (
			<Input
				disabled={ this.props.disabled }
				type="text"
				name="password"
				value={ this.state.value }
				onChange={ this.handleInputChange }
				action={ action }
			/>
		);
	}
}
