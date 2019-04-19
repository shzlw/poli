import React from 'react';
import { Route, Link, Switch, withRouter } from "react-router-dom";
import axios from 'axios';
import DataSource from './DataSource';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import Account from './Account';
import DashboardFullScreenView from './DashboardFullScreenView';

import Toast from '../components/Toast';

import * as Constants from '../api/Constants';
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
    link: '/workspace/usermanagement',
    value: 'User Management',
    icon: 'users-cog'
  }
];

const ACCOUNT_MENU_LINK = '/workspace/account';

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenuLink: '/workspace/dashboard'
    }
  }

  componentDidMount() {
    const pathname = this.props.location.pathname;
    const menuItem = MENU_ITEMS.find(m => pathname.startsWith(m.link));
    this.setState({
      currentMenuLink: menuItem.link,
    });
  }

  handleMenuClick = (menuLink) => {
    this.setState({
      currentMenuLink: menuLink
    });
  }

  logout = () => {
    axios.get('/auth/logout')
      .then(res => {
        this.props.onLogout();
      });
  }

  render() {
    const {
      currentMenuLink,
    } = this.state;
    
    console.log('Workspace - render');

    const {
      username,
      sysRole
    } = this.props;

    let menuItems = [];
    let menuList = [];
    if (sysRole === Constants.SYS_ROLE_VIEWER) {
      menuList = MENU_ITEMS.filter(m => m.link === '/workspace/dashboard');
    } else {
      menuList = MENU_ITEMS;
    }
    for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i];
      const active = currentMenuLink === menu.link ? 'menu-item-active' : '';
      menuItems.push(
        (
          <li key={menu.link} className={active}>
            <Link to={menu.link} onClick={() => this.handleMenuClick(menu.link)}>
              <FontAwesomeIcon icon={menu.icon} fixedWidth />
              <span className="workspace-nav-menu-text">{menu.value}</span>
            </Link>
          </li>
        )
      );
    }

    const isAccountMenuActive = currentMenuLink === ACCOUNT_MENU_LINK ? 'menu-item-active' : '';

    return (
      <React.Fragment>
        <div className="workspace-nav">  
          <div className="workspace-name">Poli</div>
          <ul className="workspace-nav-menu">
            {menuItems}
          </ul>
          <div className="workspace-account-menu">
            <div className={`workspace-account-button inline-block ${isAccountMenuActive}`}>
              <Link to="/workspace/account" onClick={() => this.handleMenuClick(ACCOUNT_MENU_LINK)}>
                <FontAwesomeIcon icon="user" fixedWidth />
                <span className="workspace-nav-menu-text">{username}</span>
              </Link>
            </div>
            <div className="workspace-logout-button inline-block" onClick={this.logout}>
              <FontAwesomeIcon icon="sign-out-alt" fixedWidth />
            </div>
          </div>
        </div>
        <div className="workspace-content">
          <Switch>
            <Route exact path="/workspace/datasource" component={DataSource} />
            <Route exact path="/workspace/account" component={Account} />
            <Route exact path="/workspace/dashboard/view" component={DashboardFullScreenView} />
            <Route exact path="/workspace/usermanagement" component={UserManagement} />
            <Route path="/workspace/dashboard" render={() => <Dashboard {...this.props} />} />
          </Switch>
        </div>
        <Toast />
      </React.Fragment>
    );
  }
}
export default withRouter(Workspace);
