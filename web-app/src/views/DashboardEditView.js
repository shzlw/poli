
import React from 'react';
import { withRouter } from 'react-router-dom';

import FilterViewPanel from '../components/FilterViewPanel';
import WidgetViewPanel from '../components/WidgetViewPanel';
import WidgetEditPanel from '../components/WidgetEditPanel';
import FilterEditPanel from '../components/FilterEditPanel';
import Modal from '../components/Modal';

import './Dashboard.css';

import * as webApi from '../api/WebApi';
import axios from 'axios';

class DashboardEditView extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      showWidgetEditPanel: false,
      showFilterEditPanel: false,
      isEditMode: false,
      autoRefreshTimerId: '',
      lastRefreshed: '',
      jdbcDataSourceOptions: [],
      dashboardId: 0,
      name: '',
      width: 0,
      height: 0,
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
            width: result.width,
            height: result.height,
          }, () => {
            this.refresh();
          });
        });
    }
  }

  componentWillUnmount() {
    const { autoRefreshTimerId } = this.state;
    if (autoRefreshTimerId) {
      clearInterval(autoRefreshTimerId);
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
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
        const now = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
        this.setState({
          lastRefreshed: now
        });
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
      width,
      height
    } = this.state;
    this.widgetViewPanel.current.fetchWidgets(dashboardId, width, null);
  } 

  save = () => {
    console.log('save');
    const {
      dashboardId,
      name,
      width,
      height
    } = this.state;

    const dashboard = {
      id: dashboardId, 
      width: width,
      height: height
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

  render() {
    const {
      autoRefreshTimerId,
      lastRefreshed,
      isEditMode
    } = this.state;
    const autoRefreshStatus = autoRefreshTimerId === '' ? 'OFF' : 'ON';

    let statusButtonPanel;
    if (isEditMode) {
      statusButtonPanel = (
        <React.Fragment>
          <button onClick={this.cancelEdit}>Cancel</button>
          <button onClick={this.save}>Save</button>
          <button onClick={this.delete}>Delete</button>
          <button onClick={() => this.openFilterEditPanel(null)}>Add Filter</button>
          <button onClick={() => this.openWidgetEditPanel(null)}>Add Widget</button>
        </React.Fragment>
      );
    } else {
      statusButtonPanel = (
        <React.Fragment>
          <button onClick={this.edit}>Edit</button>
        </React.Fragment>
      );
    }

    return (
      <div>
        <div className="row">
           <div className="inline-block">Name:</div>
          <input 
            type="text" 
            name="name" 
            value={this.state.name}
            onChange={this.handleInputChange} 
            className="inline-block" 
            style={{width: '200px'}}
            />

          <div className="inline-block">H:</div>
          <input 
            type="text" 
            name="height" 
            value={this.state.height}
            onChange={this.handleInputChange} 
            className="inline-block" 
            style={{width: '200px'}}
            />
        </div>
        
        <button onClick={this.toggleAutoRefresh}>AUTO: {autoRefreshStatus} - {lastRefreshed}</button>
        <button onClick={this.refresh}>Refresh</button>
        
        {statusButtonPanel}
        
        <div className="dashboard-content-widget-panel">
          <WidgetViewPanel 
            ref={this.widgetViewPanel} 
            onWidgetEdit={this.openWidgetEditPanel}
            isEditMode={this.state.isEditMode}
            height={this.state.height}
          />
        </div>
        <FilterViewPanel 
          ref={this.filterViewPanel} 
          onEdit={this.openFilterEditPanel}
          onApplyFilters={this.applyFilters}
          isEditMode={this.state.isEditMode}
        />

        <Modal 
          show={this.state.showWidgetEditPanel}
          onClose={() => this.setState({ showWidgetEditPanel: false })}
          modalClass={'lg-modal-panel'} >
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
          modalClass={'lg-modal-panel'} >
          <FilterEditPanel
            ref={this.filterEditPanel}
            jdbcDataSourceOptions={this.state.jdbcDataSourceOptions}
            dashboardId={this.state.dashboardId}
            onSave={this.onSaveFilter}
          />
        </Modal>

      </div>
    )
  };
}

export default withRouter(DashboardEditView);
