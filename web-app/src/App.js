import React, { Component } from 'react';
import './App.css';

import { Route, Link } from "react-router-dom";
import Overview from './views/Overview';
import DataSources from './views/DataSources';
import Dashboards from './views/Dashboards';
import Test from './views/Test';
import DashboardEditView from './views/DashboardEditView';

import SingleTest from './views/SingleTest';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'overview',
      menuMin: false,
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
    this.setState(prevState => ({
      menuMin: !prevState.menuMin
    })); 
  }

  render() {
    let menuMinClass;
    let appName;
    if (this.state.menuMin) {
      menuMinClass = 'menu-min';
      appName = 'P';
    } else {
      menuMinClass = '';
      appName = 'Poli'
    }

    return (
      <div className="App">
        <div className="Nav">
          <div className="Nav_title-bar">
            <div className="Nav_title">{appName}</div>
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
        <div className={`Content ${menuMinClass}`}>
          <Route exact path="/" component={Overview} />
          <Route exact path="/overview" component={Overview} />
          <Route exact path="/datasources" component={DataSources} />
          <Route exact path="/dashboards" component={Dashboards} />
          <Route exact path="/dashboards" component={Dashboards} />
          <Route exact path="/dashboard/new" render={() => <DashboardEditView menuMin={this.menuMin} />} />
          <Route exact path="/dashboard/edit/:id" render={() => <DashboardEditView menuMin={this.menuMin} />} />
          <Route exact path="/test" component={Test} />
          <Route exact path="/single-test" component={SingleTest} />
        </div>
      </div>
    );
  }
}
export default App;
