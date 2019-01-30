import React, { Component } from 'react';
import './App.css';

import { Route, Link } from "react-router-dom";
import Overview from './views/Overview';
import DataSources from './views/DataSources';
import Dashboards from './views/Dashboards';
import Test from './views/Test';
import EditDataSource from './views/EditDataSource';
import DashboardEditView from './views/DashboardEditView';

import SingleTest from './views/SingleTest';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'overview',
      menuMin: ''
    }
  }

  componentDidMount() {
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  toggleMenu = () => {
    const menuMin = this.state.menuMin === '' ? 'menu-min' : '';
    this.setState({
      menuMin: menuMin
    });
  }

  render() {
    return (
      <div className="App">
        <div className="Nav">
          <div className="Nav_title-bar">
            <div className="Nav_title">Poli</div>
          </div>
          <div className="Nav_menu">
            <ul className="menu">
              <li>
                <Link to="/overview">
                  <i class="fas fa-heartbeat fa-fw"></i>
                  <span class="menu-text">Overview</span>
                </Link>
              </li>
              <li>
                <Link to="/datasources">
                  <i class="fas fa-database fa-fw"></i>
                  <span class="menu-text">Data Sources</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboards">
                  <i class="fas fa-chalkboard fa-fw"></i>
                  <span class="menu-text">Dashboards</span>
                </Link>
              </li>
              <li>
                <Link to="/test">Test</Link>
              </li>
              <li>
                <Link to="/single-test">SingleTest</Link>
              </li>
              
            </ul>
            <div className="Nav__toggle-menu">
              <div onClick={this.toggleMenu}>toggle</div>
            </div>
          </div>
        </div>
        <div className={`Status_bar ${this.state.menuMin}`}>
        </div>
        <div className={`Content ${this.state.menuMin}`}>
          <Route exact path="/" component={Overview} />
          <Route exact path="/overview" component={Overview} />
          <Route exact path="/datasources" component={DataSources} />
          <Route exact path="/dashboards" component={Dashboards} />
          <Route exact path="/test" component={Test} />
          <Route exact path="/datasources/new" component={EditDataSource} />
          <Route exact path="/datasources/edit/:id" component={EditDataSource} />
          <Route exact path="/dashboard/new" component={DashboardEditView} />
          <Route exact path="/dashboard/edit/:id" component={DashboardEditView} />
          <Route exact path="/single-test" component={SingleTest} />
        </div>
      </div>
    );
  }
}
export default App;
