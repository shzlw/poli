
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Dashboard.css';
import * as Constants from '../api/Constants';
import DashboardEditView from './DashboardEditView';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import SearchInput from '../components/SearchInput';

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
    const index = pathname.indexOf(ROUTE_WORKSPACE_DASHBOARD);
    if (index !== -1) {
      const activeDashboardId = Number(pathname.substring(index + ROUTE_WORKSPACE_DASHBOARD.length));
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

  handleNameInputChange = (name, value) => {
    this.setState({
      [name]: value
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

    if (!name) {
      Toast.showError('Enter a name.');
      return;
    }

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
        Toast.showError('The name exists. Try another.');
      });
  }

  view = (dashboardId) => {
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
    const showEdit = sysRole === Constants.SYS_ROLE_VIEWER ? false : true;

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
      <React.Fragment>
        <div className="dashboard-sidebar">
          <div style={{margin: '5px'}}>
            { showEdit && (
              <button className="button icon-button dashboard-add-button" onClick={() => this.setState({ showEditPanel: true })}>
                <FontAwesomeIcon icon="plus" /> New
              </button>
            )}

            <div style={{marginTop: '5px'}}>
              <SearchInput 
                name={'searchValue'} 
                value={this.state.searchValue} 
                onChange={this.handleNameInputChange} 
                inputWidth={117}
              />
            </div>
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
          <div className="form-panel">
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

      </React.Fragment>
    );
  }
}

export default withRouter(Dashboard);
