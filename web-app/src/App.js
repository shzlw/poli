import React from 'react';
import { Route, Switch } from "react-router-dom";
import './App.css';

import Login from './views/Login';
import Workspace from './views/Workspace';
import NotFound from './views/NotFound';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="app">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/workspace" component={Workspace} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}
export default App;
