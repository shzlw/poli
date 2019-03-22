import React from 'react';
import { Route, Link, Switch, withRouter } from "react-router-dom";
import DataSource from './DataSource';
import Dashboard from './Dashboard';
import SingleTest from './SingleTest';
import DashboardFullScreenView from './DashboardFullScreenView';

import UserManagement from './UserManagement';
import Account from './Account';

import * as Constants from '../api/Constants';
import AuthStore from '../api/AuthStore';

const MENU_ITEMS = [
  {
    link: '/workspace/dashboard',
    value: 'Dashboard',
    icon: 'fa-chalkboard',
  }, 
  {
    link: '/workspace/datasource',
    value: 'Data source',
    icon: 'fa-database'
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

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenuLink: '/workspace/dashboard',
      username: '',
      sysRole: ''
    }
  }

  componentDidMount() {
    console.log('Workspace - componentDidMount');
    const pathname = this.props.location.pathname;
    // TODO: fetch user information
    this.setState({
      currentMenuLink: pathname,
    });
    if (AuthStore.isAuthenticated) {
      const sysRole = AuthStore.sysRole;
      this.setState({
        sysRole: sysRole
      });
    } else {
      // Try login. If not, redirect
    }
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
    if (sysRole === Constants.SYS_ROLE_VIEWER) {
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
      <React.Fragment>
        <div className="app-nav">
          <div className="app-name">Poli</div>
          <ul className="app-nav-menu">
            {menuItems}
          </ul>
          <div style={{position: 'absolute', top: '0px', right: '0px'}}>
            <Link to="/login">logout</Link>
          </div>
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
      </React.Fragment>
    );
  }
}
export default withRouter(Workspace);
