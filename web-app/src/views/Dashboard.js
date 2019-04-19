
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import DashboardEditView from './DashboardEditView';
import Modal from '../components/Modal';
import './Dashboard.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Constants from '../api/Constants';

const ROUTE_WORKSPACE_DASHBOARD = '/workspace/dashboard/';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      dashboards: [],
      showEditPanel: false,
      activeDashboardId: 0,
      name: ''
    }
  }

  componentDidMount() {
    const pathname = this.props.location.pathname;
    console.log('Dashboard - componentDidMount', pathname);
    const index = pathname.indexOf(ROUTE_WORKSPACE_DASHBOARD);
    if (index !== -1) {
      const activeDashboardId = Number(pathname.substring(index + ROUTE_WORKSPACE_DASHBOARD.length));
      console.log('Dashboard - componentDidMount', activeDashboardId);
      this.setState({
        activeDashboardId: activeDashboardId
      })
    }
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
        backgroundColor: 'rgba(233, 235, 238, 1)'
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
    console.log('view', dashboardId);
    this.setState({
      activeDashboardId: dashboardId
    }, () => {
      this.props.history.push(`/workspace/dashboard/${dashboardId}`);
    });
  }

  onDashboardSave = (dashboardId) => {
    this.fetchBoards();
  }

  onDashboardDelete = (dashboardId) => {
    this.fetchBoards();
    this.setState({
      activeDashboardId: 0
    }, () => {
      this.props.history.push('/workspace/dashboard');
    });
  }

  render() {
    const {
      dashboards = [],
      activeDashboardId,
      searchValue
    } = this.state;

    const {
      sysRole
    } = this.props;
    const showEdit = true;//= sysRole === Constants.SYS_ROLE_VIEWER ? false : true;

    console.log('Dashboard - render', activeDashboardId);

    const dashboardRows = [];
    for (let i = 0; i < dashboards.length; i++) {
      const dashboard = dashboards[i];
      const name = dashboard.name;
      const menuActive = activeDashboardId === dashboard.id ? 'dashboard-menu-item-active' : '';
      if (!searchValue || (searchValue && name.includes(searchValue))) {
        dashboardRows.push(
          (
            <div key={i} className={`dashboard-menu-item ellipsis ${menuActive}`} onClick={() => this.view(dashboard.id)}>
              {name}
            </div>
          )
        )
      }
    }

    return (
      <div>
        <div className="dashboard-sidebar">
          <div style={{margin: '5px'}}>
            {
              showEdit ? (
                <button className="button icon-button dashboard-add-button" onClick={() => this.setState({ showEditPanel: true })}>
                  <FontAwesomeIcon icon="plus" /> New
                </button>
              ) : null
            }
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
            render={(props) => 
              <DashboardEditView 
                key={props.match.params.id} 
                onDashboardSave={this.onDashboardSave} 
                onDashboardDelete={this.onDashboardDelete} 
              />
            } 
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
