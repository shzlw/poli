import React from 'react';
import { withTranslation } from 'react-i18next';
import ReportShareView from './ReportShareView';

class EventView extends React.Component {

  render() {
    return (
      <div className="full-page-content">
        EventView
        <ReportShareView />
      </div>
    );
  };
}

export default (withTranslation()(EventView));