import React from 'react';
import { Route, Link, Switch, withRouter } from "react-router-dom";
import axios from 'axios';
import { withTranslation } from 'react-i18next';

import DataSource from './DataSource';
import Report from './Report';
import UserManagement from './UserManagement';
import Account from './Account';
import ReportFullScreenView from './ReportFullScreenView';
import PageNotFound from './PageNotFound';

import Toast from '../components/Toast';

import * as Constants from '../api/Constants';
import './Workspace.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MENU_ITEMS = [
  {
    link: '/workspace/report',
    value: 'Report',
    icon: 'chalkboard',
  }, 
  {
    link: '/workspace/datasource',
    value: 'Data Source',
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
      currentMenuLink: '/workspace/report'
    }
  }

  componentDidMount() {
    const pathname = this.props.location.pathname;
    let link;
    if (pathname.startsWith(ACCOUNT_MENU_LINK)) {
      link = ACCOUNT_MENU_LINK;
    } else {
      const menuItem = MENU_ITEMS.find(m => pathname.startsWith(m.link));
      link = menuItem.link;
    }

    this.setState({
      currentMenuLink: link,
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
    const { t } = this.props;
    
    const {
      currentMenuLink,
    } = this.state;
    
    const {
      username,
      sysRole
    } = this.props;

    let menuItems = [];
    let menuList = [];
    if (sysRole === Constants.SYS_ROLE_VIEWER) {
      menuList = MENU_ITEMS.filter(m => m.link === '/workspace/report');
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
              <span className="workspace-nav-menu-text">{t(menu.value)}</span>
            </Link>
          </li>
        )
      );
    }

    const isAccountMenuActive = currentMenuLink === ACCOUNT_MENU_LINK ? 'menu-item-active' : '';
    return (
      <React.Fragment>
        <div className="workspace-nav">  
          <div className="workspace-name">{t('Poli')}</div>
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
            <Route exact path="/workspace/report/fullscreen" component={ReportFullScreenView} />
            <Route exact path="/workspace/usermanagement" render={() => <UserManagement {...this.props} />} />
            <Route path="/workspace/report" render={() => <Report {...this.props} />} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
        <Toast />
      </React.Fragment>
    );
  }
}

export default (withTranslation()(withRouter(Workspace)));

