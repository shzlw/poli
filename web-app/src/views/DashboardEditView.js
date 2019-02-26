
import React from 'react';
import { withRouter } from 'react-router-dom';

import FilterViewPanel from '../components/FilterViewPanel';
import WidgetViewPanel from '../components/WidgetViewPanel';
import WidgetEditPanel from '../components/WidgetEditPanel';
import FilterEditPanel from '../components/FilterEditPanel';
import Modal from '../components/Modal';

import * as webApi from '../api/WebApi';
import axios from 'axios';

class DashboardEditView extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      showWidgetEditPanel: false,
      showFilterEditPanel: false,
      showFilterViewPanel: false,
      autoRefreshTimerId: '',
      lastUpdated: '',
      jdbcDataSourceOptions: [],
      dashboardId: 0,
      name: '',
      widgets: [],
      filters: []
    }

    this.filterViewPanel = React.createRef();
    this.filterEditPanel = React.createRef();
    this.widgetViewPanel = React.createRef();
    this.widgetEditPanel = React.createRef();
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    const dashboardId = id !== undefined ? id : null;
    this.setState({
      dashboardId: dashboardId
    })
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
      const { dashboardId } = this.state;
      const timerId = setInterval(() => {
        this.widgetViewPanel.current.fetchWidgets(dashboardId, null);
        const now = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
        this.setState({
          lastUpdated: now
        });
      }, 5000);
      this.setState({
        autoRefreshTimerId: timerId
      });
    }
  }

  refresh = () => {
    console.log('refresh');
    const { dashboardId } = this.state;
    this.filterViewPanel.current.fetchFilters(dashboardId);
    this.widgetViewPanel.current.fetchWidgets(dashboardId, null);
  }

  save = () => {
    console.log('save');

  }

  openFilterEditPanel = (filterId) => {
    this.filterEditPanel.current.fetchFilter(filterId);
    this.setState({
      showFilterViewPanel: false,
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
      lastUpdated
    } = this.state;
    const autoRefreshStatus = autoRefreshTimerId === '' ? 'OFF' : 'ON';

    return (
      <div>
        <h3>
          DashboardEditView: 
          <input 
          type="text" 
          name="name" 
          value={this.state.name}
          onChange={this.handleInputChange} />
        </h3>
        <button onClick={this.toggleAutoRefresh}>toggleAutoRefresh: {autoRefreshStatus} - {lastUpdated}</button>
        <button onClick={this.refresh}>Refresh</button>
        <button onClick={this.save}>Save</button>
        <button onClick={() => this.openFilterEditPanel(null)}>Add Filter</button>
        <button onClick={() => this.openWidgetEditPanel(null)}>Add Widget</button>
        <button onClick={() => this.setState({ showFilterViewPanel: true })}>Show Filters</button>
        
        
        <WidgetViewPanel 
          ref={this.widgetViewPanel} 
          onWidgetEdit={this.openWidgetEditPanel}
        />

        <Modal 
          show={this.state.showFilterViewPanel}
          onClose={() => this.setState({ showFilterViewPanel: false })}
          modalClass={'right-modal-panel'} >
          <FilterViewPanel 
            ref={this.filterViewPanel} 
            onEdit={this.openFilterEditPanel}
            onApplyFilters={this.applyFilters}
          />
        </Modal>

        <Modal 
          show={this.state.showWidgetEditPanel}
          onClose={() => this.setState({ showWidgetEditPanel: false })}
          modalClass={'lg-modal-panel'} >
          <WidgetEditPanel 
            ref={this.widgetEditPanel} 
            jdbcDataSourceOptions={this.state.jdbcDataSourceOptions}
            dashboardId={this.state.dashboardId}
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
          />
        </Modal>
      </div>
    )
  };
}

export default withRouter(DashboardEditView);
