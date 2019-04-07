
import React from 'react';
import axios from 'axios';

class UpdateTempPassword extends React.Component {

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
  }

  save = (event) => {
    event.preventDefault();
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

    const password = {
      password: password
    }

    axios.post('/ws/auth/login/changepassword', password)
      .then(res => {
        const result = res.data;
      });
  }

  render() {

    return (
      <React.Fragment>
        <label className="form-label">{this.state.errorMsg}</label>
        <form>
          <div class="form-group">
            <label className="form-label">New password</label>
            <input 
              type="text" 
              name="username" 
              value={this.state.username}
              onChange={this.handleInputChange} />
            <label className="form-label">Confirm password</label>
            <input 
              type="password" 
              name="password" 
              value={this.state.password}
              onChange={this.handleInputChange} />
          </div>
          <button onClick={this.login}>Login</button>
        </form>
      </React.Fragment>
    )
  }
}

export default UpdateTempPassword;