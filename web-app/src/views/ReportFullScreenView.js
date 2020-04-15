
import React from 'react';
import ReportEditView from './Report/ReportEditView';

class ReportFullScreenView extends React.Component {

  render() {
    const href = window.location.href;
    
    return (
      <div className="full-screen-view">
        <ReportEditView key={href} />
      </div>
    );
  };
}

export default ReportFullScreenView;
