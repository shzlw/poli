
import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Modal from '../components/Modal/Modal';
import SearchInput from '../components/SearchInput/SearchInput';

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

  fetchDataSources() {
    axios.get('/ws/jdbcdatasources')
      .then(res => {
        const jdbcDataSources = res.data;
        this.setState({ 
          jdbcDataSources: jdbcDataSources 
        });
      });
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleNameInputChange = (name, value) => {
    this.setState({
      [name]: value
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
      toast.error('Enter a name.');
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
      if (showUpdatePassword && password) {
        ds.password = password;
      }

      // Update
      axios.put('/ws/jdbcdatasources', ds)
        .then(res => {
          this.closeEditPanel();
          this.fetchDataSources();
        })
        .catch(error => {
          toast.error('The name exists. Try another.');
        });
    } else {
      ds.password = password;

      axios.post('/ws/jdbcdatasources', ds)
        .then(res => {
          this.closeEditPanel();
          this.fetchDataSources();
        })
        .catch(error => {
          toast.error('The name exists. Try another.');
        });
    } 
  }

  ping = (id) => {
    axios.get(`/ws/jdbcdatasources/ping/${id}`)
      .then(res => {
        const result = res.data;
        if (result === 'success') {
          toast.success('Ping Succeeded');
        } else {
          toast.error(result);
        }
      });
  }

  clearEditPanel = () => {
    this.setState(this.initialState);
  }

  openEditPanel = (ds) => {
    this.clearEditPanel();
    if (ds !== null) {
      this.setState({
        showUpdatePassword: false,
        id: ds.id,
        connectionUrl: ds.connectionUrl,
        driverClassName: ds.driverClassName,
        username: ds.username,
        name: ds.name,
        ping: ds.ping
      });
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
    axios.delete('/ws/jdbcdatasources/' + objectToDelete.id)
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

  render() {
    const { t } = this.props;

    const { 
      showUpdatePassword,
      id,
      jdbcDataSources = [],
      searchValue,
      showConfirmDeletionPanel,
      objectToDelete = {}
    } = this.state;

    const mode = id === null ? 'New' : 'Edit';

    const jdbcDataSourceItems = [];
    for (let i = 0; i < jdbcDataSources.length; i++) {
      const ds = jdbcDataSources[i];
      const { 
        id,
        name 
      } = ds;
      if (!searchValue || (searchValue && name.includes(searchValue))) {
        jdbcDataSourceItems.push(
          (
            <div key={id} className="card float-left">
              <div className="card-header ellipsis">
                {name}
              </div>
              <div className="card-content"></div>
              <div className="card-footer row">
                <div className="float-right">
                  <button className="icon-button card-icon-button" onClick={() => this.openEditPanel(ds)}>
                    <FontAwesomeIcon icon="edit"  />
                  </button>
                  <button className="icon-button card-icon-button" onClick={() => this.openConfirmDeletionPanel(ds)}>
                    <FontAwesomeIcon icon="trash-alt"  />
                  </button>
                  <button className="icon-button card-icon-button" onClick={() => this.ping(ds.id)}>
                    <FontAwesomeIcon icon="plug"  />
                  </button>
                </div>
              </div>
            </div>
          )
        )
      }
    }

    return (
      <div className="full-page-content">
        <div class="row">
          <div className="float-left" style={{lineHeight: '33px', fontWeight: 700, marginRight: '15px'}}>
            {t('Data Source')}
          </div>
          <button className="button float-left" style={{marginRight: '5px'}} onClick={() => this.openEditPanel(null)}>
            <FontAwesomeIcon icon="plus" /> {t('New')}
          </button>
          <div className="float-left">
            <SearchInput 
              name={'searchValue'} 
              value={this.state.searchValue} 
              onChange={this.handleNameInputChange} 
              inputWidth={200}
            />
          </div>
        </div>
        <div className="row" style={{marginTop: '8px'}}>
          {jdbcDataSourceItems}
        </div>

        <Modal 
          show={this.state.showEditPanel}
          onClose={this.closeEditPanel}
          modalClass={'small-modal-panel'}
          title={t(mode)} >

          <div className="form-panel">
            <label>{t('Name')} <span className="required">*</span></label>
            <input 
              className="form-input"
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} 
            />

            <label>{t('Connection Url')}</label>
            <textarea
              className="form-input"
              rows="4"
              type="text" 
              name="connectionUrl" 
              value={this.state.connectionUrl}
              onChange={this.handleInputChange} >
            </textarea>

            <label>{t('Driver Class Name')}</label>
            <input 
              className="form-input"
              type="text" 
              name="driverClassName" 
              value={this.state.driverClassName}
              onChange={this.handleInputChange} 
            />

            <label>{t('Username')}</label>
            <input 
              className="form-input"
              type="text" 
              name="username" 
              value={this.state.username}
              onChange={this.handleInputChange} 
            />
            
            { mode === 'Edit' && (
              <div style={{margin: '3px 0px 8px 0px'}}>
                <button className="button" onClick={this.toggleUpdatePassword}>{t('Change Password')}</button>
              </div>
            )}

            { (mode === 'New' || showUpdatePassword) && ( 
              <div>
                <label>{t('New Password')}</label>
                <input 
                  className="form-input"
                  type="password" 
                  name="password" 
                  value={this.state.password}
                  onChange={this.handleInputChange} 
                />
              </div>
            )}

            <label>{t('Ping')}</label>
            <input 
              className="form-input"
              type="text" 
              name="ping" 
              value={this.state.ping}
              onChange={this.handleInputChange} 
            />
            <button className="button mt-3 button-green" onClick={this.save}>
              <FontAwesomeIcon icon="save"  fixedWidth /> {t('Save')}
            </button>
          </div>
        </Modal>

        <Modal 
          show={showConfirmDeletionPanel}
          onClose={this.closeConfirmDeletionPanel}
          modalClass={'small-modal-panel'}
          title={t('Confirm Deletion')} >
          <div className="confirm-deletion-panel">
            {t('Are you sure you want to delete')} {objectToDelete.name}?
          </div>
          <button className="button button-red full-width" onClick={this.confirmDelete}>{t('Delete')}</button>
        </Modal>
      </div>
    );
  }
}

export default (withTranslation()(DataSource));

