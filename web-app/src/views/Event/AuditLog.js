import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';

import SearchInput from '../../components/SearchInput/SearchInput';
import * as ApiService from '../../api/ApiService';

class AuditLog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      auditLogList: [],
      searchValue: '',
      page: 1,
      pageSize: 20,
      lastPage: 2,
    }
  }

  componentDidMount() { 
    this.fetchAuditLogs();
  }

  handleNameInputChange = (name, value) => {
    this.setState({
      [name]: value
    });
  }

  fetchAuditLogs = async () => {
    const {
      searchValue,
      page,
      pageSize
    } = this.state;

    const { data: auditLogList = [] } = await ApiService.fetchAuditLogs(page, pageSize, searchValue);
    const lastPage = auditLogList.length < pageSize ? page : page + 1;
    this.setState({
      auditLogList,
      lastPage
    });
  }

  search = () => {
    this.fetchAuditLogs();
  }

  nextPage = () => {
    const { 
      page = 1,
      lastPage = 2
    } = this.state;
    if (page < lastPage) {
      this.setState({
        page: page + 1
      }, () => {
        this.search();
      });
    }
  }

  prevPage = () => {
    const { page = 1 } = this.state;
    if (page > 1) {
      this.setState({
        page: page - 1
      }, () => {
        this.search();
      });
    }
  }

  render() {

    const { t } = this.props;

    const {
      page,
      lastPage,
      auditLogList = []
    } = this.state;

    const auditLogItems = auditLogList.map((auditLog, index) => {
      return (
        <tr key={index}>
          <td className="ellipsis" style={{maxWidth: '300px'}}>{auditLog.createdAt}</td>
          <td className="ellipsis" style={{maxWidth: '300px'}}>{auditLog.type}</td>
          <td>{auditLog.data}</td>
        </tr>
      );
    });

    return (
      <div className="full-page-content">
        <div className="control-buttons-panel">
          <div className="float-left" style={{lineHeight: '33px', fontWeight: 700, marginRight: '15px'}}>
            {t('Audit Log')}
          </div>
          <div className="float-left">
            <SearchInput 
              name={'searchValue'} 
              value={this.state.searchValue} 
              onChange={this.handleNameInputChange} 
              inputWidth={160}
            />
          </div>
          <button className="button float-left" style={{marginLeft: '5px'}} onClick={this.search}>Search</button>
          <div className="page-button-group float-right">
            { page !== 1 && (
              <button className="button square-button" style={{marginRight: '8px'}} onClick={this.prevPage}>
                <FontAwesomeIcon icon="chevron-left" />
              </button>
            )}
            { page !== 1 && lastPage !== 1 && (
              <span>{this.state.page}</span>
            )}
            { page !== lastPage && (
              <button className="button square-button" style={{marginLeft: '8px'}} onClick={this.nextPage}>
                <FontAwesomeIcon icon="chevron-right" />
              </button>
            )}
          </div>
        </div>

        <div className="poli-table-panel" style={{padding: '10px 0px'}}>
          { auditLogList.length !== 0 ? (
            <table className="poli-table">
              <thead>
                <tr>
                  <th>Created At</th>
                  <th>Type</th>
                  <th>Log</th>
                </tr>
              </thead>
              <tbody>
                {auditLogItems}
              </tbody>
            </table>  
          ) : (
            <div className="no-records-found">No records found</div>
          )}
        </div>
      </div>
    );
  }
  
}

export default (withTranslation()(AuditLog));