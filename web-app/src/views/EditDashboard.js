
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import * as webApi from '../api/WebApi';

import ReactTable from "react-table";
import "react-table/react-table.css";

import QuerySlicer from "../components/QuerySlicer";
import NumberRange from "../components/NumberRange";

import EditFilter from "./EditFilter";
import EditWidget from "./EditWidget";

const filterTypes = [
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


class EditDashboard extends Component {

  constructor(props) {
    super(props);
    

    this.state = {
      jdbcDataSourceOptions: [],
      dashboardId: 0,
      name: '',
      widgets: [],
      filters: [],
      slicer: {},
      jdbcDataSourceId: 1,
      // Filter common
      filterId: null,
      filterTitle: '',
      filterType: '',
      // Query slicer
      querySlicerDataSource: {},
      querySlicerSqlQuery: '',
      querySlicerDisplay: '',
      querySlicerColumns: []
    }

    this.filterViewPanel = React.createRef();
    this.filterEditPanel = React.createRef();
    this.WidgetViewPanel = React.createRef();
    this.widgetEdtiPanel = React.createRef();
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

      this.initFilters();
      // TODO: inig widgets based on the base value of the filters.
      this.initWidgets();
    } else {
      this.setState({ 
        dashboardId: null,
        filters: [],
        widgets: []
      });
    } 
  }

  initFilters() {
    const filters = this.state.filters;
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (filter.type === 'slicer') {
        axios.get('/ws/filter/run/' + filter.id)
          .then(res => {
            const result = res.data;
            const index = filters.findIndex(f => f.id === result.id);
            const newFilters = [...this.state.filters];
            newFilters[index].queryResult = JSON.parse(result.data);
            this.setState({
              filters: newFilters
            });
          });
      }
    }
  }

  initWidgets() {
    const widgets = this.state.widgets;
    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i];
      axios.get('/ws/widget/query/' + widget.id)
        .then(res => {
          const result = res.data;
          const index = widgets.findIndex(w => w.id === result.id);
          const newWidgets = [...this.state.widgets];
          newWidgets[index].queryResult = JSON.parse(result.data);
          this.setState({
            widgets: newWidgets
          });
        });
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

  saveDashboard = (event) => {
    event.preventDefault();
    const dashboard = {
      name: this.state.name
    };

    axios.post('/ws/dashboard', dashboard)
      .then(res => {
        const dashboardId = res.data.id;
        this.setState({
          dashboardId: dashboardId
        });
      });
  }


  applyFilters = () => {
    // TODO: 
    // 1. check filters are changed.
    // 2, go through widgets to see which one is affected by that filter.
    const filters = this.state.filters;
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
    }

    this.initWidgets();
  }

  renderFilterPanel = () => {
    const filterPanel = [];
    const filters = this.state.filters;
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (filter.type === 'slicer') {
        console.log('11111');

        const queryResult = filter.queryResult;
        const checkBoxes = [];
        for (let i = 0; i < queryResult.length; i++) {
          checkBoxes.push({
            value: queryResult[i],
            isChecked: false
          });
        }

        filterPanel.push(<QuerySlicer key={i} filterId={filter.id} checkBoxes={checkBoxes} onChange={this.onQuerySlicerChange} />);
      } else if (filter.type === 'number-range') {
        filterPanel.push(<NumberRange key={i} />);
      } else if (filter.type === 'date-range') {

      }
    }
    return filterPanel;
  }

  onQuerySlicerChange = (filterId, checkBoxes) => {
    console.log('onQuerySlicerChange', filterId, checkBoxes);

    const filter = this.state.filters.find(f => f.id === filterId);

    const checked = [];
    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].isChecked) {
        checked.push(checkBoxes[i]);
      }
    }

    const isSelectAll = checked.length === checkBoxes.length;
  }

  saveFilter = (event) => {
    event.preventDefault();

    const type = this.state.filterType.value;
    const dashboardId = this.state.dashboardId;
    const filter = {
      title: this.state.filterTitle,
      type: type,
      dashboardId: dashboardId
    };
    switch (type) {
      case 'slicer':
        filter.data = {
          dataSourceId: this.state.querySlicerDataSource.value,
          sqlQuery: this.state.querySlicerSqlQuery,
          display: this.state.querySlicerDisplay,
          columns: [{
              name: 'name',
              param: 'name'
            },
            {
              name: 'b',
              param: ':column b'
            }
          ]
        };
        console.log('saveFilter', filter);
        break;
      case 'number-range':
        filter.data = {
          minParam: ':p1',
          maxParam: ':p2',
          minDefault: 0,
          maxDefault: 100,
          minValue: 0,
          maxValue: 100,
        };
        break;
      case 'date-range':
        filter.data = {
          startParam: 'p1',
          endParam: 'p2'
        };
        break;
      default:
    }

    axios.post('/ws/filter', filter)
      .then(res => {
      });
  }

  saveWidget = (event) => {
    event.preventDefault();
    const widget = {
      dashboardId: this.state.dashboardId,
      jdbcDataSourceId: this.state.jdbcDataSourceId,
      data: {
        sqlQuery: 'select * from page',

      }
    };

    axios.post('/ws/widget', widget)
      .then(res => {
      });
  }

  showEditFilter = (filter) => {
    console.log('showEditFilter', filter);
    

    if (filter === null) {
      this.setState({
        
      });
    } else {
      const { type, id, title } = filter;
      const filterType = filterTypes.find(x => x.value === type);
      console.log('filterType', filterType);
      this.setState({
        filterId: id,
        filterTitle: title,
        filterType: filterType
      });
      
      if (type === 'slicer') {
        const { dataSourceId } = filter;
        const querySlicerDataSource = this.state.jdbcDataSourceOptions.find(x => x.id === dataSourceId);
        this.setState({
          querySlicerDataSource
        });
      }
      
    }   

    this.setState(prevState => ({
      showEditFilter: !prevState.showEditFilter
    }));
  }

  handleQuerySlicerDataSourceChange = (ds) => {
    this.setState({ 
      querySlicerDataSource: ds 
    });
    console.log(`handleQuerySlicerDataSourceChange selected:`, ds);
  }

  handleFilterTypeChange = (filterType) => {
    this.setState({ filterType });
    console.log('filterType selected:', filterType);
  }

  renderQuerySlicerForm = () => {
    return (
      <div>
        <label>DataSource</label>
        <br/>
        <Select
          value={this.state.querySlicerDataSource}
          onChange={this.handleQuerySlicerDataSourceChange}
          options={this.state.jdbcDataSourceOptions}
        />
        <label>SQL</label>
        <br/>
        <input 
          type="text" 
          name="querySlicerSqlQuery" 
          value={this.state.querySlicerSqlQuery}
          onChange={this.handleInputChange} />

        <label>Display</label>
        <br/>
        <input 
          type="text" 
          name="querySlicerDisplay" 
          value={this.state.querySlicerDisplay}
          onChange={this.handleInputChange} />
      </div>
    );
  }


  showEditWidget = () => {

  }

  render() {

    const filterDrawerClass = this.state.showEditFilter ? 'right-drawer display-block' : 'right-drawer display-none';

    const filterItems = this.state.filters.map((filter, index) => 
      <div key={index}>
        {filter.dashboardId} - {filter.type} - {filter.data.sqlQuery}
        <button onClick={() => this.showEditFilter(filter)}>Update Filter</button>
      </div>
    );

    const widgetItems = this.state.widgets.map((w, index) => 
      <div key={index}>
        {w.id} - {w.data.sqlQuery}
        <div>
          <ReactTable
            data={w.queryResult}
            columns={[
              {
                Header: "page_id",
                accessor: "page_id"
              },
              {
                Header: "account_key",
                accessor: "account_key"
              },
              {
                Header: "name",
                accessor: "name"
              },
              {
                Header: "description",
                accessor: "description"
              },
            ]}
            defaultPageSize={10}
          />
        </div>
      </div>
    );

    const { filterType } = this.state;
    let filterForm = null;
    if (filterType.value === 'slicer') {
      filterForm = this.renderQuerySlicerForm();
    }

    return (
      <div className="panel">
        <h3>Edit Board</h3>
        <div>
          <h4>Board - id: {this.state.dashboardId}</h4>
          <form>
            <label>Name</label>
            <br/>
            <input 
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} />
          </form>
          <button onClick={this.saveDashboard}>Save</button>
        </div>

        <div>
          <h5>Widgets</h5>
          <button onClick={this.saveWidget}>save Widget</button>
          <div>
            {widgetItems}
          </div>
        </div>

        <div>
          <h5>Filters</h5>
          {this.renderFilterPanel()}
          <hr/>
          <button onClick={this.applyFilters}>Apply filter</button>
          {filterItems}
        </div>

        <div>
          <h5>Add Filter</h5>
          <button onClick={() => this.showEditFilter(null)}>Add Filter</button>
          <div className={filterDrawerClass}>
            <div>{this.state.filterId}  - {this.state.filterTitle}</div>
            <label>Type</label>
            <br/>
            <Select
              value={filterType}
              onChange={this.handleFilterTypeChange}
              options={filterTypes}
            />

            <label>Title</label>
            <br/>
            <input 
              type="text" 
              name="filterTitle" 
              value={this.state.filterTitle}
              onChange={this.handleInputChange} />

            {filterForm}

            <button onClick={this.saveFilter}>save filter</button>
          </div>
        </div>

        <div>
          <h5>Add widget</h5>
          <EditWidget />
        </div>
        
      </div>
    );
  }
}

export default withRouter(EditDashboard);
