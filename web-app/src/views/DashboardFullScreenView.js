
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
  }

  render() {
    const pathname = this.props.location.pathname;
    return (
      <div className="full-screen-view">
        <DashboardEditView key={pathname} />
      </div>
    )
  };
}

export default DashboardFullScreenView;
