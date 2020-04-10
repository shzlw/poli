
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import './Login.css';

class ChangeTempPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmedPassword: ''
    };
  }

  componentDidMount() {
    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode) {
      const { ownerDocument } = thisNode;
      ownerDocument.addEventListener("keydown", this.onKeyDown);
    }
  }

  componentWillUnmount() {
    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode) {
      const { ownerDocument } = thisNode;
      ownerDocument.removeEventListener('keydown', this.onKeyDown);
    }
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onKeyDown = (event) => {
    if(event.keyCode === 13) {
      this.changePassword();
    }
  }

  changePassword = () => {
    const {
      password,
      confirmedPassword
    } = this.state;

    if (password && confirmedPassword
        && password === confirmedPassword) {
      if (password.length < 8) {
        toast.error('Use 8 or more characters');
        return;
      }

      const user = {
        password: password
      }

      axios.post('/auth/login/change-password', user)
        .then(res => {
          const loginResponse = res.data || {};
          if (loginResponse.error) {
            toast.error(loginResponse.error);
          } else {
            this.props.history.push('/workspace/report');
          }
        });
    } else {
      toast.error(`Those passwords didn't match`);
    }
  }

  render() {
    const { t } = this.props;

    const titleStyle = {
      fontSize: '22px',
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: '15px'
    }

    const tipStyle = {
      fontWeight: 'bold',
      marginBottom: '5px',
      fontSize: '15px'
    }

    return (
      <div className="login-view">
        <div className="login-panel">
          <div style={titleStyle}>{t('Change Password')}</div>
          <div className="login-panel-body">
            <div className="form-panel">
              <div style={tipStyle}>* {t('Use 8 or more characters')}</div>
              <label>{t('New Password')}</label>
              <input 
                className="form-input login-input"
                type="password" 
                name="password" 
                value={this.state.username}
                onChange={this.handleInputChange} />
              <label>{t('Confirm Password')}</label>
              <input 
                className="form-input login-input"
                type="password" 
                name="confirmedPassword" 
                value={this.state.confirmedPassword}
                onChange={this.handleInputChange} />
              <button className="button login-button button-green" onClick={this.changePassword}>{t('Confirm')}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default (withTranslation()(withRouter(ChangeTempPassword)));
