import React from 'react';
import { Route, Switch, Redirect, withRouter, Component } from "react-router-dom";
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faChalkboard, faDatabase, faUsersCog, faPlus, faTimes,
  faEdit, faTrashAlt, faPlayCircle, faStopCircle, faRedoAlt,
  faTv, faPlug, faUser, faSignOutAlt, faCompress, faExpandArrowsAlt,
  faFileExport, faFileCsv, faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './App.css';

import Login from './views/Login';
import ChangeTempPassword from './views/ChangeTempPassword';
import Workspace from './views/Workspace';
import PageNotFound from './views/PageNotFound';


library.add(faChalkboard, faDatabase, faUsersCog, faPlus, faTimes, 
  faEdit, faTrashAlt, faPlayCircle, faStopCircle, faRedoAlt, 
  faTv, faPlug, faUser, faSignOutAlt, faCompress, faExpandArrowsAlt,
  faFileExport, faFileCsv, faCircleNotch
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      sysRole: '',
      isAuthorizing: false
    }
  }

  componentDidMount() {
    const pathname = this.props.location.pathname;
    const search = this.props.location.search;

    const params = new URLSearchParams(search);
    const apiKey = params.get('apiKey');

    let currentPath = pathname + search;

    const {
      sysRole
    } = this.state;

    let isAuthenticated = false;
    if (sysRole) {
      isAuthenticated = true;
    }

    if (!isAuthenticated) {
      this.setState({
        isAuthorizing: true
      }, () => {
        axios.post('/auth/login/cookie')
          .then(res => {
            const loginResponse = res.data;
            if (loginResponse.error) {
                this.setState({
                  sysRole: '',
                  isAuthorizing: false
                }, () => {
                  this.props.history.push('/login');
                });
              } else {
                this.onLoginSuccess(loginResponse, currentPath);
              }
          });
      });
      
    }
  }

  onLoginSuccess = (loginResponse = {}, pathname = null) => {
    if (loginResponse.tempPassword) {
      this.props.history.push('/changepassword');
    } else {
      this.setState({
        username: loginResponse.username,
        sysRole: loginResponse.sysRole,
        isAuthorizing: false
      }, () => {
        let directUrl = '/workspace/dashboard';
        if (pathname) {
          directUrl = pathname;
        }
        this.props.history.push(directUrl);
      });
    }
  }

  onLogout = () => {
    this.setState({
      username: '',
      sysRole: '',
      isAuthorizing: false
    }, () => {
      this.props.history.push('/login');
    });
  }
   
  render() {
    const {
      username,
      sysRole,
      isAuthorizing
    } = this.state;

    let isAuthenticated = false;
    if (sysRole) {
      isAuthenticated = true;
    }

    if (isAuthorizing) {
      return (
        <FontAwesomeIcon icon='cicle-notch' spin={true} size="3x" />
      )
    }
    
    return (
      <div className="app">
        <Switch>
          <Route exact path="/" render={() => <Login sysRole={sysRole} onLoginSuccess={this.onLoginSuccess} />} />
          <Route path="/login" render={() => <Login sysRole={sysRole} onLoginSuccess={this.onLoginSuccess} />} />
          <Route path="/changepassword" component={ChangeTempPassword} />
          <PrivateRoute 
            authenticated={isAuthenticated} 
            path='/workspace' 
            component={Workspace} 
            username={username}
            sysRole={sysRole} 
            onLogout={this.onLogout}
          />
          <Route component={PageNotFound} />
        </Switch>
      </div>
    );
  }
}

function PrivateRoute({component: Component, authenticated, ...rest}) {
  return (
    <Route
      {...rest}
      render={
        (props) => authenticated === true
        ? <Component {...props} {...rest} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />
      }
    />
  )
}

export default withRouter(App);
