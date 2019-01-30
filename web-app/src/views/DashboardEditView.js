
import React from 'react';
import { withRouter } from 'react-router-dom';

import FilterViewPanel from '../components/FilterViewPanel';
import WidgetViewPanel from '../components/WidgetViewPanel';
import WidgetEditPanel from '../components/WidgetEditPanel';
import FilterEditPanel from '../components/FilterEditPanel';

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
    this.widgetViewPanel = React.createRef();
    this.widgetEditPanel = React.createRef();
  }

  componentDidMount() {
    let dashboardId = 1; // this.props.match.params.id;
    console.log("componentDidMount", dashboardId);
    this.initData(dashboardId);
  }

  async initData(dashboardId) {
    const jdbcDataSources = mockDataSources;// await webApi.fetchDataSources();
    const jdbcDataSourceOptions = [];
    for (let i = 0; i < jdbcDataSources.length; i++) {
      jdbcDataSourceOptions.push({
        label: jdbcDataSources[i].name,
        value: jdbcDataSources[i].id
      });
    }
    this.setState({ 
      jdbcDataSourceOptions: jdbcDataSourceOptions 
    });

    if (dashboardId !== undefined) {
      const dashboard = mockDashboard; // await webApi.fetchDashboardById(dashboardId);
      const filters = dashboard.filters;
      const widgets = dashboard.widgets;
      console.log('filters', filters);
      this.setState({ 
        dashboardId: dashboardId,
        filters: filters,
        widgets: widgets
      });

      //this.initFilters();
      // TODO: inig widgets based on the base value of the filters.
      //this.initWidgets();
    } else {
      this.setState({ 
        dashboardId: null,
        filters: [],
        widgets: []
      });
    } 
  }

  refresh = () => {
    console.log('refresh');
    this.filterViewPanel.current.fetchFilters();
  }

  showFilterEditPanel = (filter) => {
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
        <FilterViewPanel ref={this.filterViewPanel} />
        <WidgetViewPanel ref={this.widgetViewPanel} />
        <WidgetEditPanel 
          ref={this.widgetEditPanel} 
          show={this.state.showWidgetEditPanel}
          onClose={() => this.setState({ showWidgetEditPanel: false})}
          jdbcDataSourceOptions={this.state.jdbcDataSourceOptions}
        />
        <FilterEditPanel
          ref={this.FilterEditPanel}
          show={this.state.showFilterEditPanel}
          onClose={() => this.setState({ showFilterEditPanel: false})}
          jdbcDataSourceOptions={this.state.jdbcDataSourceOptions}
        />
      </div>
    )
  };
}

export default withRouter(DashboardEditView);
