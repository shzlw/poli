import React, { Component } from 'react';
import './App.css';

import { Route, Link, Switch } from "react-router-dom";
import DataSource from './views/DataSource';
import Dashboard from './views/Dashboard';
import SingleTest from './views/SingleTest';
import DashboardFullScreenView from './views/DashboardFullScreenView';

import UserManagement from './views/UserManagement';
import Account from './views/Account';

const MENU_ITEMS = [
  {
    link: '/datasource',
    value: 'Data source',
    icon: 'fa-database'
  }, 
  {
    link: '/dashboard',
    value: 'Dashboard',
    icon: 'fa-chalkboard',
  }, 
  {
    link: '/single-test',
    value: 'Single test',
    icon: ''
  },
  {
    link: '/user-management',
    value: 'User Management',
    icon: 'fa-users-cog'
  }, 
  {
    link: '/account',
    value: 'Account',
    icon: 'fa-user'
  }
];

const SYS_ROLE_ADMIN = 'admin';
const SYS_ROLE_DEVELOPER = 'developer';
const SYS_ROLE_VIEWER = 'viewer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenuItem: 'dashboard',
      username: '',
      sysRole: ''
    }
  }

  componentDidMount() {
    console.log('app');
    // TODO: fetch user information
    this.setState({
      username: 'testuser',
      sysRole: SYS_ROLE_DEVELOPER
    })
  }

  handleMenuClick = (menuLink) => {
    this.setState({
      currentMenuLink: menuLink
    });
  }

  render() {
    const {
      currentMenuLink,
      sysRole
    } = this.state;

    let menuItems = [];
    let menuList = [];
    if (sysRole === SYS_ROLE_VIEWER) {
      menuList = MENU_ITEMS.filter(m => m.name === 'dashboard' || m.name === 'account');
    } else {
      menuList = MENU_ITEMS;
    }
    for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i];
      const active = currentMenuLink === menu.link ? 'active' : '';
      menuItems.push(
        (
          <li className={active} key={menu.link}>
            <Link to={menu.link} onClick={() => this.handleMenuClick(menu.link)}>
              <i className={`fas ${menu.icon} fa-fw`}></i>
              <span className="app-nav-menu-text">{menu.value}</span>
            </Link>
          </li>
        )
      );
    }
    
    return (
      <div className="app">
        <div className="app-nav">
          <div className="app-name">Poli</div>
          <ul className="app-nav-menu">
            {menuItems}
          </ul>
        </div>
        <div className="app-content">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/datasource" component={DataSource} />
            <Route path="/dashboard" component={Dashboard} />
            <Route exact path="/single-test" component={SingleTest} />
            <Route exact path="/dashboard/view" component={DashboardFullScreenView} />
            <Route path="/user-management" component={UserManagement} />
            <Route exact path="/account" component={Account} />
          </Switch>
        </div>
      </div>
    );
  }
}
export default App;
