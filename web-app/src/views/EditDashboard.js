
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import * as webApi from '../api/WebApi';

import ReactTable from "react-table";
import "react-table/react-table.css";

import QuerySlicer from "../components/QuerySlicer";
import NumberRange from "../components/NumberRange";

import EditFilter from "./EditFilter";
import EditWidget from "./EditWidget";

class EditDashboard extends Component {

  state = { 
    mode: '',
    jdbcDataSources: [],
    dashboardId: 0,
    name: '',
    widgets: [],
    filters: [],
    slicer: {},
    showAddFilter: false,
    jdbcDataSourceId: 1,
    showEditFilter: false,
    EditFilterId: null
  };

  componentDidMount() {
    const dashboardId = this.props.match.params.id;
    console.log("id", dashboardId);
    let mode = 'Edit';
    if (dashboardId === undefined) {
      mode = 'New';
    }
    this.setState({
      mode: mode
    });
    // this.initData(dashboardId);
  }

  async initData(dashboardId) {
    const jdbcDataSources = await webApi.fetchDataSources();
    this.setState({ 
      jdbcDataSources: jdbcDataSources 
    });

    if (dashboardId !== undefined) {
      const dashboard = await webApi.fetchDashboardById(dashboardId);
      const filters = dashboard.filters;
      const widgets = dashboard.widgets;
      console.log('filters', filters);
      this.setState({ 
        dashboardId: dashboardId,
        filters: filters,
        widgets: widgets
      });

      this.initWidgets();
    }    
  }

  initFilters() {
    const filters = this.state.filters;
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (filter.type === 'slicer') {
        axios.get('/ws/filter/run/' + filter.id)
          .then(res => {
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

  }

  buildFilterPanel = () => {
    const filterPanel = [];
    const filters = this.state.filters;
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (filter.type === 'slicer') {
        filterPanel.push(<QuerySlicer key={i} data={this.state.querySlicerData} onApply={this.onApply} />);
      } else if (filter.type === 'number-range') {
        filterPanel.push(<NumberRange key={i} />);
      } else if (filter.type === 'date-range') {

      }
    }
    return filterPanel;
  }

  saveFilter = (event) => {
    event.preventDefault();

    const type = 'slicer';
    const dataSourceId = 1;
    const dashboardId = this.state.dashboardId;
    const filter = {
      type: type,
      dataSourceId: dataSourceId,
      dashboardId: dashboardId
    };
    switch (type) {
      case 'slicer':
        filter.data = {
          sqlQuery: 'select name from page group by name',
          columnParam: ':columnB'
        };
        break;
      case 'number-range':
        filter.data = {
          minParam: ':p1',
          maxParam: ':p2',
          minDefault: 0,
          maxDefault: 100,
          minValue: 0,
          maxValue: 100
        };
        break;
      case 'date-range':
        filter.data = {
          startParam: ':p1',
          endParam: ':p2'
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
        sqlQuery: 'select * from page'
      }
    };

    axios.post('/ws/widget', widget)
      .then(res => {
      });
  }

  showEditFilter = (id) => {
    console.log(id);
    this.setState({
      showEditFilter: !this.state.showEditFilter,
      EditFilterId: id
    })
  }

  showEditWidget = () => {

  }

  render() {

    const filterDrawerClass = this.state.showEditFilter ? 'right-drawer display-block' : 'right-drawer display-none';

    const filterItems = this.state.filters.map((filter, index) => 
      <div key={index}>
        {filter.dashboardId} - {filter.data.type} - {filter.data.sqlQuery}
        <button onClick={() => this.showEditFilter(filter.id)}>Update Filter</button>
      </div>
    );

    const jdbcDataSourceItems = this.state.jdbcDataSources.map((ds, index) => 
      <div key={index}>
        {ds.id} - {ds.name} - {ds.username}
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
          {filterItems}
        </div>

        <div>
          <h5>Add Filter</h5>
          <button onClick={() => this.showEditFilter(null)}>Add Filter</button>
          <div className={filterDrawerClass}>
            <EditFilter filterId={this.state.EditFilterId} />
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
