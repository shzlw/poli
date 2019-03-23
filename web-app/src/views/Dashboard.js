
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import axios from 'axios';
import './Dashboard.css';

import { Route } from "react-router-dom";
import DashboardEditView from './DashboardEditView';
import Modal from '../components/Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      height
    } = this.state;

    const dashboard = {
      name: name,
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
    const {
      dashboards = []
    } = this.state;
    
    const dashboardRows = dashboards.map((d, index) => 
      <div key={index} className="dashboard-menu-item ellipsis" onClick={() => this.view(d.id)}>
        {d.name}
      </div>
    );

    return (
      <div>
        <div className="dashboard-sidebar">
          <div style={{margin: '5px'}}>
            <button className="button icon-button dashboard-add-button" onClick={() => this.setState({ showEditPanel: true })}>
              <FontAwesomeIcon icon="plus" /> New dashboard
            </button>
            <input 
              type="text" 
              name="searchValue" 
              value={this.state.searchValue}
              placeholder="Search..."
              onChange={this.handleInputChange} />
          </div>
          <div>
            {dashboardRows}
          </div>
        </div>
        <div className="dashboard-content">
          <Route 
            path="/workspace/dashboard/:id" 
            render={(props) => <DashboardEditView key={props.match.params.id} onSaveDashboard={this.onSaveDashboard} />} 
            />
        </div>

        <Modal 
          show={this.state.showEditPanel}
          onClose={() => this.setState({ showEditPanel: false })}
          modalClass={'small-modal-panel'} 
          title={'New'} >
          <div>
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} 
              />
            <label>Height</label>
            <input 
              type="text" 
              name="height" 
              value={this.state.height}
              onChange={this.handleInputChange} 
              />
            <button className="button" onClick={this.save}>Save</button>
          </div>
        </Modal>

      </div>
    );
  }
}

export default withRouter(Dashboard);
