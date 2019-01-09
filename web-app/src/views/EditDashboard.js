
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
    showAddFilter: false
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
    const jdbcDataSources = webApi.fetchDataSources();
    this.setState({ 
      jdbcDataSources: jdbcDataSources 
    });

    if (dashboardId !== undefined) {
      const dashboard = webApi.fetchDashboardById(dashboardId);
      this.setState({ 
        dashboardId: dashboardId,
        filters: dashboard.filters,
        widgets: dashboard.widgets
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

  addCard = () => {

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

  render() {

    const filterDrawerClass = this.state.showAddFilter ? 'right-drawer display-block' : 'right-drawer display-none';

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
          <h5>Widgets</h5>
          <button onClick={this.addCard}>add card</button>
          <div>
            {this.state.widgets}
          </div>
        </div>
        <div>
          <h5>Filters</h5>
          <button onClick={this.addFilter}>add filter</button>
          <div>
            {this.state.filters}
          </div>
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
