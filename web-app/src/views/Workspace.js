import React from 'react';
import { Route, Link, Switch, withRouter } from "react-router-dom";
import DataSource from './DataSource';
import Dashboard from './Dashboard';
import DashboardFullScreenView from './DashboardFullScreenView';

import UserManagement from './UserManagement';
import Account from './Account';

import * as Constants from '../api/Constants';
import AuthStore from '../api/AuthStore';
import './Workspace.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MENU_ITEMS = [
  {
    link: '/workspace/dashboard',
    value: 'Dashboard',
    icon: 'chalkboard',
  }, 
  {
    link: '/workspace/datasource',
    value: 'Data source',
    icon: 'database'
  }, 
  {
    link: '/workspace/user-management',
    value: 'User Management',
    icon: 'users-cog'
  }
];

const ACCOUNT_MENU_LINK = '/workspace/account';

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
              <FontAwesomeIcon icon={menu.icon} />
              <span className="workspace-nav-menu-text">{menu.value}</span>
            </Link>
          </li>
        )
      );
    }

    const isAccountMenuActive = currentMenuLink === ACCOUNT_MENU_LINK ? 'active' : '';

    return (
      <React.Fragment>
        <div className="workspace-nav">  
          <div className="workspace-name">Poli</div>
          <ul className="workspace-nav-menu">
            {menuItems}
          </ul>
          <div className="workspace-account-menu">
            <div className={isAccountMenuActive}>
              <Link to="/workspace/account" onClick={() => this.handleMenuClick(ACCOUNT_MENU_LINK)}>
                <i className="fas fa-user fa-fw"></i>
                <span className="workspace-nav-menu-text">Account</span>
              </Link>
            </div>
            <Link to="/login">
              <i className="fas fa-sign-out-alt"></i>
              logout
            </Link>
          </div>
        </div>
        <div className="workspace-content">
          <Switch>
            <Route exact path="/workspace/datasource" component={DataSource} />
            <Route exact path="/workspace/dashboard/view" component={DashboardFullScreenView} />
            <Route exact path="/workspace/account" component={Account} />
            <Route path="/workspace/dashboard" component={Dashboard} />
            <Route path="/workspace/user-management" component={UserManagement} />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(Workspace);
