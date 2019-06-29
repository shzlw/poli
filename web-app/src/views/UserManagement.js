
import React from 'react';
import { withTranslation } from 'react-i18next';

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
    const { t } = this.props;

    return (
      <div className="full-page-content">
        <Tabs
          activeTab={this.state.activeTab}
          onTabChange={this.onTabChange}
          >
          <div title={t('Group')}>
            <div style={{paddingTop: '10px'}}>
              <Group />
            </div>
          </div>
          <div title={t('User')}>
            <div style={{paddingTop: '10px'}}>
              <User {...this.props} />
            </div>
          </div>
        </Tabs>
      </div>
    )
  };
}

export default (withTranslation()(UserManagement));