
import React from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";

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

  changePassword = () => {
    const {
      password,
      confirmedPassword
    } = this.state;

    if (password && confirmedPassword
        && password === confirmedPassword) {
      const user = {
        password: password
      }

      axios.post('/auth/login/changepassword', user)
        .then(res => {
          const result = res.data;
          this.props.history.push('/workspace/dashboard');
        });
    } else {
      this.setState({
        errorMsg: `Those passwords didn't match.`
      });
    }
  }

  render() {

    return (
      <div>
        <label>{this.state.errorMsg}</label>
        <div class="form-group">
          <label>New password</label>
          <input 
            type="password" 
            name="password" 
            value={this.state.username}
            onChange={this.handleInputChange} />
          <label>Confirm password</label>
          <input 
            type="password" 
            name="confirmedPassword" 
            value={this.state.confirmedPassword}
            onChange={this.handleInputChange} />
          <button onClick={this.changePassword}>Change</button>
        </div>
      </div>
    )
  }
}

export default withRouter(ChangeTempPassword);