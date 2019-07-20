
import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';

import * as Constants from '../api/Constants';

import Modal from '../components/Modal';
import Select from '../components/Select';
import SearchInput from '../components/SearchInput';
import Toast from '../components/Toast';

class User extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      groups: [],
      showConfirmDeletionPanel: false,
      objectToDelete: {},
      searchValue: '',
      showUpdatePassword: false,
      showEditPanel: false,
      id: null,
      username: '',
      name: '',
      tempPassword: '',
      sysRole: Constants.SYS_ROLE_VIEWER,
      userGroupId: '',
      userGroups: [],
      userAttributes: [],
      attrKey: '',
      attrValue: ''
    };
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

  handleIntegerOptionChange = (name, value) => {
    const intValue = parseInt(value, 10) || 0;
    this.setState({ 
      [name]: intValue
    });
  }

  get initialEditPanelState() {
    return {
      id: null,
      username: '',
      name: '',
      tempPassword: '',
      sysRole: '',
      userGroupId: '',
      userGroups: [],
      userAttributes: [],
      attrKey: '',
      attrValue: ''
    };
  }

  componentDidMount() {
    this.fetchUsers();
    this.fetchGroups();
  }

  fetchUsers = () => {
    axios.get('/ws/user')
      .then(res => {
        const users = res.data;
        this.setState({ 
          users: users 
        });
      });
  }

  fetchGroups = () => {
    axios.get('/ws/group')
      .then(res => {
        const groups = res.data;
        this.setState({ 
          groups: groups 
        });
      });
  }

  openEditPanel = (user) => {
    this.clearEditPanel();
    if (user !== null) {
      axios.get('/ws/user/' + user.id)
        .then(res => {
          const result = res.data;
          this.setState({
            id: result.id,
            username: result.username,
            name: result.name,
            tempPassword: '',
            sysRole: result.sysRole,
            userGroups: result.userGroups,
            userAttributes: result.userAttributes
          });
        });
    }

    this.setState({
      userGroupId: '',
      showEditPanel: true
    }); 
  }

  closeEditPanel = () => {
    this.setState({
      showEditPanel: false
    });
  }

  clearEditPanel = () => {
    this.setState(this.initialEditPanelState);
  }

  toggleUpdatePassword = () => {
    this.setState(prevState => ({
      showUpdatePassword: !prevState.showUpdatePassword
    })); 
  }

  save = () => {
    const {
      showUpdatePassword,
      id,
      username,
      name,
      tempPassword,
      sysRole,
      userGroups,
      userAttributes
    } = this.state;

    if (!username) {
      Toast.showError('Enter a username.');
      return;
    }

    let selectedSysRole = Constants.SYS_ROLE_VIEWER;
    if (Constants.SYS_ROLE_ADMIN === this.props.sysRole) {
      if (sysRole) {
        selectedSysRole = sysRole;
      } else {
        Toast.showError('Select a role.');
        return;
      }
    }

    const user = {
      username: username,
      name: name,
      sysRole: selectedSysRole,
      userGroups: userGroups,
      userAttributes: userAttributes
    };

    if (id !== null) {
      user.id = id;
      if (showUpdatePassword) {
        if (!tempPassword || tempPassword.length < 8) {
          Toast.showError(`Use 8 or more characters for password.`);
          return;
        }
        user.tempPassword = tempPassword;
      }
      
      axios.put('/ws/user', user)
        .then(res => {
          this.clearEditPanel();
          this.closeEditPanel();
          this.fetchUsers();
        })
        .catch(error => {
          Toast.showError('The name exists. Try another.');
        });
        
    } else {
      if (!tempPassword || tempPassword.length < 8) {
        Toast.showError(`Use 8 or more characters for password.`);
        return;
      }
      user.tempPassword = tempPassword;

      axios.post('/ws/user', user)
        .then(res => {
          this.clearEditPanel();
          this.closeEditPanel();
          this.fetchUsers();
        })
        .catch(error => {
          Toast.showError('The name exists. Try another.');
        });
    } 
  }

  addUserGroup = () => {
    const { 
      userGroupId,
      userGroups = []
    } = this.state;
    const index = userGroups.findIndex(groupId => groupId === userGroupId);
    if (index === -1) {
      const newUserGroups = [...userGroups];
      newUserGroups.push(userGroupId);
      this.setState({
        userGroups: newUserGroups
      });
    }
  }

  removeUserGroup = (groupId) => {
    const { 
      userGroups = [] 
    } = this.state;
    const index = userGroups.findIndex(id => id === groupId);
    if (index !== -1) {
      const newUserGroups = [...userGroups];
      newUserGroups.splice(index, 1);
      this.setState({
        userGroups: newUserGroups
      });
    } 
  }

  addUserAttribute = () => {
    const { 
      attrKey,
      attrValue,
      userAttributes = []
    } = this.state;
    if (!attrKey) {
      return;
    }
    const index = userAttributes.findIndex(attr => attr.attrKey === attrKey);
    if (index === -1) {
      const newUserAttributes = [...userAttributes];
      newUserAttributes.push({
        attrKey: attrKey,
        attrValue: attrValue
      });
      this.setState({
        userAttributes: newUserAttributes,
        attrKey: '',
        attrValue: ''
      });
    }
  }

  removeUserAttribute = (attrKey) => {
    const { 
      userAttributes = [] 
    } = this.state;
    const index = userAttributes.findIndex(attr => attr.attrKey === attrKey);
    if (index !== -1) {
      const newUserAttributes = [...userAttributes];
      newUserAttributes.splice(index, 1);
      this.setState({
        userAttributes: newUserAttributes
      });
    } 
  }

  confirmDelete = () => {
    const { 
      objectToDelete = {} 
    } = this.state;
    axios.delete('/ws/user/' + objectToDelete.id)
      .then(res => {
        this.fetchUsers();
        this.closeConfirmDeletionPanel();
      });
  }

  openConfirmDeletionPanel = (user) => {
    this.setState({
      objectToDelete: user,
      showConfirmDeletionPanel: true
    });
  }

  closeConfirmDeletionPanel = () => {
    this.setState({
      objectToDelete: {},
      showConfirmDeletionPanel: false
    });
  }

  render() {
    const { t } = this.props;
    
    const { 
      id,
      showUpdatePassword,
      users = [],
      groups = [],
      userGroups = [],
      userAttributes = [],
      searchValue,
      showConfirmDeletionPanel,
      objectToDelete = {}
    } = this.state;

    const {
      sysRole: currentUserSysRole
    } = this.props;

    const mode = id === null ? 'New' : 'Edit';

    const userItems = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const name = user.name;
      const username = user.username;
      if (!searchValue || (searchValue && (username.includes(searchValue) || name.includes(searchValue)))) {
        userItems.push(
          (
            <div key={i} className="card float-left">
              <div className="card-header ellipsis">
                {user.username}
              </div>
              <div className="card-content">
                {user.name}
                <br/>
                {user.sysRole}
              </div>
              <div className="card-footer row">
                <div className="float-right">
                  <button className="icon-button card-icon-button" onClick={() => this.openEditPanel(user)}>
                    <FontAwesomeIcon icon="edit" size="lg" />
                  </button>
                  <button className="icon-button card-icon-button" onClick={() => this.openConfirmDeletionPanel(user)}>
                    <FontAwesomeIcon icon="trash-alt" size="lg" />
                  </button>
                </div>
              </div>
            </div>
          )
        )
      }
    }

    const userGroupItems = [];
    for (let i = 0; i < userGroups.length; i++) {
      const groupId = userGroups[i];
      for (let j = 0; j < groups.length; j++) {
        if (groupId === groups[j].id) {
          userGroupItems.push(
            (
              <div key={groupId} className="row table-row">
                <div className="float-left ellipsis" style={{width: '180px'}}>{groups[j].name}</div>
                <button className="button table-row-button float-right button-red" onClick={() => this.removeUserGroup(groupId)}>
                  <FontAwesomeIcon icon="trash-alt" />
                </button>
              </div>
            )
          );
          break;
        }
      }
    }

    const userAttributeItems = userAttributes.map(attr =>
      <div key={attr.attrKey} className="row table-row">
        <div className="float-left ellipsis" style={{width: '180px'}}>{attr.attrKey}: {attr.attrValue}</div>
        <button className="button table-row-button float-right button-red" onClick={() => this.removeUserAttribute(attr.attrKey)}>
          <FontAwesomeIcon icon="trash-alt" />
        </button>
      </div>
    );

    return (
      <div>
        <div class="row">
          <div className="float-left" style={{marginRight: '5px'}}>
            <SearchInput 
              name={'searchValue'} 
              value={this.state.searchValue} 
              onChange={this.handleNameInputChange} 
              inputWidth={200}
            />
          </div>
          <button className="button float-left" onClick={() => this.openEditPanel(null)}>
            <FontAwesomeIcon icon="plus" /> {t('New')}
          </button>
        </div>
        <div className="row mt-10">
          {userItems}
        </div>

        <Modal 
          show={this.state.showEditPanel}
          onClose={this.closeEditPanel}
          modalClass={'large-modal-panel'} 
          title={t(mode)} >

          <div className="row">
            <div className="form-panel float-left" style={{width: '240px'}}>
              <label>{t('Username')} <span className="required">*</span></label>
              <input 
                className="form-input"
                type="text" 
                name="username" 
                value={this.state.username}
                onChange={this.handleInputChange} 
              />

              <label>{t('Name')}</label>
              <input 
                className="form-input"
                type="text" 
                name="name" 
                value={this.state.name}
                onChange={this.handleInputChange} 
              />

              { mode === 'Edit' && (
                  <div style={{margin: '3px 0px 8px 0px'}}>
                    <button className="button" onClick={this.toggleUpdatePassword}>{t('Change Password')}</button>
                  </div>
              )}
              { (mode === 'New' || showUpdatePassword) && ( 
                <div>
                  <label>{t('New Password')} <span className="required">*</span></label>
                  <input 
                    className="form-input"
                    type="password" 
                    name="tempPassword" 
                    value={this.state.tempPassword}
                    onChange={this.handleInputChange} />
                </div>
              )}
              
              <label>{t('System Role')}</label>
              { Constants.SYS_ROLE_ADMIN === currentUserSysRole && (
                <Select
                  name={'sysRole'}
                  value={this.state.sysRole}
                  onChange={this.handleNameInputChange}
                  options={[Constants.SYS_ROLE_VIEWER, Constants.SYS_ROLE_DEVELOPER]}
                />
              )}

              { Constants.SYS_ROLE_DEVELOPER === currentUserSysRole && (
                <div>{Constants.SYS_ROLE_VIEWER}</div>
              )}
              
            </div>

            <div className="form-panel float-left" style={{width: '240px', marginLeft: '20px'}}>
              <label>{t('Attributes')}</label>
              <label>{t('Key')} <span className="required">*</span></label>
              <input 
                className="form-input"
                type="text" 
                name="attrKey" 
                value={this.state.attrKey}
                onChange={this.handleInputChange} 
              />
                
              <label>{t('Value')}</label>
              <input 
                className="form-input"
                type="text" 
                name="attrValue" 
                value={this.state.attrValue}
                onChange={this.handleInputChange} 
              />

              <button className="button" onClick={this.addUserAttribute}>{t('Add')}</button>
              <div style={{marginTop: '8px'}}>
                {userAttributeItems}
              </div>
            </div>

            <div className="form-panel float-left" style={{width: '240px', marginLeft: '20px'}}>
              { Constants.SYS_ROLE_VIEWER === this.state.sysRole && (
                <div>
                  <label>{t('Groups')}</label>
                  <Select
                    name={'userGroupId'}
                    value={this.state.userGroupId}
                    onChange={this.handleIntegerOptionChange}
                    options={groups}
                    optionDisplay={'name'}
                    optionValue={'id'}
                  />
                  <button className="button" onClick={this.addUserGroup}>{t('Add')}</button>
                  <div style={{marginTop: '8px'}}>
                    {userGroupItems}
                  </div>
                </div>  
              )}      
            </div>

          </div>
          <button className="button mt-3 button-green" onClick={this.save}>
            <FontAwesomeIcon icon="save" size="lg" fixedWidth /> {t('Save')}
          </button>
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
    )
  }
}

export default (withTranslation()(User));