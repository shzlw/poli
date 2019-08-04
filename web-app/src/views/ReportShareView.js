import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';

class ReportShareView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      reportShareRows: []
    };
  }

  componentDidMount() {
    this.fetchReportShareRows();
  }

  fetchReportShareRows = () => {
    axios.get('/ws/report/share')
      .then(res => {
        const reportShareRows = res.data;
        this.setState({ 
          reportShareRows: reportShareRows 
        });
      });
  }

  render() {

    const {
      reportShareRows = []
    } = this.state;

    const reportShareItems = [];
    for (let i = 0; i < reportShareRows.length; i++) {
      const reportShare = reportShareRows[i];
      reportShareItems.push(
        (
          <div key={i} className="row table-row">
            <div className="float-left ellipsis">
              {reportShare.reportName}-
              {reportShare.reportType}-
              {reportShare.createdBy}-
              {reportShare.createDateTime}-
              {reportShare.expirationDate}-
              {reportShare.shareKey}
            </div>
          </div>
        )
      );
    }

    return (
      <div className="full-page-content">
        ReportShareView
        {reportShareItems}
      </div>
    );
  };
}

export default (withTranslation()(ReportShareView));