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
      menuMin: '',
      appName: 'Poli'
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
    let menuMin;
    let appName;
    if (this.state.menuMin === '') {
      menuMin = 'menu-min';
      appName = 'P';
    } else {
      menuMin = '';
      appName = 'Poli'
    }
    this.setState({
      menuMin: menuMin,
      appName: appName
    });
  }

  render() {
    return (
      <div className="App">
        <div className="Nav">
          <div className="Nav_title-bar">
            <div className="Nav_title">{this.state.appName}</div>
          </div>
          <div className="Nav_menu">
            <ul className="menu">
              <li>
                <Link to="/overview">
                  <i className="fas fa-heartbeat fa-fw"></i>
                  <span className="menu-text">Overview</span>
                </Link>
              </li>
              <li>
                <Link to="/datasources">
                  <i className="fas fa-database fa-fw"></i>
                  <span className="menu-text">Data Sources</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboards">
                  <i className="fas fa-chalkboard fa-fw"></i>
                  <span className="menu-text">Dashboards</span>
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
              <div style={{margin: '5px 0px 5px 15px', color: 'red'}} onClick={this.toggleMenu}>
                <i class="fas fa-arrows-alt-h fa-fw fa-lg"></i>
              </div>
            </div>
          </div>
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
