
import React, { Component } from 'react';

import { Link } from "react-router-dom";
import axios from 'axios';
import * as webApi from '../api/WebApi';

class DataSources extends Component {

  state = { 
    visible: false,
    jdbcDataSources: [],
    mode: '',
    id: 0,
    name: '',
    connectionUrl: '',
    username: '',
    password: '',
    type: '',
    ping: '',
    showDrawer: false
  };

  componentDidMount() {
    // Fetch all datasources
    this.initData();
    
  }

  async initData() {
    const jdbcDataSources = await webApi.fetchDataSources();
    this.setState({ 
      jdbcDataSources: jdbcDataSources 
    });
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  save = (event) => {
    event.preventDefault();
    const ds = {
      connectionUrl: this.state.connectionUrl,
      username: this.state.username,
      password: this.state.password,
      name: this.state.name,
      type: this.state.password,
      ping: this.state.ping
    };

    axios.post('/ws/jdbcdatasource', ds)
      .then(res => {
        this.initData();
      });
  }

  update = (ds) => {
    console.log('update', ds);

    axios.put('/ws/jdbcdatasource', ds)
      .then(res => {
        this.initData();
      });
  }

  delete = (id) => {
    console.log('delete', id);
    axios.delete('/ws/jdbcdatasource/' + id)
      .then(res => {
        this.initData();
      });
  }

  ping = (id) => {
    axios.get(`/ws/jdbcdatasource/ping/${id}`)
      .then(res => {
        console.log('ping', res.data);
      });
  }

  showDrawer = (ds) => {
    if (ds !== null) {
      this.setState({
        id: ds.id,
        connectionUrl: ds.connectionUrl,
        username: ds.username,
        password: ds.password,
        name: ds.name,
        type: ds.type,
        ping: ds.ping
      });
    }
    
    this.setState(prevState => ({
      showDrawer: !prevState.showDrawer
    })); 
  }

  render() {

    const filterDrawerClass = this.state.showDrawer ? 'right-drawer display-block' : 'right-drawer display-none';

    const jdbcDataSourceItems = this.state.jdbcDataSources.map((ds, index) => 
      <tr key={index}>
        <td>{ds.name}</td>
        <td>{ds.connectionUrl}</td>
        <td>{ds.type}</td>
        <td>{ds.username}</td>
        <td>{ds.ping}</td>
        <td><button onClick={() => this.showDrawer(ds)}>update</button></td>
        <td><button onClick={() => this.delete(ds.id)}>delete</button></td>
        <td><button onClick={() => this.ping(ds.id)}>ping</button></td>
      </tr>
    );

    return (
      <div>
        <h1>Data Sources</h1>
        <div>
          <h2>Table</h2>

          <table>
            <thead>
            </thead>
            <tbody>
              {jdbcDataSourceItems}
            </tbody>
          </table>

        </div>
        <button onClick={() => this.showDrawer(null)}>
          Add
        </button>
        <button>
          <Link to="/datasources/new">New</Link>
        </button>
        <button>
          <Link to="/datasources/edit/1">Edit</Link>
        </button>

        <div className={filterDrawerClass}>
          <form>
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} />

            <label>Connection Url</label>
            <textarea
              row="3"
              type="text" 
              name="connectionUrl" 
              value={this.state.connectionUrl}
              onChange={this.handleInputChange} >
            </textarea>

            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              value={this.state.username}
              onChange={this.handleInputChange} />

            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={this.state.password}
              onChange={this.handleInputChange} />

            <label>Type</label>
            <input 
              type="text" 
              name="type" 
              value={this.state.type}
              onChange={this.handleInputChange} />

            <label>Ping</label>
            <input 
              type="text" 
              name="ping" 
              value={this.state.ping}
              onChange={this.handleInputChange} />
          </form>

          <div>
            <button onClick={this.save}>Save</button>
            <button onClick={this.ping}>Ping</button>
          </div>
        </div>
      </div>
    );
  }
}

export default DataSources;
