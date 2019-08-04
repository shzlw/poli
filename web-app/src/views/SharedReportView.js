import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SHARED_REPORT_TABLE_HEADERS = ['Name', 'Type', 'Created By', 'Create Date', 'Expired By', 'Share Key', 'Actions'];

class SharedReportView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sharedReportRows: []
    };
  }

  componentDidMount() {
    this.fetchSharedReportsRows();
  }

  fetchSharedReportsRows = () => {
    axios.get('/ws/report/share')
      .then(res => {
        const sharedReportRows = res.data;
        this.setState({ 
          sharedReportRows: sharedReportRows 
        });
      });
  }

  openSharedReport = (shareKey) => {
    const url = `/workspace/report/fullscreen?$shareKey=${shareKey}`;
    window.open(url, '_blank');
  }

  removeSharedReport = (id) => {

  }

  render() {
    const { t } = this.props;

    const {
      sharedReportRows = []
    } = this.state;

    const sharedReportHeaderItems = SHARED_REPORT_TABLE_HEADERS.map((header, index) => 
      <th key={index}>{t(header)}</th>
    );

    const sharedReportRowItems = sharedReportRows.map((sharedReport, index) => 
      <tr key={index}>
        <td>{sharedReport.reportName}</td>
        <td>{sharedReport.reportType}</td>
        <td>{sharedReport.createdBy}</td>
        <td>{sharedReport.createDateTime}</td>
        <td>{sharedReport.expirationDate}</td>
        <td>{sharedReport.shareKey}</td>
        <td>
          <div className="float-right">
            <button className="button table-row-button ml-4" onClick={() => this.openSharedReport(sharedReport.shareKey)}>
              <FontAwesomeIcon icon="tv" />
            </button>
            <button className="button table-row-button button-red ml-4" onClick={() => this.removeSharedReport(sharedReport.id)}>
              <FontAwesomeIcon icon="trash-alt" />
            </button>
          </div>
        </td>
      </tr>
    );

    return (
      <div className="full-page-content">
        <div>
          Shared Reports
        </div>
        <div className="poli-table-panel">
          <table className="poli-table">
            <thead>
              <tr>
                {sharedReportHeaderItems}
              </tr>
            </thead>
            <tbody>
              {sharedReportRowItems}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
}

export default (withTranslation()(SharedReportView));