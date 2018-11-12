import React from 'react';
import { Text, Box, Heading, Button } from 'grommet';

class ViewNewPlugins extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			plugins: []
		};

		this._fetchPlugins();
	}

	_fetchPlugins()
	{
		window.vigilant.helpers.fetch('/plugin/checkNewPlugins')
			.then(res => {return res.json()})
			.then(json => {
				this.setState({plugins: json});
			});
	}

	_addPlugin(plugin)
	{
		if (plugin.repository)
			delete plugin.repository;
		if (plugin.keywords)
			delete plugin.keywords;

		window.vigilant.helpers.post('/plugin', plugin)
			.then(res => {return res.json()})
			.then(json => {
				if (json.id) {
					this._fetchPlugins();
				}
			});
	}

	_onGoBack()
	{
		this.props.history.push('/ui/plugin');
	}

	renderPluginError(plugin)
	{
		if (!plugin.error)
			return;

		return (
			<Box>
				<Text size='medium' color='status-critical' margin={{top: 'medium'}}>{plugin.error}</Text>
				<Text size='medium' color='status-critical' margin={{top: 'medium'}}>
					Either the plugin is not a valid npm package, or the repo is still being cloned
				</Text>
			</Box>
		);
	}

	renderPluginDetails(plugin)
	{
		if (plugin.error)
			return;

		return (
			<Box>
				<Text size='small'><b>Description:</b> {plugin.description}</Text>
				<Text size='small'><b>Version:</b> {plugin.version}</Text>
				<Text size='small'><b>License:</b> {plugin.license}</Text>
				<Button 
					label='Add Plugin' 
					margin={{top: 'small'}} 
					color='neutral-4' 
					onClick={this._addPlugin.bind(this, plugin)}/>
			</Box>
		);
	}

	render()
	{
		if (!this.state.plugins.length) {
			return (
				<Box fill={true}>
					<Box align='center'>
						<Heading>All available plugins are loaded</Heading>
						<Button margin={{top: 'large'}} color='dark-5' border={true} plain={false} onClick={this._onGoBack.bind(this)}>
							<Box pad='small'>
								View Plugins
							</Box>
						</Button>
					</Box>
				</Box>
			);
		}

		return (
			<Box>
				<Box margin='medium'>
					<Button color='dark-1' border={true} onClick={this._onGoBack.bind(this)}>Back</Button>
				</Box>
				<Box direction='row'>
					{this.state.plugins && (
						this.state.plugins.map(plugin => {
							return (
								<Box border={true} pad='small' margin='small' key={plugin.name} width='medium'>
									<Heading level={4} margin={{top: 'none', bottom: 'none'}} flex={true}>
										{plugin.name}
									</Heading>
									{this.renderPluginError(plugin)}
									{this.renderPluginDetails(plugin)}
								</Box>
							);
						})
					)}
				</Box>
			</Box>
		);
	}
}

export default ViewNewPlugins;