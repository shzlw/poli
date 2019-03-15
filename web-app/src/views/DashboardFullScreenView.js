
import React from 'react';
import ReactDOM from 'react-dom';
import DashboardEditView from './DashboardEditView';

class DashboardFullScreenView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    const url = this.props.location.search;
    console.log('url', url);
    const params = new URLSearchParams(url);
    const dashboardName = params.get('name');
    console.log('name', dashboardName);
    console.log('dashboardEditView', this.dashboardEditView);

    this.dashboardEditView.loadViewByDashboardName(dashboardName);
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
