
import React from 'react';

import User from './User';
import Group from './Group';
import Tabs from '../components/Tabs';

class UserManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'Group'
    }
  }

  onTabChange = (activeTab) => {
    this.setState({
      activeTab: activeTab
    });
  }

  render() {
    return (
      <div className="full-page-content">
        <Tabs
          activeTab={this.state.activeTab}
          onTabChange={this.onTabChange}
          >
          <div title="Group">
            <Group />
          </div>
          <div title="User">
            <User {...this.props} />
          </div>
        </Tabs>
      </div>
    )
  };
}

export default UserManagement;