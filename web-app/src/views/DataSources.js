
import React, { Component } from 'react';

import { Route, Link } from "react-router-dom";
import EditDataSource from './EditDataSource';

import axios from 'axios';


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
  };

  componentDidMount() {
    // Fetch all datasources
    this.fetchDataSources();
  }

  fetchDataSources = () => {
    axios.get('/ws/jdbcdatasource')
      .then(res => {
        const jdbcDataSources = res.data;
        this.setState({ 
          jdbcDataSources: jdbcDataSources 
        });
      });
  }

  

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
        this.onClose();
        this.fetchDataSources();
      });
  }

  update = (ds) => {
    console.log('update', ds);
    axios.put('/ws/jdbcdatasource', ds)
      .then(res => {
        this.fetchDataSources();
      });
  }

  delete = (id) => {
    console.log('delete', id);
    axios.delete('/ws/jdbcdatasource/' + id)
      .then(res => {
        this.fetchDataSources();
      });
  }

  render() {

    const jdbcDataSourceItems = this.state.jdbcDataSources.map((ds, index) => 
      <tr key={index}>
        <td>{ds.name}</td>
        <td>{ds.connectionUrl}</td>
        <td>{ds.type}</td>
        <td>{ds.username}</td>
        <td>{ds.ping}</td>
        <td><button onClick={() => this.update(ds)}>update</button></td>
        <td><button onClick={() => this.delete(ds.id)}>delete</button></td>
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
        <button onClick={this.showDrawer}>
          Add
        </button>
        <button>
          <Link to="/datasources/new">New</Link>
        </button>
        <button>
          <Link to="/datasources/edit/1">Edit</Link>
        </button>

        <div>
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
