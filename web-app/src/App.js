import React, { Component } from 'react';
import './App.css';

import { Route, Link, Switch } from "react-router-dom";
import DataSource from './views/DataSource';
import Dashboard from './views/Dashboard';
import SingleTest from './views/SingleTest';
import DashboardFullScreenView from './views/DashboardFullScreenView';

const menuItems = ['datasource', 'dashboard', 'single-test'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenuItem: 'dashboard'
    }
  }

  handleClick = (menuItem) => {
    this.setState({
      menuItem: menuItem
    });
  }

  render() {
    const {
      currentMenuItem
    } = this.state;
    
    return (
      <div className="app">
        <div className="app-nav">
          <div className="app-name">Poli</div>
          <ul className="app-nav-menu">
            <li>
              <Link to="/datasources" onClick={(e) => this.handleClick('datasource')}>
                <i className="fas fa-database fa-fw"></i>
                <span className="app-nav-menu-text">Data Source</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboards" onClick={(e) => this.handleClick('dashboard')}>
                <i className="fas fa-chalkboard fa-fw"></i>
                <span className="app-nav-menu-text">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/single-test" onClick={(e) => this.handleClick('single-test')}>
                <span className="app-nav-menu-text">Single</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="app-content">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/datasources" component={DataSource} />
            <Route path="/dashboards" component={Dashboard} />
            <Route exact path="/single-test" component={SingleTest} />
            <Route exact path="/dashboard/view" component={DashboardFullScreenView} />
          </Switch>
        </div>
      </div>
    );
  }
}
export default App;
