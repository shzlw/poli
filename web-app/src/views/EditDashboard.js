
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import * as webApi from '../api/WebApi';


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
    jdbcDataSourceId: 1
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
    this.initData(dashboardId);
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
    }    
  }

  initFilter() {

  }

  initWidget() {

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


  addFilter = () => {
    this.setState({
      showAddFilter: !this.state.showAddFilter
    })
  }

  saveFilter = (event) => {
    event.preventDefault();
    const dashboardId = this.state.dashboardId;
    const filter = {
      dashboardId: dashboardId,
      data: {
        type: 'slicer',
        sqlQuery: 'select name from page group by name;'
      }
    };

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

  render() {

    const filterDrawerClass = this.state.showAddFilter ? 'right-drawer display-block' : 'right-drawer display-none';

    const filterItems = this.state.filters.map((filter, index) => 
      <div key={index}>
        {filter.dashboardId} - {filter.data.type} - {filter.data.sqlQuery}
      </div>
    );

    const jdbcDataSourceItems = this.state.jdbcDataSources.map((ds, index) => 
      <div key={index}>
        {ds.id} - {ds.name}
      </div>
    );

    const widgetItems = this.state.widgets.map((w, index) => 
      <div key={index}>
        {w.id} - {w.data.sqlQuery}
      </div>
    );

    return (
      <div>
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
          <h5>Datasources</h5>
          {jdbcDataSourceItems}
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
          <button onClick={this.addFilter}>add filter</button>

          {filterItems}
        </div>
        
        <div className={filterDrawerClass}>
          <h5>Add Filter</h5>
          <button onClick={this.saveFilter}>save filter</button>
        </div>
        
      </div>
    );
  }
}

export default withRouter(EditDashboard);
