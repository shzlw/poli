import React from 'react';
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faChalkboard, faDatabase, faUsersCog, faPlus, faTimes,
  faEdit, faTrashAlt, faPlayCircle, faStopCircle, faRedoAlt,
  faTv, faPlug, faUser, faSignOutAlt, faCompress, faExpandArrowsAlt,
  faFileExport, faFileCsv, faCircleNotch, faSearch, faSave, 
  faCalendarPlus, faFilter, faExternalLinkAlt, faCheckSquare, 
  faLongArrowAltRight, faWrench, faArchive
} from '@fortawesome/free-solid-svg-icons';
import {
  faSquare as farSquare
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import './App.css';

import Login from './views/Login';
import ChangeTempPassword from './views/ChangeTempPassword';
import Workspace from './views/Workspace';
import PageNotFound from './views/PageNotFound';
import * as Constants from './api/Constants';


library.add(faChalkboard, faDatabase, faUsersCog, faPlus, faTimes, 
  faEdit, faTrashAlt, faPlayCircle, faStopCircle, faRedoAlt, 
  faTv, faPlug, faUser, faSignOutAlt, faCompress, faExpandArrowsAlt,
  faFileExport, faFileCsv, faCircleNotch, faSearch, faSave, 
  faCalendarPlus, faFilter, faExternalLinkAlt, faCheckSquare,
  faLongArrowAltRight, faWrench, farSquare, faArchive
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
    this.configAxiosInterceptors();

    const pathname = this.props.location.pathname;
    const search = this.props.location.search;
    const currentPath = pathname + search;

    const params = new URLSearchParams(search);
    const apiKey = params.get('$apiKey');
    // Check if the page is using api key to authenticate first.
    if (apiKey != null) {
      axios.defaults.headers.common = {
        "Poli-Api-Key": apiKey
      };
      const loginRequest = {
        apiKey: apiKey
      };
      this.setState({
        isAuthorizing: true
      }, () => {
        axios.post('/auth/login/apikey', loginRequest)
          .then(res => {
            this.handleLoginResponse(res.data, currentPath);
          });
      });
      return;
    }

    const rememberMeConfig = localStorage.getItem(Constants.REMEMBERME);
    const rememberMe = rememberMeConfig && rememberMeConfig === Constants.YES;

    const {
      sysRole
    } = this.state;

    let isAuthenticated = false;
    if (sysRole) {
      isAuthenticated = true;
    }

    if (!isAuthenticated && rememberMe) {
      this.setState({
        isAuthorizing: true
      }, () => {
        axios.post('/auth/login/cookie')
          .then(res => {
            this.handleLoginResponse(res.data, currentPath);
          });
      });
    }
  }

  handleLoginResponse = (loginResponse, currentPath) => {
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
  }

  onLoginSuccess = (loginResponse = {}, pathname = '/') => {
    if (loginResponse.isTempPassword) {
      this.props.history.push('/changepassword');
    } else {
      this.setState({
        username: loginResponse.username,
        sysRole: loginResponse.sysRole,
        isAuthorizing: false
      }, () => {
        let directUrl = '/workspace/report';
        if (pathname !== '/' && pathname !== '/login') {
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

  configAxiosInterceptors = () => {
    axios.interceptors.response.use((response) => {
        return response;
      }, (error) => {
        const statusCode = error.response.status;
        if(statusCode === 401 || statusCode === 403) { 
          this.onLogout();
        }
        return Promise.reject(error);
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
        <div className="authenticating-panel">
          <div className="authenticating-panel-title">Poli</div>
          <FontAwesomeIcon icon="circle-notch" spin={true} size="2x" />
        </div>
      )
    }
    
    return (
      <div className="app">
        <Switch>
          <Route exact path="/" render={() => <Login onLoginSuccess={this.onLoginSuccess} />} />
          <Route path="/login" render={() => <Login onLoginSuccess={this.onLoginSuccess} />} />
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
