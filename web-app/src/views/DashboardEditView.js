
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


const mockDataSources = [{
    name: 'ds1',
    id: 1
  }, {
    name: 'ds2',
    id: 2
  }
]

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

  refresh = () => {
    console.log('refresh');
    const { dashboardId } = this.state;
    this.filterViewPanel.current.fetchFilters(dashboardId);
    this.widgetViewPanel.current.fetchWidgets(dashboardId);
  }

  showFilterEditPanel = (filter) => {
    this.filterEditPanel.current.fetchFilter(null);
    this.setState({
      showFilterEditPanel: true
    });
  }

  showWidgetEditPanel = (widget) => {
    this.widgetEditPanel.current.fetchWidget(null);
    this.setState({
      showWidgetEditPanel: true
    });
  }

  render() {
    return (
      <div>
        <h3>DashboardEditView</h3>
        <button onClick={this.refresh}>Refresh</button>
        <button onClick={() => this.showFilterEditPanel(null)}>Add Filter</button>
        <button onClick={() => this.showWidgetEditPanel(null)}>Add Widget</button>
        <FilterViewPanel 
          ref={this.filterViewPanel} 
        />
        <WidgetViewPanel 
          ref={this.widgetViewPanel} 
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
