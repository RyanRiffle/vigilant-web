import React from 'react';
import { Layer, Box, FormField, TextInput, CheckBox, Button, Heading, Text } from 'grommet';
import PropTypes from 'prop-types';
import ToolButton from './ToolButton';
import { FormClose } from 'grommet-icons';

class LayerEdit extends React.Component
{
	constructor(props)
	{
		super(props);

		if (!this.props.structure) {
			this.state = {
				values: {}
			};
			return;
		}

		var values = {};
		this.props.structure.map(item => {
			return values[item.name] = item.value;
		});

		this.state = {
			values: values,
			visible: this.props.visible || false
		};
	}

	componentDidUpdate(prevProps)
	{
		if (this.props.visible === false && prevProps.visible === true) {
			var values = {};

			Object.keys(this.state.values).map(key => {
				return values[key] = '';
			});

			this.setState({values: values});
		}
	}

	_onChange(name, ev)
	{
		var value = ev.target.value;
		value = value.toString();

		var values = {...this.state.values};
		values[name] = value;

		this.setState({values});
	}

	_onClose()
	{
		if (this.props.onClose)
			this.props.onClose();
	}

	_onSubmit()
	{
		if (this.props.onSubmit(this.state.values) === true) {
			this._onClose();
		}
	}

	renderTextBox(item)
	{
		return (
			<FormField label={item.label} key={item.name}>
				<TextInput value={this.state.values[item.name]} onChange={this._onChange.bind(this, item.name)}/>	
			</FormField>
		);
	}

	renderCheckBox(item)
	{
		return (
			<FormField label={item.label} key={item.name}>
				<CheckBox checked={this.parseCheckboxValue(this.state.values[item.name])} onChange={this._onChange.bind(this, item.name)}/>
			</FormField>
		);
	}

	parseCheckboxValue(val)
	{
		return (val === 'true' ? true : false);
	}

	render()
	{
		if (!this.props.visible) {
			return '';
		}

		return (
			<Layer
				position='right'
				full='vertical'
				modal
				onClickOutside={this._onClose.bind(this)}
				onEsc={this._onClose.bind(this)}>

				<Box pad={{top: 'medium', left: 'medium'}} direction='row'>
					<Heading level={3}>{this.props.label}</Heading>
					<ToolButton icon={<FormClose/>} onClick={this._onClose.bind(this)}/>
				</Box>
				<Box
					tag='form'
					fill='vertical'
					overflow='auto'
					width='medium'
					pad='medium'>

					<Box flex='grow' overflow='auto' pad={{vertical: 'medium'}}>
						{this.props.message && (
							<Text margin={{bottom: 'large'}}>{this.props.message}</Text>
						)}

						{this.props.structure.map(item => {
							switch(item.type) {
								case 'text':
									return this.renderTextBox(item);
								case 'checkbox':
									return this.renderCheckBox(item);
								case 'hidden':
									return '';
								default:
									return this.renderTextBox(item);
							}
						})}

						<Box pad={{vertical: 'medium'}}>
							<Button 
								label={this.props.buttonLabel || 'Submit'} 
								onClick={this._onSubmit.bind(this)}
								color={this.props.buttonColor || ''}/>
						</Box>
					</Box>
				</Box>
			</Layer>
		);
	}
}

LayerEdit.propTypes = {
	structure: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			label: PropTypes.string,
			type: PropTypes.oneOf(['text', 'checkbox']),
			value: PropTypes.string
		})
	),
	onSubmit: PropTypes.func.isRequired,
	onClose: PropTypes.func,
	label: PropTypes.string
};

export default LayerEdit;