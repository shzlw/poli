import React, { Component } from 'react';
import './App.css';

import { Route, Link } from "react-router-dom";
import { Menu } from 'antd';

import DataSources from './pages/DataSources';
import Dashboard from './pages/Dashboards';
import Users from './pages/Users';
import Test from './pages/Test';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'datasources'
    }
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  render() {
    return (
      <div className="app">
        <div className="nav">
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="datasources">
              <Link to="/datasources/">Data Sources</Link>
            </Menu.Item>
            <Menu.Item key="dashboards">
              <Link to="/dashboards/">Dashboards</Link>
            </Menu.Item>
            <Menu.Item key="users">
              <Link to="/users/">Users</Link>
            </Menu.Item>
            <Menu.Item key="test">
              <Link to="/test/">Test</Link>
            </Menu.Item>
          </Menu>
        </div>
        <div className="content">
          <Route path="/datasources" component={DataSources} />
          <Route path="/dashboards" component={Dashboard} />
          <Route path="/users" component={Users} />
          <Route path="/test" component={Test} />
        </div>
      </div>
    );
  }
}

export default App;
