
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
            <div style={{paddingTop: '10px'}}>
              <Group />
            </div>
          </div>
          <div title="User">
            <div style={{paddingTop: '10px'}}>
              <User {...this.props} />
            </div>
          </div>
        </Tabs>
      </div>
    )
  };
}

export default UserManagement;