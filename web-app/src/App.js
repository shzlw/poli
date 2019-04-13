import React from 'react';
import { Route, Switch, Redirect, withRouter, Component } from "react-router-dom";
import axios from 'axios';
import './App.css';

import Login from './views/Login';
import Workspace from './views/Workspace';
import PageNotFound from './views/PageNotFound';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faChalkboard, faDatabase, faUsersCog, faPlus, faTimes,
  faEdit, faTrashAlt, faPlayCircle, faStopCircle, faRedoAlt,
  faTv, faPlug, faUser, faSignOutAlt, faCompress, faExpandArrowsAlt,
  faFileExport, faFileCsv
} from '@fortawesome/free-solid-svg-icons';
library.add(faChalkboard, faDatabase, faUsersCog, faPlus, faTimes, 
  faEdit, faTrashAlt, faPlayCircle, faStopCircle, faRedoAlt, 
  faTv, faPlug, faUser, faSignOutAlt, faCompress, faExpandArrowsAlt,
  faFileExport, faFileCsv
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
    const {
      sysRole = ''
    } = this.state;

    let isAuthenticated = false;
    if (sysRole) {
      isAuthenticated = true;
    }

    console.log('App - componentDidMount',isAuthenticated);

    if (!isAuthenticated) {
      console.log('App - componentDidMount', 'cookie');
      axios.post('/auth/login/cookie')
        .then(res => {
          const result = res.data;
          if (result == 'error') {
            this.setState({
              sysRole: ''
            });
          } else {
            this.setState({
              sysRole: result
            });
          }
        });
    }
  }

  onLoginSuccess = (sysRole) => {
    console.log('App - onLoginSuccess', sysRole);
    this.setState({
      sysRole: sysRole
    });
  }
   
  render() {
    const {
      sysRole = ''
    } = this.state;

    let isAuthenticated = false;
    if (sysRole) {
      isAuthenticated = true;
    }
    console.log('App - render', sysRole, isAuthenticated);
    return (
      <div className="app">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/login" render={() => <Login onLoginSuccess={this.onLoginSuccess} />} />
        <PrivateRoute authenticated={isAuthenticated} path='/workspace' component={Workspace} />
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
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />
      }
    />
  )
}

export default withRouter(App);
