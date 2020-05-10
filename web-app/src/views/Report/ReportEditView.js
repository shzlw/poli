
import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import ComponentViewPanel from './ComponentViewPanel';
import ComponentEditPanel from './ComponentEditPanel';

import Modal from '../../components/Modal/Modal';
import ColorPicker from '../../components/ColorPicker/ColorPicker';
import Checkbox from '../../components/Checkbox/Checkbox';
import DatePicker from '../../components/filters/DatePicker';
import DropdownDialog from '../../components/DropdownDialog/DropdownDialog';

import * as Constants from '../../api/Constants';
import * as Util from '../../api/Util';
import './Report.css';



class ReportEditView extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      // Modal
      showComponentEditPanel: false,
      showConfirmDeletionPanel: false,
      showCannedReportPanel: false,
      showControl: true,
      showSharePanel: false,
      showExportToPdfPanel: false,
      showFunctionButtonDialog: false,
      isPendingApplyFilters: false,
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
      project: '',
      style: {},
      isFavourite: false,
      reportType: '',
      reportViewWidth: 1000,
      cannedReportName: '',
      cannedReportData: {},
      // share url
      expiredBy: new Date(),
      shareUrl: '',
      // export to pdf
      pdfName: '',
      isExporting: false
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
      const shareKey = params.get('$shareKey');
      if (reportName !== null) {
        this.loadViewByReportName();
        return;
      } else if (shareKey !== null) {
        this.loadViewByShareKey();
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
          axios.get(`/ws/reports/${reportId}`)
            .then(res => {
              const report = res.data;
              this.setState({
                reportId: report.id,
                name: report.name,
                style: report.style,
                reportType: reportType,
                isFavourite: report.isFavourite,
                project: report.project
              }, () => {
                this.refresh();
              });
            });
        } else if (reportType === Constants.CANNED) {
          axios.get(`/ws/cannedreports/${reportId}`)
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
    if (event.keyCode === 13) {
      this.applyFilters();
    }
  }

  loadViewByReportName = () => {
    const url = this.props.location.search;
    const params = new URLSearchParams(url);

    let showControl = params.get('$showControl');
    showControl = showControl === null ? true : showControl === 'true';
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
      axios.get(`/ws/reports/name/${reportName}`)
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

  loadViewByShareKey = () => {
    const url = this.props.location.search;
    const params = new URLSearchParams(url);
    const shareKey = params.get('$shareKey');
    const reportViewWidth = this.getPageWidth();
    this.setState({
      isFullScreenView: true,
      reportViewWidth: reportViewWidth,
      reportType: Constants.ADHOC
    }, () => {
      // MAYBE: support canned report? can only handle Adhoc report for now.
      axios.get(`/ws/reports/sharekey/${shareKey}`)
        .then(res => {
          const result = res.data;
          if (!result) {
            toast.error('The report is no longer available.');
            return;
          }
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

  handleInputChange = (name, value) => {
    this.setState({
      [name]: value
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
      this.componentViewPanel.current.fetchComponents(reportId, reportViewWidth, this.getUrlFilterParams());
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
      project,
      style = {}
    } = this.state;

    if (style.height < 100) {
      toast.error('Minimum height is 100');
      return;
    }

    if (style.isFixedWidth && style.fixedWidth < 100) {
      toast.error('Minimum width is 100');
      return;
    }

    const report = {
      id: reportId, 
      name: name,
      project: project,
      style: style
    };

    axios.put('/ws/reports/', report)
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
    this.setState({
      isPendingApplyFilters: false
    });
    this.updateLastRefreshed();
  }

  fullScreen = () => {
    const { name } = this.state;
    const url = `/workspace/report/fullscreen?$toReport=${name}`;
    window.open(url, '_blank');
  }

  exportToPdf = () => {
    const { 
      reportId,
      name,
      style,
      pdfName
    } = this.state;
    const viewWidth = style.isFixedWidth ? style.fixedWidth : 1200;
    const width = parseInt(viewWidth, 10) + 50;
    const height = parseInt(style.height, 10) + 50;
    const exportInfo = {
      reportId: reportId,
      reportName: name,
      width: width,
      height: height
    }

    this.setState({ 
      showExportToPdfPanel: false,
      isExporting: true
    });

    axios.post('/ws/reports/pdf', exportInfo,
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        }
      })
      .then(res => {
        const pdfData = res.data;
        const filename = pdfName + '.pdf';
        const blob = new Blob([pdfData]);
        const link = document.createElement("a");
        if (link.download !== undefined) { 
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        this.setState({
          isExporting: false
        });
      });
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
        axios.get(`/ws/reports/${reportId}`)
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

  onComponentFilterInputChange = () => {
    if (this.isAutoFilter()) {
      this.applyFilters();
    } else {
      this.setState({
        isPendingApplyFilters: true
      });
    }
  }

  isAutoFilter = () => {
    const {
      style = {}
    } = this.state;
    const {
      autoFilter = false
    } = style;
    return autoFilter;
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
      axios.delete(`/ws/reports/${reportId}`)
        .then(res => {
          this.props.onReportDelete(reportId);
          this.closeConfirmDeletionPanel();
        });
    } else if (reportType === Constants.CANNED) {
      axios.delete(`/ws/cannedreports/${reportId}`)
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
      toast.error('Enter a name.');
      return;
    }

    const components = this.componentViewPanel.current.getComponentsSnapshot();
    if (Util.isArrayEmpty(components)) {
      toast.error('Report is empty.');
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

    axios.post('/ws/cannedreports', report)
      .then(res => {
        this.setState({
          showCannedReportPanel: false,
          cannedReportName: ''
        });
        toast.success('Saved.');
        this.props.onCannedReportSave();
      });
  }
  
  toggleFavourite = () => {
    const {
      reportId,
      isFavourite
    } = this.state;
    const status = isFavourite ? 'remove' : 'add';

    axios.post(`/ws/reports/favourite/${reportId}/${status}`)
      .then(res => {
        this.setState(prevState => ({
          isFavourite: !prevState.isFavourite
        }), () => {
          this.props.onFavouriteChange(reportId, this.state.isFavourite);
        }); 
      });
  }

  openSharePanel = () => {
    this.setState({
      showSharePanel: true,
      shareUrl: '',
      expiredBy: new Date(),
    });
  }

  openExportToPdfPanel = () => {
    const { name } = this.state;
    this.setState({
      showExportToPdfPanel: true,
      pdfName: name,
    });
  }

  generateShareUrl = () => {
    const {
      reportId,
      reportType,
      expiredBy
    } = this.state;

    const sharedReport = {
      reportId: reportId,
      reportType: reportType,
      expiredBy: Math.round((expiredBy).getTime())
    }

    const href = window.location.href;
    const start = href.indexOf('/poli/workspace');
    if (start === -1) {
      toast.error('Cannot find poli workspace URL pattern.');
      return;
    }
    const urlPrefix = href.substring(0, start);
    
    axios.post('/ws/sharedreports/generate-sharekey', sharedReport)
      .then(res => {
        const shareKey = res.data;
        const shareUrl = urlPrefix + `/poli/workspace/report/fullscreen?$shareKey=${shareKey}`;
        this.setState({
          shareUrl: shareUrl
        });
      });
  }

  onDatePickerChange = (name, date) => { 
    this.setState({
      [name]: date
    });
  }

  render() {
    const { t } = this.props;

    const {
      autoRefreshTimerId,
      readableLastRefreshed,
      isEditMode,
      isFullScreenView,
      fromReport,
      showControl,
      reportType,
      isPendingApplyFilters,
      isFavourite,
      isExporting
    } = this.state;
    const autoRefreshStatus = autoRefreshTimerId === '' ? 'OFF' : 'ON';
    const pendingApplyFiltersStyle = isPendingApplyFilters ? 'font-blue' : '';

    const commonButtonPanel = (
      <React.Fragment>
        <div className="inline-block" style={{marginRight: '8px', lineHeight: '32px'}}>
          {t('Last refreshed')}: {readableLastRefreshed}
        </div>
        { autoRefreshStatus === 'OFF' && (
          <input 
            className="form-input inline-block"
            type="text" 
            name="refreshInterval" 
            value={this.state.refreshInterval}
            onChange={(event) => this.handleInputChange('refreshInterval', event.target.value)}
            style={{width: '50px', marginRight: '4px'}}
          />
        )}
        <button className="button square-button button-transparent" onClick={this.toggleAutoRefresh}>
          {
            autoRefreshStatus === 'ON' ? 
            (
              <FontAwesomeIcon icon="stop-circle"  fixedWidth />
            ) : 
            (
              <FontAwesomeIcon icon="play-circle"  fixedWidth />
            )
          }
        </button>
        <button className="button square-button button-transparent ml-4" onClick={this.refresh}>
          <FontAwesomeIcon icon="redo-alt"  fixedWidth />
        </button>

        { !this.isAutoFilter() && (
          <button className={`button ml-4 ${pendingApplyFiltersStyle}`} onClick={this.applyFilters}>
            <FontAwesomeIcon icon="filter"  fixedWidth /> {t('Apply Filters')}
          </button>
        )}
      </React.Fragment>
    );

    // buttons not displayed in full screen view.
    const fullScreenExcludeButtonPanel = (
      <React.Fragment>
        <button className="button square-button button-transparent ml-4" onClick={() => this.setState({ showFunctionButtonDialog: true })}>
          <FontAwesomeIcon icon="ellipsis-h"  fixedWidth />
        </button>
      </React.Fragment>
    );

    const inEditModeButtonPanel = (
      <React.Fragment>
        <button className="button ml-4" onClick={() => this.openComponentEditPanel(null)}>
          <FontAwesomeIcon icon="calendar-plus"  fixedWidth /> {t('New Component')}
        </button>
        <button className="button square-button button-transparent ml-4" onClick={this.deleteReport}>
          <FontAwesomeIcon icon="trash-alt"  fixedWidth />
        </button>
      </React.Fragment>
    )

    const editButton = (
      <button className="button square-button button-transparent ml-4" onClick={this.edit}>
        <FontAwesomeIcon icon="edit"  fixedWidth />
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
              {fullScreenExcludeButtonPanel}
              {editButton}
            </React.Fragment>
          );
        }
      } else {
        if (reportType === Constants.ADHOC) {
          buttonGroupPanel = (
            <React.Fragment>
              {commonButtonPanel}
              {fullScreenExcludeButtonPanel}
            </React.Fragment>
          );
        } else if (reportType === Constants.CANNED) {
          buttonGroupPanel = (
            <button className="button square-button button-transparent ml-4" onClick={this.deleteReport}>
              <FontAwesomeIcon icon="trash-alt"  fixedWidth />
            </button>
          );
        }
      }
    }

    return (
      <React.Fragment>
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
                  onChange={(event) => this.handleInputChange('name', event.target.value)}  
                />
              )
            }
          </div>
          { showControl && (
            <div className="float-right">
              {buttonGroupPanel}
            </div>
          )}
        </div>
        

        <ComponentViewPanel 
          ref={this.componentViewPanel} 
          isEditMode={isEditMode}
          reportViewWidth={this.state.reportViewWidth}
          onComponentEdit={this.openComponentEditPanel}
          onStyleValueChange={this.onStyleValueChange}
          onComponentContentClick={this.onComponentContentClick}
          onComponentFilterInputChange={this.onComponentFilterInputChange}
          reportType={reportType}
          {...this.state.style}
        />

        <Modal 
          show={this.state.showComponentEditPanel}
          onClose={() => this.setState({ showComponentEditPanel: false })}
          modalClass={'report-edit-component-dialog'} 
          title={t('Component')} >
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
          title={t('Save Canned Report')} >
          <div className="form-panel">
            <label>{t('Name')}</label>
            <input 
              className="form-input"
              type="text" 
              name="cannedReportName" 
              value={this.state.cannedReportName}
              onChange={(event) => this.handleInputChange('cannedReportName', event.target.value)} 
            />
            <button className="button button-green" onClick={this.saveCannedReport}>
              <FontAwesomeIcon icon="save"  fixedWidth /> {t('Save')}
            </button>
          </div>
        </Modal>

        <Modal 
          show={this.state.showConfirmDeletionPanel}
          onClose={this.closeConfirmDeletionPanel}
          modalClass={'small-modal-panel'}
          title={t('Confirm Deletion')}>
          <div className="confirm-deletion-panel">
            {t('Are you sure you want to delete')} {this.state.objectToDelete.name}?
          </div>
          <button className="button button-red full-width" onClick={this.confirmDelete}>{t('Delete')}</button>
        </Modal>

        <Modal 
          show={this.state.showSharePanel}
          onClose={() => this.setState({ showSharePanel: false })}
          modalClass={'small-modal-panel'}
          title={t('Share')}>
          <div className="form-panel">
            <label>{t('Name')}</label>
            <div className="form-input bg-grey">{this.state.name}</div>

            <label>{t('Type')}</label>
            <div className="form-input bg-grey">{this.state.reportType}</div>

            <label style={{marginBottom: '3px'}}>{t('Expiration Date')}</label>
            <div style={{marginBottom: '8px'}}>
              <DatePicker 
                name={'expiredBy'}
                value={this.state.expiredBy}
                onChange={this.onDatePickerChange}
                readOnly={false}
              />
            </div>

            { this.state.shareUrl && (
              <React.Fragment>
                <label>{t('Share URL')}</label>
                <div className="form-input word-break-all bg-grey">{this.state.shareUrl}</div>
              </React.Fragment>
            )}

            <button className="button button-green full-width" onClick={this.generateShareUrl}>{t('Generate URL')}</button>
          </div>
        </Modal>

        <Modal 
          show={this.state.showExportToPdfPanel}
          onClose={() => this.setState({ showExportToPdfPanel: false })}
          modalClass={'small-modal-panel'}
          title={t('Export To PDF')}>
          <div className="form-panel">
            <label>{t('Name')}</label>
            <input 
              className="form-input"
              type="text" 
              name="pdfName" 
              value={this.state.pdfName}
              onChange={(event) => this.handleInputChange('pdfName', event.target.value)} 
            />

            <button className="button button-green full-width" onClick={this.exportToPdf}>{t('Export')}</button>
          </div>
        </Modal>

        {isEditMode && (
          <div className="report-side-panel">
            <div className="side-panel-content" style={{margin: '3px 0px'}}>
              <button className="icon-button button-green" onClick={this.save}>
                <FontAwesomeIcon icon="save"   />
              </button>
              <button className="icon-button button-black" style={{marginLeft: '5px'}} onClick={this.cancelEdit}>
                <FontAwesomeIcon icon="times"  />
              </button>
            </div>
            <div className="side-panel">
              <div className="side-panel-title">{t('General')}</div>

              <div className="side-panel-content">
                <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                  <div className="float-left">{t('Project')}</div>
                  <div className="float-right">
                    <input 
                      className="side-panel-input"
                      type="text" 
                      name="project" 
                      value={this.state.project}
                      onChange={(event) => this.handleInputChange('project', event.target.value)} 
                      style={{width: '80px'}}
                    />
                  </div>
                </div>

                <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                  <div className="float-left">{t('Fixed Width')}</div>
                  <div className="float-right">
                    <Checkbox name="isFixedWidth" value="" checked={this.state.style.isFixedWidth} onChange={this.handleStyleValueChange} />
                  </div>
                </div>

                { this.state.style.isFixedWidth && (
                  <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                    <div className="float-left">{t('Width')}</div>
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
                  <div className="float-left">{t('Height')}</div>
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

              
              <div className="side-panel-title row">{t('Background')}</div>
              <div className="side-panel-content">
                <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                  <div className="float-left">{t('Color')}</div>
                  <div className="float-right" style={{paddingTop: '4px'}}>
                    <ColorPicker name={'backgroundColor'} value={this.state.style.backgroundColor} onChange={this.handleStyleValueChange} />
                  </div>  
                </div>

                <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                  <div className="float-left">{t('Snap To Grid')}</div>
                  <div className="float-right">
                    <Checkbox name="snapToGrid" value="" checked={this.state.style.snapToGrid} onChange={this.handleStyleValueChange} />
                  </div>
                </div>

                <div className="row side-panel-content-row">
                  <div className="float-left">{t('Show Gridlines')}</div>
                  <div className="float-right">
                    <Checkbox name="showGridlines" value="" checked={this.state.style.showGridlines} onChange={this.handleStyleValueChange} />
                  </div>
                </div>

              </div>

              <div className="side-panel-title row">{t('Control')}</div>
              <div className="side-panel-content">
                <div className="row side-panel-content-row">
                  <div className="float-left">{t('Auto Filter')}</div>
                  <div className="float-right">
                    <Checkbox name="autoFilter" value="" checked={this.state.style.autoFilter} onChange={this.handleStyleValueChange} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {isExporting && (
          <div className="exporting-overlay">
            <div className="exporting-panel">
              <div className="exporting-panel-title">{t('Exporting...')}</div>
              <FontAwesomeIcon icon="circle-notch" spin={true} size="2x" />
            </div>
          </div>
        )}

        <DropdownDialog 
          show={this.state.showFunctionButtonDialog}
          onClose={() => this.setState({ showFunctionButtonDialog: false })}
          >
          <div className="form-panel">
            <button className="button square-button button-transparent ml-4" onClick={this.toggleFavourite}>
              { isFavourite ? (
                <FontAwesomeIcon icon="heart"  fixedWidth />
              ) : (
                <FontAwesomeIcon icon={['far', 'heart']}  fixedWidth />
              )}
            </button>
            <button className="button square-button button-transparent ml-4" onClick={() => this.setState({ showCannedReportPanel: true })}>
              <FontAwesomeIcon icon="archive"  fixedWidth />
            </button>
            <button className="button square-button button-transparent ml-4" onClick={this.openSharePanel}>
              <FontAwesomeIcon icon="share-square"  fixedWidth />
            </button>
            <button className="button square-button button-transparent ml-4" onClick={this.fullScreen}>
              <FontAwesomeIcon icon="tv"  fixedWidth />
            </button>
            <button className="button square-button button-transparent ml-4" onClick={this.openExportToPdfPanel}>
              <FontAwesomeIcon icon="file-pdf"  fixedWidth />
            </button>
          </div>
        </DropdownDialog>
        

      </React.Fragment>
    )
  };
}

export default (withTranslation()(withRouter(ReportEditView)));
