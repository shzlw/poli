import React, { Component } from 'react';
import './App.css';

import { Route, Link } from "react-router-dom";
import Overview from './views/Overview';
import DataSources from './views/DataSources';
import Dashboards from './views/Dashboards';
import Test from './views/Test';
import EditDataSource from './views/EditDataSource';
import EditDashboard from './views/EditDashboard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'overview'
    }
  }

  componentDidMount() {
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  render() {
    return (
      <div className="app">
        <div className="nav">
          <Link to="/overview">Overview</Link>
          <Link to="/datasources">Data Sources</Link>
          <Link to="/dashboards">Dashboards</Link>
          <Link to="/test">Test</Link>
        </div>
        <div className="content">
          <Route exact path="/" component={Overview} />
          <Route exact path="/overview" component={Overview} />
          <Route exact path="/datasources" component={DataSources} />
          <Route exact path="/dashboards" component={Dashboards} />
          <Route exact path="/test" component={Test} />
          <Route exact path="/datasources/new" component={EditDataSource} />
          <Route exact path="/datasources/edit/:id" component={EditDataSource} />
          <Route exact path="/dashboard/new" component={EditDashboard} />
          <Route exact path="/dashboard/edit/:id" component={EditDashboard} />
        </div>
      </div>
    );
  }
}
export default App;
