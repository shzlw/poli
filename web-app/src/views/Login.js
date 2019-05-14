
import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import './Login.css';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMsg: '',
      username: '',
      password: '',
      version: ''
    };
  }

  componentDidMount() {
    axios.get('/info/version')
      .then(res => {
        const version = res.data;
        this.setState({
          version: version
        });
      });

    const { sysRole } = this.props;
    let isAuthenticated = false;
    if (sysRole) {
      isAuthenticated = true;
    }

    if (!isAuthenticated) {
      axios.post('/auth/login/cookie')
        .then(res => {
          const loginResponse = res.data;
          if (!loginResponse.error) {
            this.props.onLoginSuccess(loginResponse);
          }
        });
    }
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleKeyPress = (event) => {
    if(event.keyCode === 13) {
      this.login();
    }
  }

  login = () => {
    const {
      username,
      password
    } = this.state;

    const user = {
      username: username,
      password: password
    }

    if (!username) {
      this.setState({
        errorMsg: 'Enter username.'
      });
      return;
    }

    if (!password) {
      this.setState({
        errorMsg: 'Enter password.'
      });
      return;
    }

    axios.post('/auth/login/user', user)
      .then(res => {
        const loginResponse = res.data;
        if (loginResponse.error) {
          this.setState({
            errorMsg: loginResponse.error
          });
        } else {
          this.props.onLoginSuccess(loginResponse);
        }
      });
  }

  render() {
    return (
      <div className="login-view">
        <div className="login-panel">
          <div className="login-app-title">Poli</div>
          <div className="login-error-msg">{this.state.errorMsg}</div>
          <div className="login-panel-body">
            <div className="form-panel">
              <label>Username</label>
              <input 
                type="text" 
                name="username" 
                value={this.state.username}
                onChange={this.handleInputChange} 
                onKeyDown={this.handleKeyPress} 
              />
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                value={this.state.password}
                onChange={this.handleInputChange} 
                onKeyDown={this.handleKeyPress} 
              />
              <button className="button login-button confirm-button" onClick={this.login}>Login</button>
            </div>
          </div>
        </div>
        <div className="version-number">
          Version {this.state.version}
        </div>
      </div>
    )
  }
}

export default withRouter(Login);