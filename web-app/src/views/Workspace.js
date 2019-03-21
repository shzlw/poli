import React from 'react';

import { Route, Link, Switch } from "react-router-dom";
import DataSource from './DataSource';
import Dashboard from './Dashboard';
import SingleTest from './SingleTest';
import DashboardFullScreenView from './DashboardFullScreenView';

import UserManagement from './UserManagement';
import Account from './Account';

const MENU_ITEMS = [
  {
    link: '/workspace/datasource',
    value: 'Data source',
    icon: 'fa-database'
  }, 
  {
    link: '/workspace/dashboard',
    value: 'Dashboard',
    icon: 'fa-chalkboard',
  }, 
  {
    link: '/workspace/single-test',
    value: 'Single test',
    icon: ''
  },
  {
    link: '/workspace/user-management',
    value: 'User Management',
    icon: 'fa-users-cog'
  }, 
  {
    link: '/workspace/account',
    value: 'Account',
    icon: 'fa-user'
  }
];

const SYS_ROLE_ADMIN = 'admin';
const SYS_ROLE_DEVELOPER = 'developer';
const SYS_ROLE_VIEWER = 'viewer';

class Workspace extends React.Component {
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
      <div>
        <div className="app-nav">
          <div className="app-name">Poli</div>
          <ul className="app-nav-menu">
            {menuItems}
          </ul>
        </div>
        <div className="app-content">
          <Switch>
            <Route exact path="/workspace/datasource" component={DataSource} />
            <Route path="/workspace/dashboard" component={Dashboard} />
            <Route exact path="/workspace/single-test" component={SingleTest} />
            <Route exact path="/workspace/dashboard/view" component={DashboardFullScreenView} />
            <Route path="/workspace/user-management" component={UserManagement} />
            <Route exact path="/workspace/account" component={Account} />
          </Switch>
        </div>
      </div>
    );
  }
}
export default Workspace;
