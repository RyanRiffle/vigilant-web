import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Button, Grid, Text, DropButton } from 'grommet';
import { LoadingScreen } from '../components';
import { User } from 'grommet-icons';

class LayoutDefault extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = { sidebar: true, header: false, pageTitle: '', isLoading: true};

		this.props.history.listen((location, action) => {
			this.setPageTitle(location);
		});

		this.verifyLoggedIn();
	}

	/*
	 * verifyLoggedIn()
	 * 
	 * Displays a loading screen while checking that the user is logged in
	 * if the user is logged in it shows the sidebar, and hides the loading
	 * overlay. Otherwise it hides the overlay and sidebar and redirects to the login route.
	 */
	verifyLoggedIn(redirect)
	{
		var self = this;
		if (redirect === undefined) {
			redirect = true;
		}
		window.vigilant.helpers.fetch('/user/isLoggedIn')
			.then(res => {return res.json()})
			.then(json => {
				if (json.loggedIn === false) {
					self.setState({sidebar: false});
					self.setState({isLoading: false});
					if (redirect)
						self.props.history.push("/ui/login");
					
				} else if (json.loggedIn === true) {
					self.setState({isLoading: false});
					self.setState({isLoggedIn: true});
					self.setState({header: true});
					self.setState({sidebar: true});
				}
			});
	}

	componentDidMount()
	{
		this.setPageTitle(this.props.history.location);
	}

	logout()
	{
		window.vigilant.helpers.fetch('/user/logout')
			.then(res => {return res.json()})
			.then(json => {
				this.props.history.push('/ui/login');
			});
	}

	setPageTitle(location)
	{
		for (var i = 0; i < this.props.sidebarItems.length; i++) {
			if (this.props.sidebarItems[i].href === location.pathname) {
				this.setState({pageTitle: this.props.sidebarItems[i].text});
			}
		}
	}

	sidebarLinkClicked(href)
	{
		this.props.history.push(href);
	}

	render()
	{
		return (
			<Grid
				fill={true}
				rows={['50px', 'flex']}
				columns={['auto', 'flex']}
				areas={[
					{ name: 'header', start: [0, 0], end: [1, 0] },
					{ name: 'sidebar', start: [0, 1], end: [0, 1] },
					{ name: 'main', start: [1, 1], end: [1, 1] }
				]}>
				{this.state.header && (
					<Box 
						gridArea='header'
						direction='row'
						align='center'
						justify='between'
						pad={{horizontal: 'medium', vertical: 'small'}}
						background='dark-2'>

						<Grid
							fill={true}
							rows={['flex']}
							columns={['small', 'flex', 'small']}
							areas={[
								{ name: 'appName', start: [0, 0], end: [0, 0]},
								{ name: 'pageTitle', start: [1, 0], end: [1, 0]},
								{ name: 'buttons', start: [2, 0], end: [2, 0]}
							]}>

							<Button gridArea='appName' onClick={() => this.setState({ sidebar: !this.state.sidebar })}>
								<Text size='large'>Vigilant</Text>
							</Button>
							<Box gridArea='pageTitle' margin={{left: 'small'}}>
								{this.state.pageTitle}
							</Box>
							<Box gridArea='buttons' direction='row' margin={{right: 'xlarge'}}>
								<Box flex={true}/>
								<DropButton
									plain
									label={<User align='center'/>}
									open={this.state.open}
									onClose={() => this.setState({ open: undefined })}
									dropContent={
										<Box>
											<Box pad='small'>
												<Text>username</Text>
											</Box>
											<Button hoverIndicator focusIndicator={false} plain onClick={this.logout.bind(this)}>
												<Box pad={{top: 'small', bottom: 'small', left: 'xlarge', right: 'xlarge'}}>
													Logout
												</Box>
											</Button>
										</Box>
									}/>
							</Box>
						</Grid>
					</Box>
				)}

				{this.state.sidebar && (
					<Box
						gridArea='sidebar'
						direction='column'
						width='small'
						background='dark-5'
						animation={[
							{ type: "fadeIn", duration: 300 },
							{ type: "slideRight", size: "xlarge", duration: 150 }
						]}>
						{this.props.sidebarItems.map(item => {
							if (item.visible === false)
								return;

							return (
								<Button key={item.text} hoverIndicator focusIndicator={false} plain onClick={this.sidebarLinkClicked.bind(this, item.href)}>
									<Box pad='small' direction='row' align='center'>
										{item.text}
									</Box>
								</Button>
							);
						})}
					</Box>
				)}

				<Box
					flex={true}
					margin='medium'>
					{this.props.children}
				</Box>

				{this.state.isLoading && (
					<LoadingScreen/>
				)}
			</Grid>
		);
	}
}

LayoutDefault.propTypes = {
	sidebarItems: PropTypes.array,
	pageTitle: PropTypes.string
};

export default withRouter(LayoutDefault);