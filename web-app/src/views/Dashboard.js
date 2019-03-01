
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import axios from 'axios';
import './Dashboard.css';

import { Route, Switch } from "react-router-dom";
import DashboardEditView from './DashboardEditView';
import Modal from '../components/Modal';


class Dashboard extends Component {

  state = { 
    dashboards: [],
    showEditPanel: false,
    name: ''
  };

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
    const dashboard = {
      name: this.state.name
    };

    axios.post('/ws/dashboard', dashboard)
      .then(res => {
        const dashboardId = res.data;
        this.props.history.push(`/dashboard/${dashboardId}`);
      });
  }

  view = (dashboardId) => {
    this.props.history.push(`/dashboard/${dashboardId}`);
  }

  render() {
    const dashboardRows = this.state.dashboards.map((d, index) => 
      <div key={index} className="dashboard-item" onClick={() => this.view(d.id)}>
        <div>{d.id} {d.name}</div>
      </div>
    );

    return (
      <div>
        <div className="dashboard-sidebar">
          <button onClick={() => this.setState({ showEditPanel: true })}>Add</button>
          {dashboardRows}
        </div>
        <div className="dashboard-content">
          <Switch>
            <Route path="/dashboard/:id" component={DashboardEditView} />
          </Switch>
        </div>

        <Modal 
          show={this.state.showEditPanel}
          onClose={() => this.setState({ showEditPanel: false })}
          modalClass={'lg-modal-panel'} >
          <div>New dashboard</div>
          <button onClick={() => this.setState({showEditPanel: false })}>Close</button>
          <button onClick={this.save}>Save</button>
          <form>
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} />

            <label>Width</label>
            <input 
              type="text" 
              name="width" 
              value={this.state.width}
              onChange={this.handleInputChange} />

            <label>Height</label>
            <input 
              type="text" 
              name="height" 
              value={this.state.height}
              onChange={this.handleInputChange} />
            
          </form>
        </Modal>

      </div>
    );
  }
}

export default withRouter(Dashboard);
