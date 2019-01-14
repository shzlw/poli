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
          <div className="Nav_title">
          </div>
          <div className="Nav_menu">
            <ul className="menu">
              <li>
                <Link to="/overview">Overview</Link>
              </li>
              <li>
                <Link to="/datasources">Data Sources</Link>
              </li>
              <li>
                <Link to="/dashboards">Dashboards</Link>
              </li>
              <li>
                <Link to="/test">Test</Link>
              </li>
            </ul>
            <div className="Nav__toggle-menu">
              <div onClick={this.toggleMenu}>toggle</div>
            </div>
          </div>
        </div>
        <div className={`Status_bar ${this.state.menuMin}`}>
          account, logout
        </div>
        <div className={`Content ${this.state.menuMin}`}>
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
