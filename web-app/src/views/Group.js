
import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from '../components/Modal';
import Select from '../components/Select';
import SearchInput from '../components/SearchInput';

class Group extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      dashboards: [],
      showConfirmDeletionPanel: false,
      objectToDelete: {},
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

  handleNameInputChange = (name, value) => {
    this.setState({
      [name]: value
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

  confirmDelete = () => {
    const { 
      objectToDelete = {} 
    } = this.state;
    axios.delete('/ws/group/' + objectToDelete.id)
      .then(res => {
        this.fetchGroups();
        this.closeConfirmDeletionPanel();
      });
  }

  openConfirmDeletionPanel = (group) => {
    this.setState({
      objectToDelete: group,
      showConfirmDeletionPanel: true
    });
  }

  closeConfirmDeletionPanel = () => {
    this.setState({
      objectToDelete: {},
      showConfirmDeletionPanel: false
    });
  }

  render() {
    const { 
      id,
      groups = [],
      dashboards = [],
      groupDashboards = [],
      searchValue,
      showConfirmDeletionPanel,
      objectToDelete = {}
    } = this.state;

    const mode = id === null ? 'New' : 'Edit';

    const groupItems = [];
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const name = group.name;
      if (!searchValue || (searchValue && name.includes(searchValue))) {
        groupItems.push(
          (
            <div key={i} className="datasource-card row">
              <div className="float-left ellipsis datasource-row-name">
                {name}
              </div>
              <div className="float-right">
                <button className="icon-button datasource-icon-button" onClick={() => this.openEditPanel(group)}>
                  <FontAwesomeIcon icon="edit" size="lg" />
                </button>
                <button className="icon-button datasource-icon-button" onClick={() => this.openConfirmDeletionPanel(group)}>
                  <FontAwesomeIcon icon="trash-alt" size="lg" />
                </button>
              </div>
            </div>
          )
        )
      }
    }

    const groupDashboardItems = [];
    for (let i = 0; i < groupDashboards.length; i++) {
      const dashboardId = groupDashboards[i];
      for (let j = 0; j < dashboards.length; j++) {
        if (dashboardId === dashboards[j].id) {
          groupDashboardItems.push(
            (
              <div key={dashboardId} className="row table-row">
                <div className="float-left ellipsis">{dashboards[j].name}</div>
                <button className="button table-row-button float-right" onClick={() => this.removeGroupDashboard(dashboardId)}>
                  <FontAwesomeIcon icon="trash-alt" />
                </button>
              </div>
            )
          );
          break;
        }
      }
    }

    return (
      <div>
        <div class="row">
          <div className="float-left" style={{marginRight: '5px'}}>
            <SearchInput 
              name={'searchValue'} 
              value={this.state.searchValue} 
              onChange={this.handleNameInputChange} 
              inputWidth={200}
            />
          </div>
          <button className="button float-left" onClick={() => this.openEditPanel(null)}>
            <FontAwesomeIcon icon="plus" /> New
          </button>
        </div>
        <div className="row mt-10">
          {groupItems}
        </div>

        <Modal 
          show={this.state.showEditPanel}
          onClose={this.closeEditPanel}
          modalClass={'mid-modal-panel'} 
          title={mode} >
          <div className="row">
            <div className="form-panel float-left" style={{width: '240px'}}>
              <label>Name</label>
              <input 
                type="text" 
                name="name" 
                value={this.state.name}
                onChange={this.handleInputChange} />
            </div>
            
            <div className="form-panel float-right" style={{width: '240px'}}>
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
              <div className="mt-3">
                {groupDashboardItems}
              </div>
            </div>
          </div>
          <button className="button mt-3" onClick={this.save}>Save</button>
        </Modal>

        <Modal 
          show={showConfirmDeletionPanel}
          onClose={this.closeConfirmDeletionPanel}
          modalClass={'small-modal-panel'}
          title={'Confirm Deletion'} >
          <div className="confirm-deletion-panel">
            Are you sure you want to delete {objectToDelete.name}?
          </div>
          <button className="button" onClick={this.confirmDelete}>Delete</button>
        </Modal>
        
      </div>
    )
  }
}

export default Group;