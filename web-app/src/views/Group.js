
import React from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

class Group extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      dashboards: [],
      showEditPanel: false,
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

  handleOptionChange = (name, event) => {
    this.setState({
      [name]: event.target.value
    });
  }

  get initialEditPanelState() {
    return {
      id: null,
      name: '',
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

  save = (event) => {
    event.preventDefault();
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
        });
    } else {
      axios.post('/ws/group', group)
        .then(res => {
          this.clearEditPanel();
          this.fetchGroups();
        });
    } 
  }

  delete = (id) => {
    axios.delete('/ws/group/' + id)
      .then(res => {
        this.fetchGroups();
      });
  }

  addGroupDashboard= (event) => {
    event.preventDefault();
    const { 
      groupDashboardId,
      groupDashboards = []
    } = this.state;
    const index = groupDashboards.findIndex(dashboardId => dashboardId === groupDashboardId);
    if (index === -1) {
      const newGroupDashboards = [...groupDashboards];
      newGroupDashboards.push(groupDashboardId);
      this.setState({
        groupDashboards: newGroupDashboards
      });
    }
  }

  removeGroupDashboard = (dashboardId, event) => {
    event.preventDefault();
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
      groups = [],
      dashboards = [],
      groupDashboards = []
    } = this.state;

    const dashboardOptions = dashboards.map(dash => 
      <option value={dash.id} key={dash.id}>{dash.name}</option>
    );

    const groupItems = groups.map(group => 
      <div key={group.id} className="group-card">
        <p>
          {group.name}
          <button onClick={() => this.openEditPanel(group)}>update</button>
          <button onClick={() => this.delete(group.id)}>delete</button>
        </p>
      </div>
    );

    const groupDashboardItems = [];
    for (let i = 0; i < groupDashboards; i++) {
      const dashboardId = groupDashboards[i];
      for (let j = 0; j < dashboards; j++) {
        if (dashboardId === dashboards[j].id) {
          groupDashboardItems.push(
            (
              <div key={dashboardId}>
                <div>Name: {dashboards[j].name}</div>
                <button onClick={(event) => this.removeGroupDashboard(dashboardId, event)}>delete</button>
              </div>
            )
          );
          break;
        }
      }
    }

    return (
      <div>
        <h1>Group</h1>
        <input
          type="text"
          name=""
          placeholder="By Group..."
          />
        <button onClick={this.search}>Search</button>
        <div className="row">
          {groupItems}
        </div>
        <button onClick={() => this.openEditPanel(null)}>
          Add
        </button>

        <Modal 
          show={this.state.showEditPanel}
          onClose={this.closeEditPanel}
          modalClass={'lg-modal-panel'} 
          title={'Group'} >

          <div>
            <h3>{'Group'}</h3>
            <form>
              <label>Name</label>
              <input 
                type="text" 
                name="name" 
                value={this.state.name}
                onChange={this.handleInputChange} />
              
              <label>Dashboards</label>
              <select value={this.state.groupDashboardId} onChange={(event) => this.handleOptionChange('groupDashboardId', event)}>
                {dashboardOptions}
              </select>
              <button onClick={this.addGroupDashboard}>Add</button>
              <div>
                {groupDashboardItems}
              </div>

            </form>

            <div>
              <button onClick={this.save}>Save</button>
            </div>
          </div>

        </Modal>
        
      </div>
    )
  }
}

export default Group;