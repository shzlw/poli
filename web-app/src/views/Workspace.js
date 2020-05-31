import React from 'react';
import { Route, Switch, withRouter } from "react-router-dom";
import axios from 'axios';
import { withTranslation } from 'react-i18next';

import DataSource from './DataSource';
import Report from './Report/Report';
import User from './UserManagement/User';
import Group from './UserManagement/Group'
import Account from './Account';
import ReportFullScreenView from './ReportFullScreenView';
import PageNotFound from './PageNotFound';
import Studio from './Studio/Studio';
import SharedReportView from './Event/SharedReportView';
import AuditLog from './Event/AuditLog';

import * as Constants from '../api/Constants';
import './Workspace.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MENU_ITEMS = [
  {
    link: '/workspace/studio',
    value: 'Studio',
    icon: 'bolt',
  }, 
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
    value: 'User Management',
    icon: 'users-cog',
    dropdowns: [
      {
        link: '/workspace/group',
        value: 'Group',
      },
      {
        link: '/workspace/user',
        value: 'User',
      }
    ]
  },
  {
    value: 'Event',
    icon: 'search-location',
    dropdowns: [
      {
        link: '/workspace/sharedreport',
        value: 'Shared Report',
      },
      {
        link: '/workspace/auditlog',
        value: 'Audit Log',
      }
    ]
  }
];

const ACCOUNT_MENU_LINK = '/workspace/account';

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenuLink: '/workspace/report',
      showAccountDropdown: false,
      menutItems: MENU_ITEMS
    }
  }

  componentDidMount() {
    const pathname = this.props.location.pathname;
    let link = '';
    if (pathname.startsWith(ACCOUNT_MENU_LINK)) {
      link = ACCOUNT_MENU_LINK;
    } else {
      const { menutItems } = this.state; 
      const index = menutItems.findIndex(m => pathname.startsWith(m.link));
      if (index !== -1) {
        link = menutItems[index].link;
      }
    }

    this.setState({
      currentMenuLink: link,
    });
  }

  handleMenuClick = (menu) => {
    const { menutItems } = this.state;
    const menutItemsClone = [...menutItems];

    if (menu.dropdowns) {
      for (let i = 0; i < menutItemsClone.length; i++) {
        if (menutItemsClone[i].value === menu.value) {
          menutItemsClone[i].showDropdown = !menutItemsClone[i].showDropdown;
        } else {
          menutItemsClone[i].showDropdown = false;
        }
      }
      
      this.setState({
        menuItems: menutItemsClone
      });
    } else {
      for (let i = 0; i < menutItemsClone.length; i++) {
        menutItemsClone[i].showDropdown = false;
      }
        
      this.setState({
        currentMenuLink: menu.link,
        menutItems: menutItemsClone,
        showAccountDropdown: false
      }, () => {
        this.props.history.push(menu.link);
      });
    }
  }

  logout = () => {
    axios.get('/auth/logout')
      .then(res => {
        this.setState({
          showAccountDropdown: false
        }, () => {
          this.props.onLogout();
        });
      });
  }

  onAccountMenuClick = () => {
    this.setState(prevState => ({
      showAccountDropdown: !prevState.showAccountDropdown
    })); 
  }

  goToSubLink = (link) => {
    const { menutItems } = this.state;
    const menutItemsClone = [...menutItems];
    for (let i = 0; i < menutItemsClone.length; i++) {
      menutItemsClone[i].showDropdown = false;
    }
      
    this.setState({
      currentMenuLink: '',
      menutItems: menutItemsClone,
      showAccountDropdown: false
    }, () => {
      this.props.history.push(link);
    });
  }

  closeMenuDropdown = () => {
    const { menutItems } = this.state;
    const menutItemsClone = [...menutItems];
    for (let i = 0; i < menutItemsClone.length; i++) {
      menutItemsClone[i].showDropdown = false;
    }
      
    this.setState({
      menutItems: menutItemsClone,
      showAccountDropdown: false
    });
  }

  render() {
    const { t } = this.props;
    
    const {
      currentMenuLink,
      menutItems
    } = this.state;
    
    const {
      username,
      sysRole
    } = this.props;

    let menuItems = [];
    let menuList = [];
    if (sysRole === Constants.SYS_ROLE_VIEWER) {
      menuList = menutItems.filter(m => m.link === '/workspace/report');
    } else {
      menuList = menutItems;
    }
    for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i];
      const active = currentMenuLink === menu.link ? 'menu-item-active' : '';

      const {
        dropdowns = []
      } = menu;
      const dropdownItems = dropdowns.map(d => {
        return (
          <div className="workspace-dropdown-button" onClick={() => this.goToSubLink(d.link)}>
            {d.value}
          </div>
        );
      });


      menuItems.push(
        (
          <div key={menu.link} className={`workspace-nav-menu-item ${active}`}>
            <div className="workspace-nav-menu-item-value" onClick={() => this.handleMenuClick(menu)}>
              <FontAwesomeIcon icon={menu.icon} fixedWidth />
              <span className="workspace-nav-menu-text">{t(menu.value)}</span>
            </div>
            { menu.showDropdown && (
              <div className="workspace-nav-menu-item-dropdown">
                {dropdownItems}
              </div>
            )}
          </div>
        )
      );
    }

    return (
      <React.Fragment>
        <div className="workspace-nav">  
          <div className="workspace-name">{t('Poli')}</div>
          <div className="workspace-nav-menu">
            {menuItems}
          </div>
          <div className="workspace-account-menu">
            <div className="workspace-account-button" onClick={this.onAccountMenuClick}>
              <FontAwesomeIcon icon="user" fixedWidth />
              <span className="workspace-nav-menu-text">{username}</span>
            </div>
            { this.state.showAccountDropdown && (
              <div className="workspace-account-dropdown">
                <div className="workspace-dropdown-button" onClick={() => this.goToSubLink('/workspace/account')}>
                  Account
                </div>
                <div className="workspace-dropdown-button" onClick={this.logout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="workspace-content">
          <Switch>
            <Route exact path="/workspace/datasource" component={DataSource} />
            <Route exact path="/workspace/account" component={Account} />
            <Route exact path="/workspace/report/fullscreen" component={ReportFullScreenView} />
            <Route exact path="/workspace/group" component={Group} />
            <Route exact path="/workspace/user" render={() => <User {...this.props} />} />
            <Route exact path="/workspace/auditlog" component={AuditLog} />
            <Route exact path="/workspace/sharedreport" component={SharedReportView} />
            <Route exact path="/workspace/studio" component={Studio} />
            <Route path="/workspace/report" render={() => <Report {...this.props} />} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default (withTranslation()(withRouter(Workspace)));

