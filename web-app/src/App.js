import React from 'react';
import { Route, Switch, Redirect, Component } from "react-router-dom";
import './App.css';

import Login from './views/Login';
import Workspace from './views/Workspace';
import PageNotFound from './views/PageNotFound';

import AuthStore from './api/AuthStore';

import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faChalkboard, faDatabase, faUsersCog, faPlus, faTimes,
  faEdit, faTrashAlt, faPlayCircle, faStopCircle, faRedoAlt,
  faTv, faPlug, faUser, faSignOutAlt, faCompress, faExpandArrowsAlt,
  faFileExport, faFileCsv, faHandshake
} from '@fortawesome/free-solid-svg-icons';
library.add(faChalkboard, faDatabase, faUsersCog, faPlus, faTimes, 
  faEdit, faTrashAlt, faPlayCircle, faStopCircle, faRedoAlt, 
  faTv, faPlug, faUser, faSignOutAlt, faCompress, faExpandArrowsAlt,
  faFileExport, faFileCsv, faHandshake
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    console.log('App - componentDidMount', AuthStore.isAuthenticated);
  }
   
  render() {
    console.log('App - render', AuthStore.isAuthenticated);
    return (
      <div className="app">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <PrivateRoute authenticated={AuthStore.isAuthenticated} path='/workspace' component={Workspace} />
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

export default App;
