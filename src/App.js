import React, { Component } from 'react';
import { Grommet } from 'grommet';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { LayoutDefault } from './layouts';
import { v1 } from 'grommet-theme-v1';
import { ViewDashboard, ViewHosts, ViewPlugins,
         ViewSettings, ViewLogin, ViewServices,
         ViewNewPlugins } from './views';

window.vigilant = {
  config: require('./config')[process.env.NODE_ENV],
  helpers: require('./helpers')
};

const sidebarItems = [
  {
    text: 'Dashboard',
    href: '/'
  },
  {
    text: 'Hosts',
    href: '/ui/host'
  },
  {
    text: 'Plugins',
    href: '/ui/plugin'
  },
  {
    text: 'Services',
    href: '/ui/service'
  },
  {
    text: 'Settings',
    href: '/ui/setting'
  },
  {
    text: 'Unloaded Plugins',
    href: '/ui/plugin/unloaded',
    visible: false
  }
];

class App extends Component 
{
  render()
  {
    return (
      <Router>
        <Grommet theme={v1} full={true}>
          <LayoutDefault sidebarItems={sidebarItems}>
            <Route path='/ui/login' component={ViewLogin}/>
            <Route exact path='/' component={ViewDashboard}/>
            <Route path='/ui/host' component={ViewHosts}/>
            <Route exact path='/ui/plugin' component={ViewPlugins}/>
            <Route path='/ui/plugin/unloaded' component={ViewNewPlugins}/>
            <Route path='/ui/setting' component={ViewSettings}/>
            <Route path='/ui/service' component={ViewServices}/>
          </LayoutDefault>
        </Grommet>
      </Router>
    );
  }
}

export default App;
     