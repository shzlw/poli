
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
      password: ''
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  componentDidMount() {
    const { sysRole } = this.props;
    let isAuthenticated = false;
    if (sysRole) {
      isAuthenticated = true;
    }
    console.log('Login - componentDidMount', isAuthenticated);
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
        errorMsg: 'Enter username'
      });
      return;
    }

    if (!password) {
      this.setState({
        errorMsg: 'Enter password'
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

    console.log('Login - render');
    
    return (
      <React.Fragment>
        <div className="login-panel">
          <div className="login-app-title">Poli</div>
          <div className="login-error-msg">{this.state.errorMsg}</div>
          <div className="long-panel-body">
            <div className="form-group">
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
            </div>
            <button className="button login-button" onClick={this.login}>Login</button>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(Login);