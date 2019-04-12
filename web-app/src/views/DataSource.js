
import React, { Component } from 'react';
import axios from 'axios';
import * as webApi from '../api/WebApi';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import './Datasource.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class DataSource extends Component {

  constructor(props) {
    super(props);
    this.state = {
      jdbcDataSources: [],
      showEditPanel: false,
      showConfirmDeletionPanel: false,
      objectToDelete: {},
      showUpdatePassword: false,
      searchValue: '',
      id: null,
      name: '',
      connectionUrl: '',
      driverClassName: '',
      username: '',
      password: '',
      ping: ''
    };
  }

  get initialState() {
    return {
      showUpdatePassword: false,
      id: null,
      name: '',
      connectionUrl: '',
      driverClassName: '',
      username: '',
      password: '',
      ping: ''
    };
  }

  componentDidMount() {
    this.fetchDataSources();
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async fetchDataSources() {
    const jdbcDataSources = await webApi.fetchDataSources();
    this.setState({ 
      jdbcDataSources: jdbcDataSources 
    });
  }

  save = () => {
    const {
      showUpdatePassword,
      id,
      connectionUrl,
      driverClassName,
      username,
      password,
      name,
      ping,
    } = this.state;

    if (!name) {
      return;
    }

    let ds = {
      connectionUrl: connectionUrl,
      driverClassName: driverClassName,
      username: username,
      name: name,
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
          this.closeEditPanel();
          this.fetchDataSources();
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      ds.password = password;

      // New
      axios.post('/ws/jdbcdatasource', ds)
        .then(res => {
          this.closeEditPanel();
          this.fetchDataSources();
        })
        .catch(error => {
          console.log(error);
        });
    } 
  }

  ping = (id) => {
    axios.get(`/ws/jdbcdatasource/ping/${id}`)
      .then(res => {
        const result = res.data;
        Toast.show(result);
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
        driverClassName: ds.driverClassName,
        username: ds.username,
        password: ds.password,
        name: ds.name,
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

  confirmDelete = () => {
    const { 
      objectToDelete = {} 
    } = this.state;
    axios.delete('/ws/jdbcdatasource/' + objectToDelete.id)
      .then(res => {
        this.fetchDataSources();
        this.closeConfirmDeletionPanel();
      });
  }

  openConfirmDeletionPanel = (datasource) => {
    this.setState({
      objectToDelete: datasource,
      showConfirmDeletionPanel: true
    });
  }

  closeConfirmDeletionPanel = () => {
    this.setState({
      objectToDelete: {},
      showConfirmDeletionPanel: false
    });
  }

  toggleUpdatePassword = () => {
    this.setState(prevState => ({
      showUpdatePassword: !prevState.showUpdatePassword
    })); 
  }

  clearSearch = () => {
    this.setState({
      searchValue: ''
    });
  }

  render() {
    const { 
      showUpdatePassword,
      showConfirmDeletionPanel,
      searchValue,
      id,
      jdbcDataSources = [],
      objectToDelete = {}
    } = this.state;

    const mode = id === null ? 'New' : 'Edit';

    const jdbcDataSourceItems = [];
    for (let i = 0; i < jdbcDataSources.length; i++) {
      const ds = jdbcDataSources[i];
      const name = ds.name;
      if (!searchValue || (searchValue && name.includes(searchValue))) {
        jdbcDataSourceItems.push(
          (
            <div key={i} className="datasource-card row">
              <div className="float-left ellipsis datasource-row-name">
                {name}
              </div>
              <div className="float-right">
                <button className="icon-button datasource-icon-button" onClick={() => this.openEditPanel(ds)}>
                  <FontAwesomeIcon icon="edit" size="lg" />
                </button>
                <button className="icon-button datasource-icon-button" onClick={() => this.openConfirmDeletionPanel(ds)}>
                  <FontAwesomeIcon icon="trash-alt" size="lg" />
                </button>
                <button className="icon-button datasource-icon-button" onClick={() => this.ping(ds.id)}>
                  <FontAwesomeIcon icon="plug" size="lg" />
                </button>
              </div>
            </div>
          )
        )
      }
    }

    return (
      <div>
        <div>
          <input
            type="text"
            name="searchValue"
            value={this.state.searchValue}
            onChange={this.handleInputChange}
            placeholder="Search..."
            style={{width: '200px'}}
            className="float-left"
            />
          <button className="button float-left" onClick={this.clearSearch}>Clear</button>
          <button className="button float-left" onClick={() => this.openEditPanel(null)}>
            <FontAwesomeIcon icon="plus" /> New datasource
          </button>
          </div>
        <div className="table-panel">
          {jdbcDataSourceItems}
        </div>

        <Modal 
          show={this.state.showEditPanel}
          onClose={this.closeEditPanel}
          modalClass={'small-modal-panel'}
          title={mode} >

          <div className="form-panel">
            <label>Name <span className="required">*</span></label>
            <input 
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} />

            <label>Connection Url</label>
            <textarea
              rows="4"
              type="text" 
              name="connectionUrl" 
              value={this.state.connectionUrl}
              onChange={this.handleInputChange} >
            </textarea>

            <label>Driver class name</label>
            <input 
              type="text" 
              name="driverClassName" 
              value={this.state.driverClassName}
              onChange={this.handleInputChange} />

            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              value={this.state.username}
              onChange={this.handleInputChange} />
            
            { mode === 'Edit' ? 
              (
                <div style={{margin: '3px 0px 8px 0px'}}>
                  <button className="button" onClick={this.toggleUpdatePassword}>Update password</button>
                </div>
              ) : null
            }
            { mode === 'New' || showUpdatePassword ? 
              (
                <div>
                  <label>Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={this.state.password}
                    onChange={this.handleInputChange} />
                </div>
              ) : null
            }

            <label className="form-label" className="mt-3">Ping</label>
            <input 
              type="text" 
              name="ping" 
              value={this.state.ping}
              onChange={this.handleInputChange} />
            <button className="button mt-3" onClick={this.save}>Save</button>
          </div>
        </Modal>

        <Modal 
          show={showConfirmDeletionPanel}
          onClose={this.closeConfirmDeletionPanel}
          modalClass={'small-modal-panel'}
          title={'Confirm Deletion'} >
          <div className="confirm-deletion-panel">
            Are you sure you want to delete {objectToDelete.name}?
          </div>
          <button className="button" onClick={this.confirmDelete}>Delete</button>
        </Modal>
      </div>
    );
  }
}

export default DataSource;
