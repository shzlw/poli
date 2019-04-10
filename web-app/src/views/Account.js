
import React from 'react';
import axios from 'axios';

class Account extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showUpdatePassword: false,
      id: null,
      username: '',
      name: '',
      sysRole: '',
      apiKey: '',
      password: '',
      confirmedPassword: ''
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = () => {
    axios.get('/ws/user/account')
      .then(res => {
        const result = res.data;
      });
  }

  generateApiKey = () => {
  }

  save = () => {
    const {
      showUpdatePassword,
      name,
      password,
      confirmedPassword
    } = this.state;

    const user = {
      name: name
    }

    if (showUpdatePassword) {
      if (password !== confirmedPassword) {
        alert('confirm password');
        return;
      }
      
      user.password = password;
    }
  }

  toggleUpdatePassword = () => {
    this.setState(prevState => ({
      showUpdatePassword: !prevState.showUpdatePassword
    })); 
  }

  render() {
    const {
      showUpdatePassword,
      username,
      sysRole,
      apiKey
    } = this.state;

    return (
      <div>
        <div>Account</div>
        <div className="form-panel">   
          <label className="form-label">Username</label>
          <div>{username}</div>

          <label className="form-label">Name</label>
          <input 
            type="text" 
            name="name" 
            value={this.state.name}
            onChange={this.handleInputChange} />

          <label className="form-label">System Role</label>
          <div>{sysRole}</div>

          <label className="form-label">API Key</label>
          <div>{apiKey}</div>
          <button className="button" onClick={this.generateApiKey}>Generate new API Key</button>
          <br/>

          <button className="button" onClick={this.toggleUpdatePassword}>Update password</button>
          {
            showUpdatePassword ?
            (
              <React.Fragment>
                <br/>
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={this.state.password}
                  onChange={this.handleInputChange} />
                <label className="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmedPassword" 
                  value={this.state.confirmedPassword}
                  onChange={this.handleInputChange} />
              </React.Fragment>
            ) : null
          }

          <br/>
          <button className="button" onClick={this.save}>Save</button>
        </div>
      </div>
    )
  }
}

export default Account;