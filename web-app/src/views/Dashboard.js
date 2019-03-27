
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import DashboardEditView from './DashboardEditView';
import Modal from '../components/Modal';
import './Dashboard.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Constants from '../api/Constants';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      dashboards: [],
      showEditPanel: false,
      name: ''
    }
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
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  closeEditPanel = () => {
    this.setState({
      showEditPanel: false,
      name: ''
    });
  }

  save = () => {
    const {
      name
    } = this.state;

    const dashboard = {
      name: name,
      style: {
        height: Constants.DEFAULT_DASHBOARD_HEIGHT,
        backgroundColor: 'rgba(255, 255, 255, 1)'
      }
    };

    axios.post('/ws/dashboard', dashboard)
      .then(res => {
        const dashboardId = res.data;
        this.closeEditPanel();
        this.fetchBoards();
        this.props.history.push(`/workspace/dashboard/${dashboardId}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  view = (dashboardId) => {
    this.props.history.push(`/workspace/dashboard/${dashboardId}`);
  }

  onSaveDashboard = (dashboardId) => {
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
            <button className="button" onClick={this.save}>Save</button>
          </div>
        </Modal>

      </div>
    );
  }
}

export default withRouter(Dashboard);
