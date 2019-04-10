
import React from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import Select from '../components/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SYS_ROLES = ['developer', 'viewer'];

class User extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      groups: [],
      searchValue: '',
      showEditPanel: false,
      id: null,
      username: '',
      name: '',
      tempPassword: '',
      sysRole: '',
      userGroupId: '',
      userGroups: []
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleOptionChange = (name, value) => {
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

  save = () => {
    const {
      id,
      username,
      name,
      tempPassword,
      sysRole,
      userGroups
    } = this.state;

    let user = {
      username: username,
      name: name,
      sysRole: sysRole,
      userGroups: userGroups
    };

    if (id !== null) {
      user.id = id;
      
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

  delete = (id) => {
    axios.delete('/ws/user/' + id)
      .then(res => {
        this.fetchUsers();
      });
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

  render() {
    const { 
      users = [],
      groups = [],
      userGroups = []
    } = this.state;

    const userItems = users.map(user => 
      <div key={user.id} className="user-card">
        <p>
          {user.username}
          {user.name}
          {user.sysRole}
          <button className="button" onClick={() => this.openEditPanel(user)}>update</button>
          <button className="button" onClick={() => this.delete(user.id)}>delete</button>
        </p>
      </div>
    );

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
        <div>User</div>
        <input
          type="text"
          name="searchValue"
          value={this.state.searchValue}
          onChange={this.handleInputChange}
          placeholder="Search..."
          style={{width: '200px'}}
        />
        <button className="button" onClick={this.clearSearch}>Clear</button>
        <button className="button" onClick={() => this.openEditPanel(null)}>
          <FontAwesomeIcon icon="plus" /> New User
        </button>
        <div className="row">
          {userItems}
        </div>

        <Modal 
          show={this.state.showEditPanel}
          onClose={this.closeEditPanel}
          modalClass={'small-modal-panel'} 
          title={'User'} >

          <div className="form-panel">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              name="username" 
              value={this.state.username}
              onChange={this.handleInputChange} />

            <label className="form-label">Name</label>
            <input 
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} />

            <label className="form-label">Temp password</label>
            <input 
              type="password" 
              name="tempPassword" 
              value={this.state.tempPassword}
              onChange={this.handleInputChange} />
            
            <label className="form-label">System Role</label>
            <Select
              name={'sysRole'}
              value={this.state.sysRole}
              onChange={this.handleOptionChange}
              options={SYS_ROLES}
            />
            
            <br/>
            
            <label className="form-label">Groups</label>
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

            <button className="button" className="button" onClick={this.save}>Save</button>
          </div>
        </Modal>
        
      </div>
    )
  }
}

export default User;