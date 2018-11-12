import React from 'react';
import { Box, Button, Text } from 'grommet';

class ToolButton extends React.Component
{
	getLabel()
	{
		if (window.vigilant.config.toolButtonType.text) {
			return this.props.label;
		}

		return '';
	}

	getIcon()
	{
		if (window.vigilant.config.toolButtonType.icon) {
			return this.props.icon;
		}

		return '';
	}

	render()
	{
		return (
			<Box pad={this.props.pad || 'small'}>
				<Button plain onClick={this.props.onClick} icon={this.getIcon()} label={this.getLabel()}>
					{this.props.children}
				</Button> 
			</Box>
		);
	}
}

export default ToolButton;