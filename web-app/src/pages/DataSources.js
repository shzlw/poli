
import React, { Component } from 'react';

import { Drawer } from 'antd';
import { Route, Link } from "react-router-dom";
import EditDataSource from './EditDataSource';


class DataSources extends Component {

  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div>
        <h1>Data Sources</h1>
        <button onClick={this.showDrawer}>
          Add
        </button>
        <button>
          <Link to="/datasources/new">New</Link>
        </button>
        <button>
          <Link to="/datasources/edit/1">Edit</Link>
        </button>

        <Route path="/datasources/new" component={EditDataSource} />
        <Route path="/datasources/edit/:id" component={EditDataSource} />

        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={500}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </div>
    );
  }
}

export default DataSources;
