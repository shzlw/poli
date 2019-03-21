
import React from 'react';
import { Route, Link, Switch } from "react-router-dom";
import User from './User';
import Group from './Group';

const MENU_ITEMS = [
  {
    link: '/user-management/user',
    value: 'User',
    icon: 'fa-user'
  }, 
  {
    link: '/user-management/group',
    value: 'Group',
    icon: 'fa-chalkboard',
  }
];

class UserManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentMenuLink: 'group',
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
      const active = this.state.currentMenuLink === menu.link ? 'active' : '';
      menuItems.push(
        (
          <li className={active} key={menu.name}>
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
        <h3>UserManagement</h3>
        {menuItems}
        <div>
          <Switch>
            <Route path="/user-management/user" component={User} />
            <Route path="/user-management/group" component={Group} />
          </Switch>
        </div>
      </div>
    )
  };
}

export default UserManagement;