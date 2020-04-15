
import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import './Report.css';
import * as Constants from '../../api/Constants';
import ReportEditView from './ReportEditView';
import Modal from '../../components/Modal/Modal';
import Tabs from '../../components/Tabs/Tabs';
import SearchInput from '../../components/SearchInput/SearchInput';

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
      project: '',
      cannedReports: [],
      activeTab: AD_HOC,
      activeCannedReportId: 0,
      favouriteReports: [],
      projects: [],
      nonProjectReports: []
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
    this.fetchFavouriteReports();
  }

  fetchReports = () => {
    axios.get('/ws/reports')
      .then(res => {
        const reports = res.data || [];
        const projects = [];
        const nonProjectReports = [];
        for (let i = 0; i < reports.length; i++) {
          const report = reports[i];
          const {
            project
          } = report;
          if (project) {
            const index = projects.findIndex(p => p.name === project);
            if (index !== -1) {
              projects[index].reports.push(report);
            } else {
              const reports = [];
              reports.push(report);
              projects.push({
                showReports: false,
                name: project,
                reports: reports
              });
            }
          } else {
            nonProjectReports.push(report);
          } 
        }
        this.setState({ 
          reports: reports,
          projects: projects,
          nonProjectReports: nonProjectReports
        });
      });
  }

  fetchCannedReports = () => {
    axios.get('/ws/cannedreports/myreport')
      .then(res => {
        const cannedReports = res.data;
        this.setState({ 
          cannedReports: cannedReports 
        });
      });
  }

  fetchFavouriteReports = () => {
    axios.get('/ws/reports/favourite')
      .then(res => {
        const favouriteReports = res.data;
        this.setState({ 
          favouriteReports: favouriteReports 
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
      name: '',
      project: ''
    });
  }

  save = () => {
    const {
      name,
      project
    } = this.state;

    if (!name) {
      toast.error('Enter a name.');
      return;
    }

    const report = {
      name: name,
      project: project,
      style: {
        height: Constants.DEFAULT_REPORT_HEIGHT,
        backgroundColor: 'rgba(233, 235, 238, 1)',
        isFixedWidth: true,
        fixedWidth: Constants.DEFAULT_REPORT_FIXED_WIDTH,
        autoFilter: false
      }
    };

    axios.post('/ws/reports', report)
      .then(res => {
        const reportId = res.data;
        this.closeEditPanel();
        this.fetchReports();
        this.props.history.push(`/workspace/report/${reportId}`);
        this.setState({
          activeReportId: reportId,
        });
      })
      .catch(error => {
        toast.error('The name exists. Try another.');
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

  onFavouriteChange = (reportId, isFavourite) => {
    this.fetchFavouriteReports();
  }

  toggleProject = (projectName) => {
    const {
      projects
    } = this.state;

    const index = projects.findIndex(p => p.name === projectName);
    const newProjects = [...projects];
    const { showReports = false } = newProjects[index];
    newProjects[index].showReports = !showReports;
    this.setState({
      projects: newProjects
    });
  }

  render() {
    const { t } = this.props;

    const {
      reports = [],
      activeReportId,
      searchValue,
      cannedReports = [],
      activeCannedReportId,
      favouriteReports = [],
      projects = [],
      nonProjectReports = []
    } = this.state;

    const {
      sysRole
    } = this.props;
    const editable = sysRole === Constants.SYS_ROLE_VIEWER ? false : true;

    const projectRows = [];
    for (let i = 0; i < projects.length; i++) {
      const {
        name: projectName,
        reports = [],
        showReports = false
      } = projects[i];
      const reportRows = [];
      for (let j = 0; j < reports.length; j++) {
        const report = reports[j];
        const reportName = report.name;
        const menuActive = activeReportId === report.id ? 'report-menu-item-active' : '';
        if (!searchValue || (searchValue && reportName.includes(searchValue))) {
          reportRows.push(
            (
              <div key={j} className={`report-menu-item ellipsis ${menuActive}`} style={{marginLeft: '12px'}} onClick={() => this.viewReport(report.id)}>
                {reportName}
              </div>
            )
          )
        }
      }

      projectRows.push(
        <div key={i}>
          <div className="project-row ellipsis" onClick={() => this.toggleProject(projectName)}>
            {showReports ? (
              <React.Fragment>
                <FontAwesomeIcon icon="angle-right" size="lg" fixedWidth /> {projectName}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <FontAwesomeIcon icon="angle-down" size="lg" fixedWidth /> {projectName}
              </React.Fragment>
            )}
          </div>
          {showReports && (
            <div>
              {reportRows}
            </div>
          )}
        </div>
      );
    }

    const nonProjectReportRows = [];
    for (let i = 0; i < nonProjectReports.length; i++) {
      const report = nonProjectReports[i];
      const name = report.name;
      const menuActive = activeReportId === report.id ? 'report-menu-item-active' : '';
      if (!searchValue || (searchValue && name.includes(searchValue))) {
        nonProjectReportRows.push(
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

    const favouriteRows = [];
    for (let i = 0; i < favouriteReports.length; i++) {
      const report = favouriteReports[i];
      const name = report.name;
      const menuActive = activeReportId === report.id ? 'report-menu-item-active' : '';
      if (!searchValue || (searchValue && name.includes(searchValue))) {
        favouriteRows.push(
          (
            <div key={i} className={`report-menu-item ellipsis ${menuActive}`} onClick={() => this.viewReport(report.id)}>
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
                <FontAwesomeIcon icon="plus" /> {t('New')}
              </button>
            )}
          </div>
          <div style={{margin: '8px 5px 5px 5px'}}>
            <SearchInput 
              name={'searchValue'} 
              value={this.state.searchValue} 
              onChange={this.handleNameInputChange} 
            />
          </div>
          <div style={{padding: '0px 5px'}}>
            <Tabs
              activeTab={this.state.activeTab}
              onTabChange={this.onTabChange}
              >

              <div title={t('Favourite')} iconOnly={true} icon={'heart'}>
                {favouriteRows}
              </div>
              
              <div title={t('Ad Hoc')} iconOnly={true} icon={'clipboard'}>
                {projectRows}
                {nonProjectReportRows}
              </div>

              <div title={t('Canned')} iconOnly={true} icon={'archive'}>
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
                  onFavouriteChange={this.onFavouriteChange}
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
              info={t(info)}
            />
          </Switch>
        </div>

        <Modal 
          show={this.state.showEditPanel}
          onClose={() => this.setState({ showEditPanel: false })}
          modalClass={'small-modal-panel'} 
          title={t('New')} >
          <div className="form-panel">
            <label>{t('Name')}</label>
            <input 
              className="form-input"
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} 
            />

            <label>{t('Project')}</label>
            <input 
              className="form-input"
              type="text" 
              name="project" 
              value={this.state.project}
              onChange={this.handleInputChange} 
            />

            <button className="button button-green" onClick={this.save}>
              <FontAwesomeIcon icon="save"  fixedWidth /> {t('Save')}
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

export default (withTranslation()(withRouter(Report)));
