
import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Report.css';
import * as Constants from '../api/Constants';
import ReportEditView from './ReportEditView';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import SearchInput from '../components/SearchInput';
import Tabs from '../components/Tabs';

const ROUTE_WORKSPACE_REPORT = '/workspace/report/';
const ROUTE_WORKSPACE_CANNED_REPORT = '/workspace/report/canned/';
const ROUTE_PATTERNS = [ROUTE_WORKSPACE_REPORT, ROUTE_WORKSPACE_CANNED_REPORT];
const AD_HOC = 'Ad Hoc';


class Report extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      reports: [],
      showEditPanel: false,
      activeReportId: 0,
      name: '',
      cannedReports: [],
      activeTab: AD_HOC,
      activeCannedReportId: 0
    }
  }

  componentDidMount() {
    const pathname = this.props.location.pathname;
    for (let i = 0; i < ROUTE_PATTERNS.length; i++) {
      const pattern = ROUTE_PATTERNS[i];
      const index = pathname.indexOf(pattern);
      if (index !== -1) {
        const activeReportId = Number(pathname.substring(index + pattern.length));
        let activeTab;
        if (pattern === ROUTE_WORKSPACE_REPORT) {
          activeTab = AD_HOC;
          this.setState({
            activeReportId: activeReportId,
            activeTab: activeTab,
            activeCannedReportId: 0
          });
        } else if (pattern === ROUTE_WORKSPACE_CANNED_REPORT) {
          activeTab = 'Canned';
          this.setState({
            activeReportId: 0,
            activeTab: activeTab,
            activeCannedReportId: activeReportId
          });
        }
        break;
      }
    }
    this.fetchReports();
    this.fetchCannedReports();
  }

  fetchReports = () => {
    axios.get('/ws/report')
      .then(res => {
        const reports = res.data;
        this.setState({ 
          reports: reports 
        });
      });
  }

  fetchCannedReports = () => {
    axios.get('/ws/cannedreport/myreport')
      .then(res => {
        const cannedReports = res.data;
        this.setState({ 
          cannedReports: cannedReports 
        });
      });
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleNameInputChange = (name, value) => {
    this.setState({
      [name]: value
    });
  }

  onTabChange = (activeTab) => {
    this.setState({
      activeTab: activeTab,
      activeCannedReportId: 0,
      activeReportId: 0
    }, () => {
      this.props.history.push('/workspace/report');
    });
  }

  closeEditPanel = () => {
    this.setState({
      showEditPanel: false,
      name: ''
    });
  }

  save = () => {
    const {
      name
    } = this.state;

    if (!name) {
      Toast.showError('Enter a name.');
      return;
    }

    const report = {
      name: name,
      style: {
        height: Constants.DEFAULT_REPORT_HEIGHT,
        backgroundColor: 'rgba(233, 235, 238, 1)',
        isFixedWidth: true,
        fixedWidth: Constants.DEFAULT_REPORT_FIXED_WIDTH
      }
    };

    axios.post('/ws/report', report)
      .then(res => {
        const reportId = res.data;
        this.closeEditPanel();
        this.fetchReports();
        this.props.history.push(`/workspace/report/${reportId}`);
        this.setState({
          activeReportId: reportId
        });
      })
      .catch(error => {
        Toast.showError('The name exists. Try another.');
      });
  }

  viewReport = (reportId) => {
    this.setState({
      activeReportId: reportId
    }, () => {
      this.props.history.push(`/workspace/report/${reportId}`);
    });
  }

  viewCannedReport = (reportId) => {
    this.setState({
      activeCannedReportId: reportId
    }, () => {
      this.props.history.push(`/workspace/report/canned/${reportId}`);
    });
  }

  onReportSave = (reportId) => {
    this.fetchReports();
  }

  onReportDelete = (reportId) => {
    this.fetchReports();
    this.setState({
      activeReportId: 0
    }, () => {
      this.props.history.push('/workspace/report');
    });
  }

  onCannedReportSave = () => {
    this.fetchCannedReports();
  }

  onCannedReportDelete = (reportId) => {
    this.fetchCannedReports();
    this.setState({
      activeCannedReportId: 0
    }, () => {
      this.props.history.push('/workspace/report');
    });
  }

  render() {
    const {
      reports = [],
      activeReportId,
      searchValue,
      cannedReports = [],
      activeCannedReportId
    } = this.state;

    const {
      sysRole
    } = this.props;
    const editable = sysRole === Constants.SYS_ROLE_VIEWER ? false : true;

    const reportRows = [];
    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];
      const name = report.name;
      const menuActive = activeReportId === report.id ? 'report-menu-item-active' : '';
      if (!searchValue || (searchValue && name.includes(searchValue))) {
        reportRows.push(
          (
            <div key={i} className={`report-menu-item ellipsis ${menuActive}`} onClick={() => this.viewReport(report.id)}>
              {name}
            </div>
          )
        )
      }
    }

    const cannedReportRows = [];
    for (let i = 0; i < cannedReports.length; i++) {
      const report = cannedReports[i];
      const name = report.name;
      const menuActive = activeCannedReportId === report.id ? 'report-menu-item-active' : '';
      if (!searchValue || (searchValue && name.includes(searchValue))) {
        cannedReportRows.push(
          (
            <div key={i} className={`report-menu-item ellipsis ${menuActive}`} onClick={() => this.viewCannedReport(report.id)}>
              {name}
            </div>
          )
        )
      }
    }

    const info = editable && reports.length === 0 ? 'Create a new report!' : 'Select a report!';

    return (
      <React.Fragment>
        <div className="report-sidebar">
          <div style={{margin: '8px 5px 5px 5px'}}>
            { editable && (
              <button className="button full-width" onClick={() => this.setState({ showEditPanel: true })}>
                <FontAwesomeIcon icon="plus" /> New
              </button>
            )}
          </div>
          <div style={{margin: '8px 5px 5px 5px'}}>
            <SearchInput 
              name={'searchValue'} 
              value={this.state.searchValue} 
              onChange={this.handleNameInputChange} 
              inputWidth={117}
            />
          </div>
          <div style={{padding: '0px 5px'}}>
            <Tabs
              activeTab={this.state.activeTab}
              onTabChange={this.onTabChange}
              >
              
              <div title="Ad Hoc">
                {reportRows}
              </div>

              <div title="Canned">
                {cannedReportRows}
              </div>
              
            </Tabs>
            
          </div>
        </div>
        <div className="report-content">
          <Switch>
            <Route 
              exact path="/workspace/report/:id" 
              render={(props) => 
                <ReportEditView 
                  key={props.match.params.id} 
                  onReportSave={this.onReportSave} 
                  onReportDelete={this.onReportDelete} 
                  editable={editable}
                  reportType={Constants.ADHOC}
                  onCannedReportSave={this.onCannedReportSave}
                />
              } 
            />
            <Route 
              path="/workspace/report/canned/:id" 
              render={(props) => 
                <ReportEditView 
                  key={props.match.params.id}  
                  onCannedReportDelete={this.onCannedReportDelete} 
                  editable={false}
                  reportType={Constants.CANNED}
                />
              } 
            />
            <EmptyReport
              info={info}
            />
          </Switch>
        </div>

        <Modal 
          show={this.state.showEditPanel}
          onClose={() => this.setState({ showEditPanel: false })}
          modalClass={'small-modal-panel'} 
          title={'New'} >
          <div className="form-panel">
            <label>Name</label>
            <input 
              className="form-input"
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} 
            />
            <button className="button button-green" onClick={this.save}>
              <FontAwesomeIcon icon="save" size="lg" fixedWidth /> Save
            </button>
          </div>
        </Modal>

      </React.Fragment>
    );
  }
}

function EmptyReport({info}) {
  return (
    <div className="empty-report">
      {info}
    </div>
  )
}

export default withRouter(Report);
