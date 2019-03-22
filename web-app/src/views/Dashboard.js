
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import axios from 'axios';
import './Dashboard.css';

import { Route } from "react-router-dom";
import DashboardEditView from './DashboardEditView';
import Modal from '../components/Modal';


class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      searchValue: '',
      dashboards: [],
      showEditPanel: false,
      name: '',
      width: 1200,
      height: 800
    };
  }

  componentDidMount() {
    this.fetchBoards();
  }

  fetchBoards = () => {
    axios.get('/ws/dashboard')
      .then(res => {
        const dashboards = res.data;
        this.setState({ 
          dashboards: dashboards 
        });
      });
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  save = () => {
    const {
      name,
      width,
      height
    } = this.state;

    const dashboard = {
      name: name,
      width: width,
      height: height
    };

    axios.post('/ws/dashboard', dashboard)
      .then(res => {
        const dashboardId = res.data;
        this.setState({ 
          showEditPanel: false 
        });
        this.fetchBoards();
        this.props.history.push(`/workspace/dashboard/${dashboardId}`);
      });
  }

  view = (dashboardId) => {
    this.props.history.push(`/workspace/dashboard/${dashboardId}`);
  }

  onSaveDashboard = (dashboardId) => {
    console.log('onSaveDashboard', dashboardId);
    this.fetchBoards();
  }

  render() {
    const dashboardRows = this.state.dashboards.map((d, index) => 
      <div key={index} className="dashboard-menu-item" onClick={() => this.view(d.id)}>
        <div>{d.id} {d.name}</div>
      </div>
    );

    return (
      <div>
        <div className="dashboard-sidebar">
          <button onClick={() => this.setState({ showEditPanel: true })}>Add</button>
          <label>Search</label>
          <input 
            type="text" 
            name="searchValue" 
            value={this.state.searchValue}
            placeholder="Dashboard"
            onChange={this.handleInputChange} />
          {dashboardRows}
        </div>
        <div className="dashboard-content">
          <Route path="/workspace/dashboard/:id" render={(props) => <DashboardEditView key={props.match.params.id} onSaveDashboard={this.onSaveDashboard} />} />
        </div>

        <Modal 
          show={this.state.showEditPanel}
          onClose={() => this.setState({ showEditPanel: false })}
          modalClass={'lg-modal-panel'} >
          <div>New dashboard</div>
          <button onClick={this.save}>Save</button>
          <form>
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} 
              style={{width: '200px'}}
              />

            <label>Width</label>
            <input 
              type="text" 
              name="width" 
              value={this.state.width}
              onChange={this.handleInputChange} 
              style={{width: '100px'}}
              />

            <label>Height</label>
            <input 
              type="text" 
              name="height" 
              value={this.state.height}
              onChange={this.handleInputChange} 
              style={{width: '100px'}}
              />
            
          </form>
        </Modal>

      </div>
    );
  }
}

export default withRouter(Dashboard);
