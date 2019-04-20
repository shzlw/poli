
import React from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import Select from '../components/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Group extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      dashboards: [],
      showEditPanel: false,
      searchValue: '',
      id: null,
      name: '',
      groupDashboardId: '',
      groupDashboards: []
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleIntegerOptionChange = (name, value) => {
    const intValue = parseInt(value, 10) || 0;
    this.setState({ 
      [name]: intValue
    });
  }

  get initialEditPanelState() {
    return {
      id: null,
      name: '',
      groupDashboardId: '',
      groupDashboards: []
    };
  }

  componentDidMount() {
    this.fetchGroups();
    this.fetchDashboards();
  }

  fetchGroups = () => {
    axios.get('/ws/group')
      .then(res => {
        const groups = res.data;
        this.setState({ 
          groups: groups 
        });
      });
  }

  fetchDashboards = () => {
    axios.get('/ws/dashboard')
      .then(res => {
        const dashboards = res.data;
        this.setState({ 
          dashboards: dashboards 
        });
      });
  }

  openEditPanel = (group) => {
    if (group !== null) {
      this.setState({
        id: group.id,
        name: group.name,
        groupDashboards: group.groupDashboards
      });
    } else {
      this.clearEditPanel();
    }
    this.setState({
      groupDashboardId: '',
      showEditPanel: true
    }); 
  }

  closeEditPanel = () => {
    this.setState({
      showEditPanel: false
    });
  }

  clearEditPanel = () => {
    this.setState(this.initialEditPanelState);
  }

  save = () => {
    const {
      id,
      name,
      groupDashboards
    } = this.state;

    let group = {
      name: name,
      groupDashboards: groupDashboards
    };

    if (id !== null) {
      group.id = id;
      axios.put('/ws/group', group)
        .then(res => {
          this.clearEditPanel();
          this.fetchGroups();
          this.closeEditPanel();
        });
    } else {
      axios.post('/ws/group', group)
        .then(res => {
          this.clearEditPanel();
          this.fetchGroups();
          this.closeEditPanel();
        });
    } 
  }

  delete = (id) => {
    axios.delete('/ws/group/' + id)
      .then(res => {
        this.fetchGroups();
      });
  }

  addGroupDashboard= () => {
    const { 
      groupDashboardId,
      groupDashboards = []
    } = this.state;

    if (groupDashboardId) {
      const index = groupDashboards.findIndex(dashboardId => dashboardId === groupDashboardId);
      if (index === -1) {
        const newGroupDashboards = [...groupDashboards];
        newGroupDashboards.push(groupDashboardId);
        this.setState({
          groupDashboards: newGroupDashboards
        });
      }
    }
  }

  removeGroupDashboard = (dashboardId) => {
    const { 
      groupDashboards = [] 
    } = this.state;
    const index = groupDashboards.findIndex(id => id === dashboardId);
    if (index !== -1) {
      const newGroupDashboards = [...groupDashboards];
      newGroupDashboards.splice(index, 1);
      this.setState({
        groupDashboards: newGroupDashboards
      });
    } 
  }

  render() {
    const { 
      id,
      groups = [],
      dashboards = [],
      groupDashboards = []
    } = this.state;

    const mode = id === null ? 'New' : 'Edit';

    const groupItems = groups.map(group => 
      <div key={group.id} className="group-card">
        <p>
          {group.name}
          <button className="button" onClick={() => this.openEditPanel(group)}>update</button>
          <button className="button" onClick={() => this.delete(group.id)}>delete</button>
        </p>
      </div>
    );

    const groupDashboardItems = [];
    for (let i = 0; i < groupDashboards.length; i++) {
      const dashboardId = groupDashboards[i];
      for (let j = 0; j < dashboards.length; j++) {
        if (dashboardId === dashboards[j].id) {
          groupDashboardItems.push(
            (
              <div key={dashboardId}>
                <div>Name: {dashboards[j].name}</div>
                <button className="button" onClick={() => this.removeGroupDashboard(dashboardId)}>delete</button>
              </div>
            )
          );
          break;
        }
      }
    }

    return (
      <div>
        <div>
          <input
            type="text"
            name="searchValue"
            value={this.state.searchValue}
            onChange={this.handleInputChange}
            placeholder="Search..."
            style={{width: '200px'}}
            />
          <button className="button" onClick={this.clearSearch}>Clear</button>
          <button className="button" onClick={() => this.openEditPanel(null)}>
            <FontAwesomeIcon icon="plus" /> New Group
          </button>
        </div>
        <div className="row">
          {groupItems}
        </div>

        <Modal 
          show={this.state.showEditPanel}
          onClose={this.closeEditPanel}
          modalClass={'mid-modal-panel'} 
          title={mode} >

          <div className="form-panel">
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} />
            
            <label>Dashboards</label>
            <Select
              name={'groupDashboardId'}
              value={this.state.groupDashboardId}
              onChange={this.handleIntegerOptionChange}
              options={dashboards}
              optionDisplay={'name'}
              optionValue={'id'}
            />
            <button className="button" onClick={this.addGroupDashboard}>Add</button>
            <div>
              {groupDashboardItems}
            </div>
            
            <button className="button" onClick={this.save}>Save</button>
          </div>
        </Modal>
        
      </div>
    )
  }
}

export default Group;