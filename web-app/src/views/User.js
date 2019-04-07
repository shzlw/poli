
import React from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

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

  handleOptionChange = (name, event) => {
    this.setState({
      [name]: event.target.value
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

  search = () => {
    const { searchValue } = this.state;
  }

  save = (event) => {
    event.preventDefault();
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
          this.fetchUsers();
        });
    } else {
      user.tempPassword = tempPassword;

      axios.post('/ws/user', user)
        .then(res => {
          this.clearEditPanel();
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

  addUserGroup = (event) => {
    event.preventDefault();
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

  removeUserGroup = (groupId, event) => {
    event.preventDefault();
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
          <button onClick={() => this.openEditPanel(user)}>update</button>
          <button onClick={() => this.delete(user.id)}>delete</button>
        </p>
      </div>
    );

    const groupOptions = groups.map(group => 
      <option value={group.id} key={group.id}>{group.name}</option>
    );

    const sysRoleOptions = SYS_ROLES.map(groupName => 
      <option value={groupName} key={groupName}>{groupName}</option>
    );

    const userGroupItems = [];
    for (let i = 0; i < userGroups; i++) {
      const groupId = userGroups[i];
      for (let j = 0; j < groups; j++) {
        if (groupId === groups[j].id) {
          userGroupItems.push(
            (
              <div key={groupId}>
                <div>Group: {groups[j].name}</div>
                <button onClick={(event) => this.removeUserGroup(groupId, event)}>delete</button>
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
          name=""
          placeholder="By Username..."
          />
        <input
          type="text"
          name=""
          placeholder="By Group..."
          />
        <button onClick={this.search}>Search</button>
        <div className="row">
          {userItems}
        </div>
        <button onClick={() => this.openEditPanel(null)}>
          Add
        </button>

        <Modal 
          show={this.state.showEditPanel}
          onClose={this.closeEditPanel}
          modalClass={'lg-modal-panel'} 
          title={'User'} >

          <div>
            <h3>{'User'}</h3>
            <form>
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
              <select value={this.state.sysRole} onChange={(event) => this.handleOptionChange('sysRole', event)}>
                {sysRoleOptions}
              </select>
              <br/>
              
              <label className="form-label">Groups</label>
              <select value={this.state.userGroupId} onChange={(event) => this.handleOptionChange('userGroupId', event)}>
                {groupOptions}
              </select>
              <button onClick={this.addUserGroup}>Add</button>
              <div>
                {userGroupItems}
              </div>

            </form>

            <div>
              <button onClick={this.save}>Save</button>
            </div>
          </div>

        </Modal>
        
      </div>
    )
  }
}

export default User;