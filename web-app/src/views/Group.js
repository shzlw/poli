
import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';

import Modal from '../components/Modal';
import Select from '../components/Select';
import SearchInput from '../components/SearchInput';
import Toast from '../components/Toast';

class Group extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      reports: [],
      showConfirmDeletionPanel: false,
      objectToDelete: {},
      showEditPanel: false,
      searchValue: '',
      id: null,
      name: '',
      groupReportId: '',
      groupReports: []
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
      groupReportId: '',
      groupReports: []
    };
  }

  componentDidMount() {
    this.fetchGroups();
    this.fetchReports();
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

  fetchReports = () => {
    axios.get('/ws/report')
      .then(res => {
        const reports = res.data;
        this.setState({ 
          reports: reports 
        });
      });
  }

  openEditPanel = (group) => {
    this.clearEditPanel();
    if (group !== null) {
      axios.get('/ws/group/' + group.id)
        .then(res => {
          const result = res.data;
          this.setState({
            id: result.id,
            name: result.name,
            groupReports: result.groupReports
          });
        });
    }
    
    this.setState({
      groupReportId: '',
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
      groupReports
    } = this.state;

    let group = {
      name: name,
      groupReports: groupReports
    };

    if (!name) {
      Toast.showError('Enter a name.');
      return;
    }

    if (id !== null) {
      group.id = id;
      axios.put('/ws/group', group)
        .then(res => {
          this.clearEditPanel();
          this.fetchGroups();
          this.closeEditPanel();
        })
        .catch(error => {
          Toast.showError('The name exists. Try another.');
        });
    } else {
      axios.post('/ws/group', group)
        .then(res => {
          this.clearEditPanel();
          this.fetchGroups();
          this.closeEditPanel();
        })
        .catch(error => {
          Toast.showError('The name exists. Try another.');
        });
    } 
  }

  addGroupReport= () => {
    const { 
      groupReportId,
      groupReports = []
    } = this.state;

    if (groupReportId) {
      const index = groupReports.findIndex(reportId => reportId === groupReportId);
      if (index === -1) {
        const newGroupReports = [...groupReports];
        newGroupReports.push(groupReportId);
        this.setState({
          groupReports: newGroupReports
        });
      }
    }
  }

  removeGroupReport = (reportId) => {
    const { 
      groupReports = [] 
    } = this.state;
    const index = groupReports.findIndex(id => id === reportId);
    if (index !== -1) {
      const newGroupReports = [...groupReports];
      newGroupReports.splice(index, 1);
      this.setState({
        groupReports: newGroupReports
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
    const { t } = this.props;

    const { 
      id,
      groups = [],
      reports = [],
      groupReports = [],
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
            <div key={i} className="card float-left">
              <div className="card-header ellipsis">
                {name}
              </div>
              <div className="card-content"></div>
              <div className="card-footer row">
                <div className="float-right">
                  <button className="icon-button card-icon-button" onClick={() => this.openEditPanel(group)}>
                    <FontAwesomeIcon icon="edit" size="lg" />
                  </button>
                  <button className="icon-button card-icon-button" onClick={() => this.openConfirmDeletionPanel(group)}>
                    <FontAwesomeIcon icon="trash-alt" size="lg" />
                  </button>
                </div>
              </div>
            </div>
          )
        )
      }
    }

    const groupReportItems = [];
    for (let i = 0; i < groupReports.length; i++) {
      const reportId = groupReports[i];
      for (let j = 0; j < reports.length; j++) {
        if (reportId === reports[j].id) {
          groupReportItems.push(
            (
              <div key={reportId} className="row table-row">
                <div className="float-left ellipsis" style={{width: '180px'}}>{reports[j].name}</div>
                <button className="button table-row-button float-right button-red" onClick={() => this.removeGroupReport(reportId)}>
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
            <FontAwesomeIcon icon="plus" /> {t('New')}
          </button>
        </div>
        <div className="row mt-10">
          {groupItems}
        </div>

        <Modal 
          show={this.state.showEditPanel}
          onClose={this.closeEditPanel}
          modalClass={'mid-modal-panel'} 
          title={t(mode)} >
          <div className="row">
            <div className="form-panel float-left" style={{width: '240px'}}>
              <label>{t('Name')} <span className="required">*</span></label>
              <input 
                className="form-input"
                type="text" 
                name="name" 
                value={this.state.name}
                onChange={this.handleInputChange} />
            </div>
            
            <div className="form-panel float-right" style={{width: '240px'}}>
              <label>{t('Reports')}</label>
              <Select
                name={'groupReportId'}
                value={this.state.groupReportId}
                onChange={this.handleIntegerOptionChange}
                options={reports}
                optionDisplay={'name'}
                optionValue={'id'}
              />
              <button className="button" onClick={this.addGroupReport}>{t('Add')}</button>
              <div style={{marginTop: '8px'}}>
                {groupReportItems}
              </div>
            </div>
          </div>
          <button className="button mt-3 button-green" onClick={this.save}>
            <FontAwesomeIcon icon="save" size="lg" fixedWidth /> {t('Save')}
          </button>
        </Modal>

        <Modal 
          show={showConfirmDeletionPanel}
          onClose={this.closeConfirmDeletionPanel}
          modalClass={'small-modal-panel'}
          title={t('Confirm Deletion')} >
          <div className="confirm-deletion-panel">
            {t('Are you sure you want to delete')} {objectToDelete.name}?
          </div>
          <button className="button button-red full-width" onClick={this.confirmDelete}>{t('Delete')}</button>
        </Modal>
        
      </div>
    )
  }
}

export default (withTranslation()(Group));