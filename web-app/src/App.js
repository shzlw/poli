import React, { Component } from 'react';
import './App.css';

import { Route, Link } from "react-router-dom";
import { Menu } from 'antd';

import DataSources from './pages/DataSources';
import Workbooks from './pages/Workbooks';
import EditDataSource from './pages/EditDataSource';



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
            <Menu.Item key="workbooks">
              <Link to="/workbooks/">Workbooks</Link>
            </Menu.Item>
          </Menu>
        </div>
        <div className="content">
          <Route path="/datasources" component={DataSources} />
          <Route path="/datasources/new" component={EditDataSource} />
          <Route path="/datasources/edit/:id" component={EditDataSource} />
          <Route path="/workbooks" component={Workbooks} />
        </div>
      </div>
    );
  }
}

export default App;
