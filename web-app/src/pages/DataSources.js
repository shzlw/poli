
import React, { Component } from 'react';

import { Drawer, Button } from 'antd';
import { Link } from "react-router-dom";

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
        <Button type="primary" onClick={this.showDrawer}>
          Add
        </Button>
        <Button type="primary">
          <Link to="/datasources/edit/1">Edit</Link>
        </Button>
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
