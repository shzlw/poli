import React from 'react';
import { withTranslation } from 'react-i18next';
import SharedReportView from './SharedReportView';

class EventView extends React.Component {

  render() {
    return (
      <div className="full-page-content">
        <SharedReportView />
      </div>
    );
  };
}

export default (withTranslation()(EventView));