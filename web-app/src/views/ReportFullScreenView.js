
import React from 'react';
import ReportEditView from './ReportEditView';

class ReportFullScreenView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const pathname = this.props.location.pathname;
    return (
      <div className="full-screen-view">
        <ReportEditView key={pathname} />
      </div>
    )
  };
}

export default ReportFullScreenView;
