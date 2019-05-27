
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
    const search = this.props.location.search;
    const currentPath = pathname + search;
    
    return (
      <div className="full-screen-view">
        <ReportEditView key={currentPath} />
      </div>
    )
  };
}

export default ReportFullScreenView;
