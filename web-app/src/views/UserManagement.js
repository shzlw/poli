
import React from 'react';
import { Route, Link, Switch } from "react-router-dom";
import User from './User';
import Group from './Group';
import './UserManagement.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const MENU_ITEMS = [
  {
    link: '/workspace/user-management/group',
    value: 'Group',
    icon: 'fa-user-cog',
  },
  {
    link: '/workspace/user-management/user',
    value: 'User',
    icon: 'fa-users'
  }
];

class UserManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentMenuLink: '',
    }
  }

  handleMenuClick = (menuLink) => {
    this.setState({
      currentMenuLink: menuLink
    });
  }

  render() {

    let menuItems = [];
    for (let i = 0; i < MENU_ITEMS.length; i++) {
      const menu = MENU_ITEMS[i];
      const active = this.state.currentMenuLink === menu.link ? 'nav-menu-item-active' : '';
      menuItems.push(
        (
          <li className={active} key={i}>
            <Link to={menu.link} onClick={() => this.handleMenuClick(menu.link)}>
              <FontAwesomeIcon icon={menu.icon} fixedWidth />
              <span className="app-nav-menu-text">{menu.value}</span>
            </Link>
          </li>
        )
      );
    }

    return (
      <React.Fragment>
        <div>
          <ul className="nav-menu">
            {menuItems}
          </ul>
        </div>
        <div>
          <Switch>
            <Route path="/workspace/user-management/user" component={User} />
            <Route path="/workspace/user-management/group" component={Group} />
          </Switch>
        </div>
      </React.Fragment>
    )
  };
}

export default UserManagement;