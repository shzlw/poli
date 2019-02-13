
import React from 'react';
import { withRouter } from 'react-router-dom';

import FilterViewPanel from '../components/FilterViewPanel';
import WidgetViewPanel from '../components/WidgetViewPanel';
import WidgetEditPanel from '../components/WidgetEditPanel';
import FilterEditPanel from '../components/FilterEditPanel';

import * as webApi from '../api/WebApi';
import axios from 'axios';

const FILTER_TYPES = [
  { value: 'slicer', label: 'Slicer' },
  { value: 'number-range', label: 'Number Range' },
  { value: 'date-range', label: 'Date Range' }
];

const mockDashboard = {
  dashboardId: 1,
  filters: [
    {
      type: 'slicer',
      id: 1,
      dashboardId: 1,
      data: {
        dataSourceId: 2,
        sqlQuery: 'select name from table',
        display: 'Name',
        columns: [{
            name: 'name',
            param: 'name'
          },
          {
            name: 'b',
            param: ':column b'
          }
        ]
      },
      queryResult: ['s1', 's2', 's3']
    }
  ],
  widgets: []
}


class DashboardEditView extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      showWidgetEditPanel: false,
      showFilterEditPanel: false,
      showFilterViewPanel: true,
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
    const { dashboardId } = this.state;
    this.widgetViewPanel.current.fetchWidgets(dashboardId, filterParams);
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
        <button onClick={() => this.setState({ showFilterViewPanel: true})}>Show Filters</button>
        
        <FilterViewPanel 
          ref={this.filterViewPanel} 
          onEdit={this.openFilterEditPanel}
          onApplyFilters={this.applyFilters}
          show={this.state.showFilterViewPanel}
          onClose={() => this.setState({ showFilterViewPanel: false})}
        />
        <WidgetViewPanel 
          ref={this.widgetViewPanel} 
          onWidgetEdit={this.openWidgetEditPanel}
        />
        <WidgetEditPanel 
          ref={this.widgetEditPanel} 
          show={this.state.showWidgetEditPanel}
          onClose={() => this.setState({ showWidgetEditPanel: false})}
          jdbcDataSourceOptions={this.state.jdbcDataSourceOptions}
          dashboardId={this.state.dashboardId}
        />
        <FilterEditPanel
          ref={this.filterEditPanel}
          show={this.state.showFilterEditPanel}
          onClose={() => this.setState({ showFilterEditPanel: false})}
          jdbcDataSourceOptions={this.state.jdbcDataSourceOptions}
          dashboardId={this.state.dashboardId}
        />
      </div>
    )
  };
}

export default withRouter(DashboardEditView);
