
import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';

import FilterViewPanel from '../components/FilterViewPanel';
import WidgetViewPanel from '../components/WidgetViewPanel';
import WidgetEditPanel from '../components/WidgetEditPanel';
import FilterEditPanel from '../components/FilterEditPanel';

import Modal from '../components/Modal';

import * as Constants from '../api/Constants';

import './Dashboard.css';

import * as webApi from '../api/WebApi';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class DashboardEditView extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      showWidgetEditPanel: false,
      showFilterEditPanel: false,
      showFilterViewPanel: true,
      isEditMode: false,
      isReadOnly: false,
      autoRefreshTimerId: '',
      lastRefreshed: '',
      jdbcDataSourceOptions: [],
      dashboardId: 0,
      name: '',
      style: {},
      widgetViewWidth: 1000
    }

    this.filterViewPanel = React.createRef();
    this.filterEditPanel = React.createRef();
    this.widgetViewPanel = React.createRef();
    this.widgetEditPanel = React.createRef();
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    const dashboardId = id !== undefined ? id : null;
    console.log('DashboardEditView', dashboardId);

    const url = this.props.location.search;
    console.log('url', url);
    const params = new URLSearchParams(url);
    console.log('params', params);
    for(let pair of params.entries()) {
      console.log(pair[0]+ ', '+ pair[1]); 
    } 

    const pageWidth = this.getPageWidth();
    const widgetViewWidth = this.state.showFilterViewPanel ? pageWidth - Constants.DEFAULT_FILTER_VIEW_WIDTH : pageWidth;
    console.log('componentDidMount', pageWidth, widgetViewWidth);
    this.setState({
      pageWidth: pageWidth,
      widgetViewWidth: widgetViewWidth
    }, () => {
      if (dashboardId === null) {
        this.setState({
          dashboardId: null
        });
      } else {
        axios.get(`/ws/dashboard/${dashboardId}`)
          .then(res => {
            const result = res.data;
            this.setState({
              dashboardId: result.id,
              name: result.name,
              style: result.style
            }, () => {
              this.refresh();
            });
          });
      }
    });
  }

  componentWillUnmount() {
    const { autoRefreshTimerId } = this.state;
    if (autoRefreshTimerId) {
      clearInterval(autoRefreshTimerId);
    }
  }

  loadViewByDashboardName = () => {
    const pageWidth = this.getPageWidth();
    const widgetViewWidth = this.state.showFilterViewPanel ? pageWidth - Constants.DEFAULT_FILTER_VIEW_WIDTH : pageWidth;
    
    const url = this.props.location.search;
    const params = new URLSearchParams(url);
    const dashboardName = params.get('name');
    const showFilter = params.get('showFilter');

    const showFilterViewPanel = showFilter == 'true';
    this.setState({
      pageWidth: pageWidth,
      widgetViewWidth: widgetViewWidth,
      isReadOnly: true,
      name: dashboardName,
      showFilterViewPanel: showFilterViewPanel
    }, () => {
      axios.get(`/ws/dashboard/name/${dashboardName}`)
        .then(res => {
          const result = res.data;
          this.setState({
            dashboardId: result.id,
            name: result.name,
            style: result.style
          }, () => {
            this.refresh();
          });
        });
    });
  }

  getPageWidth = () => {
    const thisNode = ReactDOM.findDOMNode(this);
    return thisNode.clientWidth;
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  toggleAutoRefresh = () => {
    const { autoRefreshTimerId } = this.state;
    if (autoRefreshTimerId) {
      clearInterval(autoRefreshTimerId);
      this.setState({
        autoRefreshTimerId: ''
      });
    } else {
      const timerId = setInterval(() => {
        this.refreshWidgetView();
      }, 1000);
      this.setState({
        autoRefreshTimerId: timerId
      });
    }
  }

  refresh = () => {
    console.log('refresh');
    this.refreshWidgetView();
    this.refreshFilterView();
  }

  refreshFilterView = () => {
    const { 
      dashboardId
    } = this.state;
    this.filterViewPanel.current.fetchFilters(dashboardId);
  }

  refreshWidgetView = () => {
    const { 
      dashboardId,
      widgetViewWidth
    } = this.state;
    this.widgetViewPanel.current.fetchWidgets(dashboardId, widgetViewWidth, null);

    const now = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    this.setState({
      lastRefreshed: now
    });
  } 

  save = () => {
    console.log('save');
    const {
      dashboardId,
      name,
      style
    } = this.state;

    const dashboard = {
      id: dashboardId, 
      name: name,
      style: style
    };

    axios.put('/ws/dashboard/', dashboard)
      .then(res => {
      });

    this.widgetViewPanel.current.saveWidgets();

    this.props.onSaveDashboard(dashboardId);

    this.setState({
      isEditMode: false
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

  delete = () => {
    const { dashboardId } = this.state;
    console.log('delete', dashboardId);
    axios.delete(`/ws/dashboard/${dashboardId}`)
      .then(res => {
        //this.fetchBoards();
      });
  }

  onSaveWidget = () => {
    this.setState({ 
      showWidgetEditPanel: false 
    });
    // FIXME: not need to refresh. Just add to state.widgets
    this.refreshWidgetView();
  }

  onSaveFilter = () => {
    this.setState({ 
      showFilterEditPanel: false 
    });
    // FIXME: not need to refresh. Just add to state.widgets
    this.refreshFilterView();
  }

  toggleFilterViewPanel = () => {
    const { 
      showFilterViewPanel
    } = this.state;
    this.resizePageLayout(!showFilterViewPanel);
  }

  resizePageLayout = (showFilterViewPanel) => {
    const pageWidth = this.getPageWidth();;
    let widgetViewWidth = showFilterViewPanel ? pageWidth - Constants.DEFAULT_FILTER_VIEW_WIDTH : pageWidth;
    this.widgetViewPanel.current.resizeGrid(widgetViewWidth, true);

    this.setState({
      showFilterViewPanel: showFilterViewPanel,
      widgetViewWidth: widgetViewWidth
    }); 
  }

  openFilterEditPanel = (filterId) => {
    this.filterEditPanel.current.fetchFilter(filterId);
    this.setState({
      showFilterEditPanel: true
    });
  }

  openWidgetEditPanel = (widgetId) => {
    const { dashboardId } = this.state;
    this.widgetEditPanel.current.fetchWidget(widgetId, dashboardId);
    this.setState({
      showWidgetEditPanel: true
    });
  }

  applyFilters = (filterParams) => {
    this.widgetViewPanel.current.queryWidgets(filterParams);
  }

  fullScreen = () => {
    const { name } = this.state;
    const url = `/workspace/dashboard/view?name=${name}`;
    window.open(url, '_blank');
  }

  onTableCellClick = () => {
    this.props.history.push(`/workspace/dashboard/drill?name=&`);
  }

  onHeightChange = (height) => {
    const style = {...this.state.style};
    style.height = height;
    this.setState({
      style: style
    });
  }

  onBackgroundColorChange = (color) => {
    const style = {...this.state.style};
    style.backgroundColor = color;
    this.setState({
      style: style
    });
  }

  render() {
    const {
      autoRefreshTimerId,
      lastRefreshed,
      isEditMode,
      isReadOnly
    } = this.state;
    const autoRefreshStatus = autoRefreshTimerId === '' ? 'OFF' : 'ON';

    let editButtonPanel;
    let fullScreenButtonPanel = null;
    const controlButtons = (
      <React.Fragment>
        <span>Last refreshed: {lastRefreshed}</span>
        <button className="button icon-button" onClick={this.toggleAutoRefresh}>
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
        <button className="button icon-button" onClick={this.refresh}>
          <FontAwesomeIcon icon="redo-alt" size="lg" fixedWidth />
        </button>
        <button className="button" onClick={this.toggleFilterViewPanel}>Show Filters</button>
      </React.Fragment>
    );

    if (!isReadOnly) {
      if (isEditMode) {
        editButtonPanel = (
          <React.Fragment>
            <button className="button" onClick={this.cancelEdit}>Cancel</button>
            <button className="button" onClick={this.save}>Save</button>
            <button className="button" onClick={this.delete}>Delete</button>
            <button className="button" onClick={() => this.openFilterEditPanel(null)}>Add Filter</button>
            <button className="button" onClick={() => this.openWidgetEditPanel(null)}>Add Widget</button>
          </React.Fragment>
        );
      } else {
        editButtonPanel = (
          <React.Fragment>
            {controlButtons}
            <button className="button icon-button" onClick={this.fullScreen}>
              <FontAwesomeIcon icon="tv" size="lg" fixedWidth />
            </button>
            <button className="button" onClick={this.edit}>Edit</button>
          </React.Fragment>
        );
      }
    } else {
      fullScreenButtonPanel = controlButtons;
    }

    return (
      <React.Fragment>
        <div className="dashboard-menu-panel row">
          <div className="float-left">
            <input 
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} 
              style={{width: '200px'}}
              readOnly={isReadOnly || !isEditMode}
              />
          </div>
          <div className="float-right">
            {fullScreenButtonPanel}
            {editButtonPanel}
          </div>
        </div>

        <WidgetViewPanel 
          ref={this.widgetViewPanel} 
          isEditMode={this.state.isEditMode}
          widgetViewWidth={this.state.widgetViewWidth}
          onWidgetEdit={this.openWidgetEditPanel}
          onHeightChange={this.onHeightChange}
          onBackgroundColorChange={this.onBackgroundColorChange}
          {...this.state.style}
        />
        <FilterViewPanel 
          ref={this.filterViewPanel} 
          onEdit={this.openFilterEditPanel}
          onApplyFilters={this.applyFilters}
          isEditMode={this.state.isEditMode}
          show={this.state.showFilterViewPanel}
        />

        <Modal 
          show={this.state.showWidgetEditPanel}
          onClose={() => this.setState({ showWidgetEditPanel: false })}
          modalClass={'dashboard-edit-widget-dialog'} 
          title={'Widget Edit'} >
          <WidgetEditPanel 
            ref={this.widgetEditPanel} 
            jdbcDataSourceOptions={this.state.jdbcDataSourceOptions}
            dashboardId={this.state.dashboardId}
            onSave={this.onSaveWidget}
          />
        </Modal>

        <Modal 
          show={this.state.showFilterEditPanel}
          onClose={() => this.setState({ showFilterEditPanel: false })}
          modalClass={'dashboard-edit-filter-dialog'} 
          title={'Filter Edit'}>
          <FilterEditPanel
            ref={this.filterEditPanel}
            jdbcDataSourceOptions={this.state.jdbcDataSourceOptions}
            dashboardId={this.state.dashboardId}
            onSave={this.onSaveFilter}
          />
        </Modal>

      </React.Fragment>
    )
  };
}

export default withRouter(DashboardEditView);
