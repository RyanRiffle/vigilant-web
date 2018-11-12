import React from 'react';
import { LayerEdit, GeneralTable, ToolButton } from '../components';
import { Text, Box, Anchor } from 'grommet';
import { Update, Add, Trash} from 'grommet-icons';

class ViewHosts extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			layerVisible: false,
			hosts: []
		};

		this.structure = [
			{
				name: 'name',
				label: 'Name',
				type: 'text',
				value: '',
				search: true,
				render: (item) => {
					return (
						<Anchor label={item.name} color='#666666'/>
					);
				}
			},
			{
				name: 'dnsname',
				label: 'DNS Name',
				type: 'text',
				value: ''
			},
			{
				name: 'ipv4',
				label: 'IPv4 Address',
				type: 'text',
				value: ''
			},
			{
				name: 'ipv6',
				label: 'IPv6 Address',
				type: 'text',
				value: ''
			},
			{
				name: 'actions',
				label: 'Actions',
				type: 'hidden',
				render: (item) => {
					return (
						<ToolButton icon={<Trash/>} pad='none' onClick={this._onDeleteClicked.bind(this, item)}/>
					);
				}
			}
];

		this._fetchHosts();
	}

	_onAddHost(values)
	{
		window.vigilant.helpers.post('/host', values)
			.then(res => {
				return res.json()
			})
			.then(json => {
				if (!json.error) {
					json.actions = 'placeholder';
					this.setState({hosts: this.state.hosts.concat(json)});
					this.setState({layerVisible: false});
				}
			});
		return true;
	}

	_showLayer(type)
	{
		this.setState({layerVisible: true});
	}

	_closeLayer()
	{
		this.setState({layerVisible: false});
	}

	_fetchHosts(type)
	{
		window.vigilant.helpers.fetch('/host/find')
			.then(res => {return res.json()})
			.then(json => {
				function sort(a, b) {
					return a.name.localeCompare(b.name);
				}

				for (var i = 0; i < json.length; i++) {
					json[i].actions = 'placeholder';
				}

				if (!json.error) {
					this.setState({hosts: json.sort(sort)});
				}
			});
	}

	_onDeleteClicked(item)
	{
		window.vigilant.helpers.delete('/host/' + item.id)
			.then(res => {return res.json()})
			.then(json => {
				this._closeLayer();
				this._fetchHosts();
			});
	}

	render()
	{
		return (
			<Box>
				<Box direction='row' alignContent='center' fill='horizontal'>
					<ToolButton 
						icon={<Add/>}
						label={<Text>Add Host</Text>}
						onClick={this._showLayer.bind(this, 'add')}/>
					<ToolButton 
						icon={<Update/>}
						label={<Text>Refresh</Text>}
						onClick={this._fetchHosts.bind(this, 'refresh')}/>
				</Box>
				<GeneralTable structure={this.structure} data={this.state.hosts}/>
				<LayerEdit
					visible={this.state.layerVisible}
					structure={this.structure}
					onSubmit={this._onAddHost.bind(this)}
					label='Add Host'
					onClose={this._closeLayer.bind(this)}/>
			</Box>
		);
	}
}

export default ViewHosts;