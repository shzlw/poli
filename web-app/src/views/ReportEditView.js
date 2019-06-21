
import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ComponentViewPanel from '../components/ComponentViewPanel';
import ComponentEditPanel from '../components/ComponentEditPanel';

import Modal from '../components/Modal';
import ColorPicker from '../components/ColorPicker';
import Checkbox from '../components/Checkbox';
import Toast from '../components/Toast';

import * as Constants from '../api/Constants';
import * as Util from '../api/Util';
import './Report.css';


class ReportEditView extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      showComponentEditPanel: false,
      showConfirmDeletionPanel: false,
      showCannedReportPanel: false,
      showControl: true,
      objectToDelete: {},
      isEditMode: false,
      isFullScreenView: false,
      autoRefreshTimerId: '',
      lastRefreshed: '',
      refreshInterval: 15,
      lastRefreshLabelTimerId: '',
      jdbcDataSourceOptions: [],
      fromReport: '',
      reportId: 0,
      name: '',
      style: {},
      reportType: '',
      reportViewWidth: 1000,
      cannedReportName: '',
      cannedReportData: {}
    }

    this.componentViewPanel = React.createRef();
    this.componentEditPanel = React.createRef();
  }

  componentDidMount() {
    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode) {
      const { ownerDocument } = thisNode;
      ownerDocument.addEventListener("keydown", this.onKeyDown);
    }

    const id = this.props.match.params.id;
    if (id === undefined) {
      // If the drill through is triggered from the full-report page already, this component is remounted but not FullScreenView.
      const url = this.props.location.search;
      const params = new URLSearchParams(url);
      const reportName = params.get('$toReport');
      if (reportName !== null) {
        this.loadViewByReportName();
        return;
      }
    }
    const reportId = id !== undefined ? id : null;
    const url = this.props.location.search;
    const searchParams = new URLSearchParams(url);
    const fromReport = searchParams.get('$fromReport');

    const reportViewWidth = this.getPageWidth();
    this.setState({
      reportViewWidth: reportViewWidth,
      fromReport: fromReport
    }, () => {
      if (reportId === null) {
        this.setState({
          reportId: null
        });
      } else {
        const { reportType } = this.props;
        if (reportType === Constants.ADHOC) {
          axios.get(`/ws/report/${reportId}`)
            .then(res => {
              const report = res.data;
              this.setState({
                reportId: report.id,
                name: report.name,
                style: report.style,
                reportType: reportType
              }, () => {
                this.refresh();
              });
            });
        } else if (reportType === Constants.CANNED) {
          axios.get(`/ws/cannedreport/${reportId}`)
            .then(res => {
              const cannedReport = res.data;
              const { data: report } = cannedReport; 
              this.setState({
                reportId: cannedReport.id,
                name: report.name,
                style: report.style,
                reportType: reportType,
                cannedReportData: report
              }, () => {
                this.refresh();
              });
            });
        }
        
      }
    });

    const lastRefreshLabelTimerId = setInterval(() => {
      this.updateReadableLastRefreshed();
    }, 5000);
    this.setState({
      lastRefreshLabelTimerId: lastRefreshLabelTimerId
    })
  }

  componentWillUnmount() {
    const { 
      autoRefreshTimerId,
      lastRefreshLabelTimerId
    } = this.state;
    if (autoRefreshTimerId) {
      clearInterval(autoRefreshTimerId);
    }
    if (lastRefreshLabelTimerId) {
      clearInterval(lastRefreshLabelTimerId);
    }

    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode) {
      const { ownerDocument } = thisNode;
      ownerDocument.removeEventListener('keydown', this.onKeyDown);
    }
  }

  onKeyDown = (event) => {
    if(event.keyCode === 13) {
      this.applyFilters();
    }
  }

  loadViewByReportName = () => {
    const url = this.props.location.search;
    const params = new URLSearchParams(url);

    let showControl = params.get('$showControl');
    showControl = showControl == null ? true : (showControl ? true: false);
    const fromReport = params.get('$fromReport');
    const reportName = params.get('$toReport');
    let reportType = params.get('$reportType');
    reportType = reportType === Constants.CANNED ? Constants.CANNED : Constants.ADHOC;
    const reportViewWidth = this.getPageWidth();

    this.setState({
      isFullScreenView: true,
      name: reportName,
      reportViewWidth: reportViewWidth,
      fromReport: fromReport,
      showControl: showControl,
      reportType: reportType
    }, () => {
      // MAYBE: support canned report?
      axios.get(`/ws/report/name/${reportName}`)
        .then(res => {
          const result = res.data;
          this.setState({
            reportId: result.id,
            name: result.name,
            style: result.style
          }, () => {
            this.refresh();
          });
        });
    });
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  getPageWidth = () => {
    const thisNode = ReactDOM.findDOMNode(this);
    return thisNode.clientWidth - 40;
  }

  toggleAutoRefresh = () => {
    const { autoRefreshTimerId } = this.state;
    if (autoRefreshTimerId) {
      clearInterval(autoRefreshTimerId);
      this.setState({
        autoRefreshTimerId: ''
      });
    } else {
      const { refreshInterval } = this.state;
      let interval = parseInt(refreshInterval, 10) || 15;
      interval = interval < 1 ? 1 : interval;
      const timerId = setInterval(() => {
        this.applyFilters();
      }, interval * 1000);
      this.setState({
        autoRefreshTimerId: timerId
      });
    }
  }

  refresh = () => {
    this.refreshComponentView();
    this.updateLastRefreshed();
  }

  refreshComponentView = () => {
    const { 
      reportId,
      reportViewWidth,
      reportType,
      cannedReportData
    } = this.state;

    if (reportType === Constants.ADHOC) {
      this.componentViewPanel.current.fetchComponents(reportId, reportViewWidth, null);
    } else if (reportType === Constants.CANNED) {
      const { 
        components = []
      } = cannedReportData;
      this.componentViewPanel.current.buildViewPanel(components, reportViewWidth, false);
    }
  }

  updateLastRefreshed = () => {
    const now = new Date();
    this.setState({
      lastRefreshed: now
    }, () => {
      this.updateReadableLastRefreshed();
    });
  }

  updateReadableLastRefreshed = () => {
    const { lastRefreshed } = this.state;
    if (lastRefreshed instanceof Date) {
      const readableLastRefreshed = Util.getReadableDiffTime(lastRefreshed, new Date());
      this.setState({
        readableLastRefreshed: readableLastRefreshed
      })
    }
  }

  save = () => {
    const {
      reportId,
      name,
      style = {}
    } = this.state;

    if (style.height < 100) {
      Toast.showError('Minimum height is 100');
      return;
    }

    if (style.isFixedWidth && style.fixedWidth < 100) {
      Toast.showError('Minimum width is 100');
      return;
    }

    const report = {
      id: reportId, 
      name: name,
      style: style
    };

    axios.put('/ws/report/', report)
      .then(res => {
        this.props.onReportSave(reportId);
        this.setState({
          isEditMode: false
        });
      });
  }

  edit = () => {
    this.setState({
      isEditMode: true
    });
  }

  cancelEdit = () => {
    this.setState({
      isEditMode: false
    });
  }

  onComponentSave = (componentId) => {
    this.setState({ 
      showComponentEditPanel: false 
    });
    this.componentViewPanel.current.handleSavedComponent(componentId);
  }

  openComponentEditPanel = (componentId) => {
    this.componentEditPanel.current.fetchComponent(componentId);
    this.setState({
      showComponentEditPanel: true
    });
  }

  applyFilters = () => {
    const {
      reportType
    } = this.state;
    if (reportType === Constants.ADHOC) {
      this.componentViewPanel.current.queryCharts(this.getUrlFilterParams());
    } else if (reportType === Constants.CANNED) {
      // TODO: query local data.
    }
    this.updateLastRefreshed();
  }

  fullScreen = () => {
    const { name } = this.state;
    const url = `/workspace/report/fullscreen?$toReport=${name}`;
    window.open(url, '_blank');
  }

  handleStyleValueChange = (name, value) => {
    const style = {...this.state.style};
    style[[name]] = value;
    this.setState({
      style: style
    }, () => {
      if (name === 'isFixedWidth' || name === 'fixedWidth') {
        this.refreshComponentView();
      }
    });
  }

  onComponentContentClick = (componentClickEvent) => {
    const {
      name,
      isFullScreenView
    } = this.state;

    const {
      type,
      data
    } = componentClickEvent;

    if (type === 'tableTdClick' || type === 'chartClick') {
       const {
        reportId,
        columnName,
        columnValue
      } = data;
      if (isFullScreenView) {
        axios.get(`/ws/report/${reportId}`)
          .then(res => {
            const report = res.data;
            const nextReport = report.name;
            const nextLink = `/workspace/report/fullscreen?$toReport=${nextReport}&$fromReport=${name}&${columnName}=${columnValue}`;
            this.props.history.push(nextLink);
          });
      } else {
        const nextLink = `/workspace/report/${reportId}?$fromReport=${name}&${columnName}=${columnValue}`;
        this.props.history.push(nextLink);
      }
    }
  }

  goBackToFromReport = () => {
    this.props.history.goBack();
  }

  confirmDelete = () => {
    const { 
      objectToDelete = {},
      reportType
    } = this.state;
    const reportId = objectToDelete.id;
    
    if (reportType === Constants.ADHOC) {
      axios.delete(`/ws/report/${reportId}`)
        .then(res => {
          this.props.onReportDelete(reportId);
          this.closeConfirmDeletionPanel();
        });
    } else if (reportType === Constants.CANNED) {
      axios.delete(`/ws/cannedreport/${reportId}`)
        .then(res => {
          this.props.onCannedReportDelete(reportId);
          this.closeConfirmDeletionPanel();
        });
    }
  }

  deleteReport = () => {
    const { 
      reportId,
      name
    } = this.state;
    const report = {
      id: reportId,
      name: name
    }
    this.openConfirmDeletionPanel(report);
  }

  openConfirmDeletionPanel = (report) => {
    this.setState({
      objectToDelete: report,
      showConfirmDeletionPanel: true
    });
  }

  closeConfirmDeletionPanel = () => {
    this.setState({
      objectToDelete: {},
      showConfirmDeletionPanel: false
    });
  }

  getUrlFilterParams = () => {
    const urlFilterParams = [];
    const url = this.props.location.search;
    const searchParams = new URLSearchParams(url);
    for(let pair of searchParams.entries()) {
      const key = pair[0];
      const value = pair[1];
      const filterParam = {
        type: Constants.SINGLE_VALUE,
        param: key,
        value: value
      };
      urlFilterParams.push(filterParam);
    }
    return urlFilterParams;
  }

  saveCannedReport = () => {
    const {
      cannedReportName,
      style = {}
    } = this.state;

    if (!cannedReportName) {
      Toast.showError('Enter a name.');
      return;
    }

    const components = this.componentViewPanel.current.getComponentsSnapshot();
    if (Util.isArrayEmpty(components)) {
      Toast.showError('Report is empty.');
      return;
    }

    const report = {
      name: cannedReportName,
      data: {
        name: cannedReportName,
        style: style,
        components: components
      }
    };

    axios.post('/ws/cannedreport', report)
      .then(res => {
        this.setState({
          showCannedReportPanel: false
        });
        Toast.showSuccess('Saved.');
        this.props.onCannedReportSave();
      });
  }

  render() {
    const {
      autoRefreshTimerId,
      readableLastRefreshed,
      isEditMode,
      isFullScreenView,
      fromReport,
      showControl,
      reportType
    } = this.state;
    const autoRefreshStatus = autoRefreshTimerId === '' ? 'OFF' : 'ON';

    const commonButtonPanel = (
      <React.Fragment>
        <div className="inline-block">
          <div className="inline-block" style={{marginRight: '8px'}}>
            Last refreshed: {readableLastRefreshed}
          </div>
          { autoRefreshStatus === 'OFF' && (
            <input 
              className="form-input inline-block"
              type="text" 
              name="refreshInterval" 
              value={this.state.refreshInterval}
              onChange={this.handleInputChange}
              style={{width: '50px'}}
            />
          )}
        </div>
        <button className="button square-button button-black" onClick={this.toggleAutoRefresh}>
          {
            autoRefreshStatus === 'ON' ? 
            (
              <FontAwesomeIcon icon="stop-circle" size="lg" fixedWidth />
            ) : 
            (
              <FontAwesomeIcon icon="play-circle" size="lg" fixedWidth />
            )
          }
        </button>
        <button className="button square-button ml-4" onClick={this.refresh}>
          <FontAwesomeIcon icon="redo-alt" size="lg" fixedWidth />
        </button>
        <button className="button ml-4" onClick={this.applyFilters}>
          <FontAwesomeIcon icon="filter" size="lg" fixedWidth /> Apply Filters
        </button>
      </React.Fragment>
    );

    const fullScreenButton = (
      <button className="button square-button ml-4" onClick={this.fullScreen}>
        <FontAwesomeIcon icon="tv" size="lg" fixedWidth />
      </button>
    );

    const inEditModeButtonPanel = (
      <React.Fragment>
        <button className="button ml-4" onClick={() => this.openComponentEditPanel(null)}>
          <FontAwesomeIcon icon="calendar-plus" size="lg" fixedWidth /> New Component
        </button>
        <button className="button square-button button-red ml-4" onClick={this.deleteReport}>
          <FontAwesomeIcon icon="trash-alt" size="lg" fixedWidth />
        </button>
      </React.Fragment>
    )

    const editButton = (
      <button className="button square-button button-red ml-4" onClick={this.edit}>
        <FontAwesomeIcon icon="edit" size="lg" fixedWidth />
      </button>
    );

    let buttonGroupPanel;
    if (isFullScreenView) {
      buttonGroupPanel = commonButtonPanel;
    } else {
      if (this.props.editable) {
        if (isEditMode) {
          buttonGroupPanel = inEditModeButtonPanel;
        } else {
          buttonGroupPanel = (
            <React.Fragment>
              {commonButtonPanel}
              <button className="button square-button ml-4" onClick={() => this.setState({ showCannedReportPanel: true })}>
                <FontAwesomeIcon icon="archive" size="lg" fixedWidth />
              </button>
              {fullScreenButton}
              {editButton}
            </React.Fragment>
          );
        }
      } else {
        if (reportType === Constants.ADHOC) {
          buttonGroupPanel = (
            <React.Fragment>
              {commonButtonPanel}
              <button className="button square-button ml-4" onClick={() => this.setState({ showCannedReportPanel: true })}>
                <FontAwesomeIcon icon="archive" size="lg" fixedWidth />
              </button>
              {fullScreenButton}
            </React.Fragment>
          );
        } else if (reportType === Constants.CANNED) {
          buttonGroupPanel = (
            <button className="button square-button button-red ml-4" onClick={this.deleteReport}>
              <FontAwesomeIcon icon="trash-alt" size="lg" fixedWidth />
            </button>
          );
        }
      }
    }

    return (
      <React.Fragment>
        { showControl && (
          <div className="report-menu-panel row">
            <div className="float-left">
              {fromReport && (
                <div className="report-drillthrough-name" onClick={this.goBackToFromReport}>
                  <span className="link-label">{fromReport}</span> >
                </div>
              )}
            </div>
            <div className="float-left">
              {
                isFullScreenView || !isEditMode ?
                (
                  <div className="report-name">
                    {this.state.name}
                  </div>
                ) :(
                  <input 
                    className="form-input report-name-input"
                    type="text" 
                    name="name" 
                    value={this.state.name}
                    onChange={this.handleInputChange}  
                  />
                )
              }
            </div>
            <div className="float-right">
              {buttonGroupPanel}
            </div>
          </div>
        )}

        <ComponentViewPanel 
          ref={this.componentViewPanel} 
          isEditMode={isEditMode}
          showControl={this.state.showControl}
          reportViewWidth={this.state.reportViewWidth}
          onComponentEdit={this.openComponentEditPanel}
          onStyleValueChange={this.onStyleValueChange}
          onComponentContentClick={this.onComponentContentClick}
          reportType={reportType}
          {...this.state.style}
        />

        <Modal 
          show={this.state.showComponentEditPanel}
          onClose={() => this.setState({ showComponentEditPanel: false })}
          modalClass={'report-edit-component-dialog'} 
          title={'Component'} >
          <ComponentEditPanel 
            ref={this.componentEditPanel} 
            jdbcDataSourceOptions={this.state.jdbcDataSourceOptions}
            reportId={this.state.reportId}
            onSave={this.onComponentSave}
          />
        </Modal>

        <Modal 
          show={this.state.showCannedReportPanel}
          onClose={() => this.setState({ showCannedReportPanel: false })}
          modalClass={'small-modal-panel'} 
          title={'Save Canned Report'} >
          <div className="form-panel">
            <label>Name</label>
            <input 
              className="form-input"
              type="text" 
              name="cannedReportName" 
              value={this.state.cannedReportName}
              onChange={this.handleInputChange} 
            />
            <button className="button button-green" onClick={this.saveCannedReport}>
              <FontAwesomeIcon icon="save" size="lg" fixedWidth /> Save
            </button>
          </div>
        </Modal>

        <Modal 
          show={this.state.showConfirmDeletionPanel}
          onClose={this.closeConfirmDeletionPanel}
          modalClass={'small-modal-panel'}
          title={'Confirm Deletion'} >
          <div className="confirm-deletion-panel">
            Are you sure you want to delete {this.state.objectToDelete.name}?
          </div>
          <button className="button button-red full-width" onClick={this.confirmDelete}>Delete</button>
        </Modal>

        {isEditMode && (
          <div className="report-side-panel">
            <div className="side-panel-content" style={{margin: '3px 0px'}}>
              <button className="icon-button button-green" onClick={this.save}>
                <FontAwesomeIcon icon="save" size="lg"  />
              </button>
              <button className="icon-button button-black" style={{marginLeft: '5px'}} onClick={this.cancelEdit}>
                <FontAwesomeIcon icon="times" size="lg" />
              </button>
            </div>
            <div className="side-panel">
              <div className="side-panel-title">General</div>

              <div className="side-panel-content">
                <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                  <div className="float-left">Fixed Width</div>
                  <div className="float-right">
                    <Checkbox name="isFixedWidth" value="" checked={this.state.style.isFixedWidth} onChange={this.handleStyleValueChange} />
                  </div>
                </div>

                { this.state.style.isFixedWidth && (
                  <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                    <div className="float-left">Width</div>
                    <div className="float-right">
                      <input 
                        className="side-panel-input side-panel-number-input"
                        type="text" 
                        name="fixedWidth" 
                        value={this.state.style.fixedWidth}
                        onChange={(event) => this.handleStyleValueChange('fixedWidth', event.target.value)} 
                      />
                    </div>
                  </div>
                )}

                <div className="row side-panel-content-row">
                  <div className="float-left">Height</div>
                  <div className="float-right">
                    <input 
                      className="side-panel-input side-panel-number-input"
                      type="text" 
                      name="height" 
                      value={this.state.style.height}
                      onChange={(event) => this.handleStyleValueChange('height', event.target.value)} 
                    />
                  </div>  
                </div>

              </div>

              
              <div className="side-panel-title row">Background</div>
              <div className="side-panel-content">
                <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                  <div className="float-left">Color</div>
                  <div className="float-right" style={{paddingTop: '4px'}}>
                    <ColorPicker name={'backgroundColor'} value={this.state.style.backgroundColor} onChange={this.handleStyleValueChange} />
                  </div>  
                </div>

                <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                  <div className="float-left">Snap to grid</div>
                  <div className="float-right">
                    <Checkbox name="snapToGrid" value="" checked={this.state.style.snapToGrid} onChange={this.handleStyleValueChange} />
                  </div>
                </div>

                <div className="row side-panel-content-row">
                  <div className="float-left">Show gridlines</div>
                  <div className="float-right">
                    <Checkbox name="showGridlines" value="" checked={this.state.style.showGridlines} onChange={this.handleStyleValueChange} />
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </React.Fragment>
    )
  };
}

export default withRouter(ReportEditView);
