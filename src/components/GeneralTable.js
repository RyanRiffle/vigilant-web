import React from 'react';
import { DataTable, Text } from 'grommet';
import PropTypes from 'prop-types';

class GeneralTable extends React.Component
{
	constructor(props)
	{
		super(props);

		if (!this.props.structure) {
			this.state = {
				values: {},
				visible: this.props.visible || true
			};
			return;
		}

		var values = {};
		this.columns = [];
		this.props.structure.map(item => {
			values[item.name] = item.value;
			this.columns.push({
				property: item.name,
				header: <Text>{item.label}</Text>,
				render: item.render || null,
				search: item.search || true
			});
			return item;
		});

		this.state = {
			values: values,
			visible: this.props.visible || true
		};
	}

	render()
	{
		if (!this.state.visible)
			return '';

		return (
			<DataTable columns={this.columns} data={this.props.data} size='medium'/>	
		);
	}
}

GeneralTable.propTypes = {
	structure: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			label: PropTypes.string,
			type: PropTypes.oneOf(['text', 'checkbox']),
			value: PropTypes.string,
			search: PropTypes.bool,
			render: PropTypes.func
		})
	)
};

export default GeneralTable;