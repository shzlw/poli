
import React from 'react';
import axios from 'axios';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

class Account extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showGenerateApiKeyPanel: false,
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
        const user = res.data;
        this.setState({
          id: user.id,
          username: user.username,
          name: user.name,
          sysRole: user.sysRole,
          apiKey: user.apiKey
        });
      });
  }

  generateApiKey = () => {
    axios.get('/auth/generate-apikey')
      .then(res => {
        const apiKey = res.data;
        this.setState({
          apiKey: apiKey
        });
      });
    this.setState({
      showGenerateApiKeyPanel: false
    })
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
        Toast.showError(`Those passwords didn't match.`);
        return;
      }  

      if (password.length < 8) {
        Toast.showError(`Use 8 or more characters for password.`);
        return;
      }

      user.password = password;
    }

    axios.put('/ws/user/account', user)
      .then(res => {
        Toast.showSuccess('Saved.');
      });
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
      <div className="full-page-content">
        <div className="form-panel" style={{width: '400px'}}>   
          <label>Username</label>
          <div className="info-value">{username}</div>

          <label>Name</label>
          <input 
            type="text"   
            name="name" 
            value={this.state.name}
            onChange={this.handleInputChange} />

          <label>System Role</label>
          <div className="info-value">{sysRole}</div>

          <label>API Key</label>
          <div className="info-value">{apiKey}</div>
          <button className="button mt-10 button-red" onClick={() => this.setState({ showGenerateApiKeyPanel: true })}>Generate new API Key</button>
          
          <hr />

          <button className="button mt-3" onClick={this.toggleUpdatePassword}>Update password</button>
          {
            showUpdatePassword && (
              <div style={{marginTop: '8px'}}>
                <label>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={this.state.password}
                  onChange={this.handleInputChange} />
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmedPassword" 
                  value={this.state.confirmedPassword}
                  onChange={this.handleInputChange} />
              </div>
          )}

          <hr />
          <button className="button mt-10 button-green" onClick={this.save}>Save</button>
        </div>

        <Modal 
          show={this.state.showGenerateApiKeyPanel}
          onClose={() => this.setState({ showGenerateApiKeyPanel: false })}
          modalClass={'small-modal-panel'}
          title={'Confirm'} >
          <div className="confirm-deletion-panel">
            Are you sure you want to generate a new Api Key?
          </div>
          <button className="button button-red full-width" onClick={this.generateApiKey}>Confirm</button>
        </Modal>
      </div>
    )
  }
}

export default Account;