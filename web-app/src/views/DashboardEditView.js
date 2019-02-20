
import React from 'react';
import { withRouter } from 'react-router-dom';

import FilterViewPanel from '../components/FilterViewPanel';
import WidgetViewPanel from '../components/WidgetViewPanel';
import WidgetEditPanel from '../components/WidgetEditPanel';
import FilterEditPanel from '../components/FilterEditPanel';
import Modal from '../components/Modal';

import * as webApi from '../api/WebApi';
import axios from 'axios';

const FILTER_TYPES = [
  { value: 'slicer', label: 'Slicer' },
  { value: 'number-range', label: 'Number Range' },
  { value: 'date-range', label: 'Date Range' }
];

class DashboardEditView extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      showWidgetEditPanel: false,
      showFilterEditPanel: false,
      showFilterViewPanel: false,
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

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
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
        <button onClick={this.refresh}>Refresh</button>
        <button onClick={this.save}>Save</button>
        <button onClick={() => this.openFilterEditPanel(null)}>Add Filter</button>
        <button onClick={() => this.openWidgetEditPanel(null)}>Add Widget</button>
        <button onClick={() => this.setState({ showFilterViewPanel: true })}>Show Filters: {this.state.showFilterViewPanel}</button>
        
        
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
