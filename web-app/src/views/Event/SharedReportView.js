import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from '../../components/Modal/Modal';

const SHARED_REPORT_TABLE_HEADERS = ['Name', 'Type', 'Created By', 'Create Date', 'Expired By', 'Share Key', 'Actions'];

class SharedReportView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sharedReportRows: [],
      showConfirmDeletionPanel: false,
      objectToDelete: {}
    };
  }

  componentDidMount() {
    this.fetchSharedReportsRows();
  }

  fetchSharedReportsRows = () => {
    axios.get('/ws/sharedreports')
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

  confirmDelete = () => {
    const { 
      objectToDelete = {} 
    } = this.state;
    axios.delete('/ws/sharedreports/' + objectToDelete.id)
      .then(res => {
        this.fetchSharedReportsRows();
        this.closeConfirmDeletionPanel();
      });
  }

  openConfirmDeletionPanel = (sharedReport) => {
    this.setState({
      objectToDelete: sharedReport,
      showConfirmDeletionPanel: true
    });
  }

  closeConfirmDeletionPanel = () => {
    this.setState({
      objectToDelete: {},
      showConfirmDeletionPanel: false
    });
  }

  render() {
    const { t } = this.props;

    const {
      sharedReportRows = [],
      showConfirmDeletionPanel,
      objectToDelete = {}
    } = this.state;

    const sharedReportHeaderItems = SHARED_REPORT_TABLE_HEADERS.map((header, index) => 
      <th key={index}>{t(header)}</th>
    );

    const sharedReportRowItems = sharedReportRows.map((sharedReport, index) => 
      <tr key={sharedReport.id}>
        <td>{sharedReport.reportName}</td>
        <td>{sharedReport.reportType}</td>
        <td>{sharedReport.createdBy}</td>
        <td>{sharedReport.createDateTime}</td>
        <td>{sharedReport.expirationDate}</td>
        <td>{sharedReport.shareKey}</td>
        <td style={{width: '50px'}}>
          <div className="float-right">
            <button className="icon-button card-icon-button" onClick={() => this.openSharedReport(sharedReport.shareKey)}>
              <FontAwesomeIcon icon="tv"  />
            </button>
            <button className="icon-button card-icon-button" onClick={() => this.openConfirmDeletionPanel(sharedReport)}>
              <FontAwesomeIcon icon="trash-alt"  />
            </button>
          </div>
        </td>
      </tr>
    );

    return (
      <div className="full-page-content">
        <div style={{marginBottom: '10px', fontSize: '20px'}}>
          {t('Shared Reports')}
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

        <Modal 
          show={showConfirmDeletionPanel}
          onClose={this.closeConfirmDeletionPanel}
          modalClass={'small-modal-panel'}
          title={t('Confirm Deletion')} >
          <div className="confirm-deletion-panel">
            {t('Are you sure you want to delete')} {objectToDelete.reportName}?
          </div>
          <button className="button button-red full-width" onClick={this.confirmDelete}>{t('Delete')}</button>
        </Modal>
      </div>
    );
  };
}

export default (withTranslation()(SharedReportView));