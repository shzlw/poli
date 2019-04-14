
import React from 'react';
import axios from 'axios';

class ChangeTempPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMsg: '',
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
      console.log('ChangeTempPassword - componentDidMount');
  }

  save = () => {
    const {
      password,
      confirmedPassword
    } = this.state;

    if (password || confirmedPassword) {
      if (password === confirmedPassword) {

      }
    } else {
      this.setState({
        errorMsg: `Those passwords didn't match.`
      })
    }

    const newPassword = {
      password: password
    }

    axios.post('/ws/auth/login/changepassword', newPassword)
      .then(res => {
        const result = res.data;
      });
  }

  render() {

    return (
      <React.Fragment>
        <label>{this.state.errorMsg}</label>
        <div class="form-group">
          <label>New password</label>
          <input 
            type="text" 
            name="username" 
            value={this.state.username}
            onChange={this.handleInputChange} />
          <label>Confirm password</label>
          <input 
            type="password" 
            name="password" 
            value={this.state.password}
            onChange={this.handleInputChange} />
          <button onClick={this.login}>Login</button>
        </div>
      </React.Fragment>
    )
  }
}

export default ChangeTempPassword;