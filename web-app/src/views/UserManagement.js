
import React from 'react';

import User from './User';
import Group from './Group';
import './UserManagement.css';
import Tabs from '../components/Tabs';

class UserManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <React.Fragment>
        <Tabs activeTab="Group">
          <div title="Group">
            <Group />
          </div>
          <div title="User">
            <User />
          </div>
        </Tabs>
      </React.Fragment>
    )
  };
}

export default UserManagement;