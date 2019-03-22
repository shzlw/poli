
import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import AuthStore from '../api/AuthStore';
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
    this.tryLogin();
  }

  tryLogin = () => {
    axios.post('/auth/login/cookie')
      .then(res => {
        const result = res.data;
      });
  }

  login = (event) => {
    event.preventDefault();
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

    AuthStore.username = 'testuser';
    AuthStore.sysRole = 'developer';
    this.props.history.push('/workspace/dashboard');

    axios.post('/auth/login/user', user)
      .then(res => {
        const result = res.data;
      });
  }

  render() {
    return (
      <React.Fragment>
        <div className="login-panel">
          <div>Poli</div>
          <label>{this.state.errorMsg}</label>
          <form>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                name="username" 
                value={this.state.username}
                onChange={this.handleInputChange} />
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                value={this.state.password}
                onChange={this.handleInputChange} />
            </div>
            <button onClick={this.login}>Login</button>
          </form>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(Login);