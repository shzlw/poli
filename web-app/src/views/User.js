
import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      userGroups: []
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
      userGroups: []
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
    if (user !== null) {
      this.setState({
        id: user.id,
        username: user.username,
        name: user.name,
        tempPassword: '',
        sysRole: user.sysRole,
        userGroups: user.userGroups
      });
    } else {
      this.clearEditPanel();
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
      userGroups
    } = this.state;

    if (!username) {
      Toast.showError('Enter a name.');
      return;
    }

    if (!tempPassword || tempPassword.length < 8) {
      Toast.showError(`Use 8 or more characters for password.`);
      return;
    }

    let selectedSysRole = Constants.SYS_ROLE_VIEWER;
    if (Constants.SYS_ROLE_ADMIN === this.props.sysRole) {
      if (sysRole) {
        selectedSysRole = sysRole;
      } else {
        // TODO: throw errors.
        return;
      }
    }


    let user = {
      username: username,
      name: name,
      sysRole: selectedSysRole,
      userGroups: userGroups
    };

    if (id !== null) {
      user.id = id;
      if (showUpdatePassword && tempPassword) {
        user.tempPassword = tempPassword;
      }
      
      axios.put('/ws/user', user)
        .then(res => {
          this.clearEditPanel();
          this.closeEditPanel();
          this.fetchUsers();
        });
    } else {
      user.tempPassword = tempPassword;

      axios.post('/ws/user', user)
        .then(res => {
          this.clearEditPanel();
          this.closeEditPanel();
          this.fetchUsers();
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
    const { 
      id,
      showUpdatePassword,
      users = [],
      groups = [],
      userGroups = [],
      searchValue,
      showConfirmDeletionPanel,
      objectToDelete = {}
    } = this.state;

    const {
      sysRole
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
            <div key={i} className="datasource-card row">
              <div className="float-left ellipsis datasource-row-name">
                {user.username}
                {user.name}
                {user.sysRole}
              </div>
              <div className="float-right">
                <button className="icon-button datasource-icon-button" onClick={() => this.openEditPanel(user)}>
                  <FontAwesomeIcon icon="edit" size="lg" />
                </button>
                <button className="icon-button datasource-icon-button" onClick={() => this.openConfirmDeletionPanel(user)}>
                  <FontAwesomeIcon icon="trash-alt" size="lg" />
                </button>
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
              <div key={groupId}>
                <div>Group: {groups[j].name}</div>
                <button className="button" onClick={() => this.removeUserGroup(groupId)}>delete</button>
              </div>
            )
          );
          break;
        }
      }
    }

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
            <FontAwesomeIcon icon="plus" /> New
          </button>
        </div>
        <div className="row mt-10">
          {userItems}
        </div>

        <Modal 
          show={this.state.showEditPanel}
          onClose={this.closeEditPanel}
          modalClass={'mid-modal-panel'} 
          title={mode} >

          <div className="form-panel">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              value={this.state.username}
              onChange={this.handleInputChange} 
            />

            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} 
            />

            { mode === 'Edit' && (
                <div style={{margin: '3px 0px 8px 0px'}}>
                  <button className="button" onClick={this.toggleUpdatePassword}>Update password</button>
                </div>
            )}
            { (mode === 'New' || showUpdatePassword) && ( 
              <div>
                <label>Password</label>
                <input 
                  type="password" 
                  name="tempPassword" 
                  value={this.state.tempPassword}
                  onChange={this.handleInputChange} />
              </div>
            )}
            
            <label>System Role</label>
            { Constants.SYS_ROLE_ADMIN === sysRole && (
              <Select
                name={'sysRole'}
                value={this.state.sysRole}
                onChange={this.handleNameInputChange}
                options={[Constants.SYS_ROLE_VIEWER, Constants.SYS_ROLE_DEVELOPER]}
              />
            )}

            { Constants.SYS_ROLE_DEVELOPER === sysRole && (
              <div>{Constants.SYS_ROLE_VIEWER}</div>
            )}
            
            <br/>
            
            <label>Groups</label>
            <Select
              name={'userGroupId'}
              value={this.state.userGroupId}
              onChange={this.handleIntegerOptionChange}
              options={groups}
              optionDisplay={'name'}
              optionValue={'id'}
            />
            <button className="button" onClick={this.addUserGroup}>Add</button>
            <div>
              {userGroupItems}
            </div>

            <button className="button" onClick={this.save}>Save</button>
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
    )
  }
}

export default User;