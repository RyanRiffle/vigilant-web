import React from 'react';
import { LayerEdit, GeneralTable, ToolButton } from '../components';
import { Text, Box, Anchor, Heading, Button } from 'grommet';
import { Update, Add, Action, Trash, Sync } from 'grommet-icons';

const addPluginStructure = [
	{
		name: 'url',
		label: 'Git Repo URL'
	}
];

class ViewPlugins extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			plugins: [],
			newPlugins: [],
			layerVisible: false
		};

		this._fetchPlugins();
		this._fetchNewPlugins();

		this.structure = [
			{
				name: 'name',
				label: 'Name',
				type: 'text',
				value: '',
				search: true,
				render: (item) => {
					return (
						<Box>
							<Anchor label={item.name} color='#666666'/>
							<Text size='small'>{item.description}</Text>
						</Box>
					);
				}
			},
			{
				name: 'version',
				label: 'Version',
				type: 'text',
				value: ''
			},
			{
				name: 'downloaded',
				label: 'Status',
				type: 'text',
				search: true,
				render: (item) => {
					if (item.downloaded && !item.installed) {
						return (
							<Text>Downloaded</Text>
						);
					} else if (item.downloaded && item.installed) {
						return (
							<Text>Installed</Text>
						);
					}

					return (<Text>Unknown</Text>);
				}
			},
			{
				name: 'actions',
				label: 'Actions',
				type: 'text',
				render: (item) => {
					return (
						<Box direction='row'>
							<ToolButton icon={<Trash/>} pad='none' onClick={this._onDeleteClicked.bind(this, item)}/>
							<ToolButton icon={<Sync/>} pad='none' tooltip='Click Here!'/>
						</Box>
					);
				}
			}
		];
	}

	_onAddPlugin(values)
	{
		var cloneMessages = [
			'Cloning Repo',
			'Cloning Repo.',
			'Cloning Repo..',
			'Cloning Repo...',
			'Cloning Repo....'
		];

		var installMessages = [
			'Running npm install',
			'Running npm install.',
			'Running npm install..',
			'Running npm install...',
			'Running npm install....',
		];
		var message = 0;
		var messages = cloneMessages;

		var interval = setInterval(() => {
			message++;
			this.setState({layerMessage: messages[message % messages.length]});
		}, 500);

		window.vigilant.helpers.post('/plugin/createFromUrl', values)
			.then(res => {return res.json()})
			.then(json => {
				messages = installMessages;
				console.log(json);

				window.vigilant.helpers.post('/plugin/installDependencies', {id: json.id})
					.then(res => {return res.json()})
					.then(json => {
						console.log(json.output);
						this._closeLayer();
						this._fetchPlugins();
						this._fetchNewPlugins();

						clearInterval(interval);
					});
			});
	}

	_onDeleteClicked(item)
	{
		this._showLayer(
			'Delete ' + item.name + '?', 			//Title
			this._onDeletePlugin.bind(this, item),	//Submit Callback
			[],										//Form structure (just a button so no form)
			'status-critical',						//Button Color
			'This will remove the plugin from \
			the database and delete it from the disk. \
			Are you sure you want to delete '+item.name+'?');						
	}

	_onDeletePlugin(plugin)
	{
		window.vigilant.helpers.delete('/plugin/'+plugin.id)
		.then(res => {return res.json()})
		.then(json => {
			if (json.id) {
				this._fetchPlugins();
				this._fetchNewPlugins();
				this._closeLayer();
			}
		})
	}

	_onRefresh()
	{
		this._fetchPlugins();
		this._fetchNewPlugins();
	}

	_showLayer(title, successCallback, structure, buttonColor, message)
	{
		this.setState({layerStructure: structure});
		this.setState({layerSubmit: successCallback});
		this.setState({layerTitle: title});
		this.setState({buttonColor: buttonColor});
		this.setState({layerVisible: true});
		this.setState({layerMessage: message});
	}

	_closeLayer()
	{
		this.setState({layerVisible: false});
	}

	_fetchPlugins()
	{
		window.vigilant.helpers.fetch('/plugin/find')
			.then(res => {return res.json()})
			.then(json => {
				if (json.length) {
					json = json.map(item => {
						item.actions = 'placeholder';
						return item;
					})

					this.setState({plugins: json});
				}
			});
	}

	_fetchNewPlugins()
	{
		window.vigilant.helpers.fetch('/plugin/checkNewPlugins')
			.then(res => {return res.json()})
			.then(json => {
				if (json.length) {
					this.setState({newPlugins: json});
				}
			});
	}

	_onViewNewPlugins()
	{
		this.props.history.push('/ui/plugin/unloaded');
	}

	render()
	{
		return (
			<Box>
				<Box direction='row' alignContent='center' fill='horizontal'>
					<ToolButton
						icon={<Add/>}
						label={<Text>Add Plugin</Text>}
						onClick={this._showLayer.bind(this, 
														'Add Plugin', 
														this._onAddPlugin.bind(this), 
														addPluginStructure,
														undefined,
														'')}/>
					<ToolButton 
						icon={<Update/>}
						label={<Text>Refresh</Text>}
						onClick={this._onRefresh.bind(this, 'refresh')}/>
					{this.state.newPlugins.length > 0 && (
						<ToolButton
							icon={<Action color='neutral-4'/>}
							label={<Text color='neutral-4'>Unloaded Plugins</Text>}
							onClick={this._onViewNewPlugins.bind(this)}
							color='status-critical'/>
					)}
				</Box>
				<GeneralTable structure={this.structure} data={this.state.plugins}/>
				<LayerEdit
					visible={this.state.layerVisible} 
					structure={this.state.layerStructure}
					onSubmit={this.state.layerSubmit}
					label={this.state.layerTitle}
					onClose={this._closeLayer.bind(this)}
					buttonColor={this.state.buttonColor}
					message={this.state.layerMessage}/>
			</Box>
		);
	}
}

export default ViewPlugins;