
import React, { Component } from 'react';
import axios from 'axios';
import * as webApi from '../api/WebApi';
import Modal from '../components/Modal';
import './Datasource.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class DataSource extends Component {

  constructor(props) {
    super(props);
    this.state = {
      jdbcDataSources: [],
      showEditPanel: false,
      showUpdatePassword: false,
      id: null,
      name: '',
      connectionUrl: '',
      username: '',
      password: '',
      type: '',
      ping: ''
    };
  }

  get initialState() {
    return {
      showUpdatePassword: false,
      id: null,
      name: '',
      connectionUrl: '',
      username: '',
      password: '',
      type: '',
      ping: ''
    };
  }

  componentDidMount() {
    // Fetch all datasources
    this.fetchDataSources();
    
  }

  async fetchDataSources() {
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
    const {
      showUpdatePassword,
      id,
      connectionUrl,
      username,
      password,
      name,
      type,
      ping,
    } = this.state;

    let ds = {
      connectionUrl: connectionUrl,
      username: username,
      name: name,
      type: type,
      ping: ping
    };

    if (id !== null) {
      ds.id = id;
      if (showUpdatePassword) {
        ds.password = password;
      }

      // Update
      axios.put('/ws/jdbcdatasource', ds)
        .then(res => {
          this.fetchDataSources();
        });
    } else {
      ds.password = password;

      // New
      axios.post('/ws/jdbcdatasource', ds)
        .then(res => {
          this.closeEditPanel();
          this.fetchDataSources();
        });
    } 
  }

  delete = (id) => {
    console.log('delete', id);
    axios.delete('/ws/jdbcdatasource/' + id)
      .then(res => {
        this.fetchDataSources();
      });
  }

  ping = (id) => {
    axios.get(`/ws/jdbcdatasource/ping/${id}`)
      .then(res => {
        console.log('ping', res.data);
      });
  }

  clearEditPanel = () => {
    this.setState(this.initialState);
  }

  openEditPanel = (ds) => {
    if (ds !== null) {
      this.setState({
        showUpdatePassword: false,
        id: ds.id,
        connectionUrl: ds.connectionUrl,
        username: ds.username,
        password: ds.password,
        name: ds.name,
        type: ds.type,
        ping: ds.ping
      });
    } else {
      this.clearEditPanel();
    }
    
    this.setState({
      showEditPanel: true
    }); 
  }

  closeEditPanel = () => {
    this.setState({
      showEditPanel: false
    });
  }

  openDeletePanel = () => {

  }

  toggleUpdatePassword = () => {
    this.setState(prevState => ({
      showUpdatePassword: !prevState.showUpdatePassword
    })); 
  }

  render() {
    const { 
      showUpdatePassword,
      id,
      jdbcDataSources = []
    } = this.state;

    const jdbcDataSourceItems = jdbcDataSources.map((ds, index) => 
      <div key={index} className="datasource-card">
        <div className="datasource-card-title ellipsis">
          {ds.name}
        </div>
        <div>
          <button onClick={() => this.openEditPanel(ds)}>update</button>
          <button onClick={() => this.delete(ds.id)}>delete</button>
          <button onClick={() => this.ping(ds.id)}>ping</button>
        </div>
      </div>
    );

    let mode;
    let passwordInput = (
      <div>
        <label>Password</label>
        <input 
          type="password" 
          name="password" 
          value={this.state.password}
          onChange={this.handleInputChange} />
      </div>
    );
    if (id === null) {
      mode = 'New';
    } else {
      mode = 'Update';
      if (!showUpdatePassword) {
        passwordInput = (
          <button onClick={this.toggleUpdatePassword}>Update password</button>
        );
      }
    }

    return (
      <div>
        <input
          type="text"
          name="searchValue"
          placeholder="Datasource name..."
          />
        <div className="row">
          {jdbcDataSourceItems}
        </div>
        <button className="button" onClick={() => this.openEditPanel(null)}>
          <FontAwesomeIcon icon="plus" /> New datasource
        </button>

        <Modal 
          show={this.state.showEditPanel}
          onClose={this.closeEditPanel}
          modalClass={'small-modal-panel'}
          title={mode} >

          <div>
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
            
            {passwordInput}
            <br/>

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

            <button className="button"onClick={this.save}>Save</button>
          </div>

        </Modal>
      </div>
    );
  }
}

export default DataSource;
