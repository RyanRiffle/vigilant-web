import React from 'react';
import { Box, Grid, Heading, Text, FormField, TextInput, Button } from 'grommet';
import { Alert } from 'grommet-icons';

class ViewLogin extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			email: '',
			password: '',
			showError: false,
			errorMessage: '',
		};
	}

	_onSubmit()
	{
		window.vigilant.helpers.fetch('/user/signIn', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
		    },
		    body: JSON.stringify({email: this.state.email, password: this.state.password})
		})
			.then(res => {return res.json()})
			.then(json => {
				console.log(json);
				if (json.code && json.code === 'E_INVALID_CREDENTIALS') {
					this.setState({showError: true, errorMessage: json.message});
				} else {
					if (json.user && json.user.email && json.user.id) {
						this.props.history.push('/');
					}
				}
			});
	}

	_onChange(name, ev)
	{
		var state = this.state;
		state[name] = ev.target.value;
		this.setState({...state});
	}

	render()
	{
		return (
			<Box fill={true} background='light-1' className='fullscreen'>
				<Grid
					columns={['3/4', '1/4']}
					rows={['flex']}
					fill={true}
					areas={[
						{ name: 'left', start: [0, 0], end: [0, 0] },
						{ name: 'right', start: [1, 0], end: [1, 0] }
					]}>

					<Box
						gridArea='left'
						fill={true}
						background='light-4'
						align='center'
						justify='center'>

						<Heading>Vigilant</Heading>
						<Text>Know the status of your services</Text>
					</Box>
					<Box
						gridArea='right'
						fill={true}>

						<Box
							tag='form'
							fill='vertical'
							overflow='auto'
							width='medium'
							pad='medium'>

							<Box flex='grow' overflow='auto' justify='center'>
								<Heading level={3} pad={{bottom: 'medium'}}>Login</Heading>

								{this.state.showError && (
									<Box pad='small' border background='neutral-5' margin='small'>
										<Text><Alert size='small'/> {this.state.errorMessage}</Text>
									</Box>
								)}
								<FormField label='Email'>
									<TextInput value={this.state.email} onChange={this._onChange.bind(this, 'email')}/>
								</FormField>
								<FormField label='Password'>
									<TextInput type='password' value={this.state.password} onChange={this._onChange.bind(this, 'password')}/>
								</FormField>
								<Box pad={{vertical: 'medium'}}>
									<Button label='Submit' onClick={this._onSubmit.bind(this)}/>
								</Box>
							</Box>
						</Box>
					</Box>
				</Grid>
			</Box>
		);
	}
}

export default ViewLogin;