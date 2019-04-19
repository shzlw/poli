
import React from 'react';
import DashboardEditView from './DashboardEditView';

class DashboardFullScreenView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    console.log('DashboardFullScreenView', 'componentDidMount');
    this.dashboardEditView.loadViewByDashboardName();
  }

  render() {
    return (
      <div className="full-screen-view">
        <DashboardEditView wrappedComponentRef={comp => (this.dashboardEditView = comp)} />
      </div>
    )
  };
}

export default DashboardFullScreenView;
