
import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { default as ReactSelect } from 'react-select';
import { withTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as ReactSelectHelper from './Studio/ReactSelectHelper';

import * as ApiService from '../api/ApiService';
import Modal from '../components/Modal/Modal';

class CreateTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showEditPanel: false,
      selectedJdbcDataSource: null,
      jdbcDataSourcesForSelect: [],
      create_table: '',
      encrypted_columns: '',
    };
  }

  async componentDidMount() { 
    const { data: jdbcDataSources = [] } = await ApiService.fetchJdbcdatasources();
    const jdbcDataSourcesForSelect = jdbcDataSources.map((val) => {
      return {
        label: val.name,
        value: val.id
      }
    });

    this.setState({
      jdbcDataSourcesForSelect
    });

  }

  get initialState() {
    return {
      create_table: '',
      encrypted_columns: '',
    };
  }

  handleJdbcDataSourceChange = (selectedOption) => {
    this.setState({ 
      selectedJdbcDataSource: selectedOption
    });
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  openEditPanel = (ds) => {
    this.clearEditPanel();
    if (ds !== null) {
      this.setState({
        create_table: ds.create_table,
        encrypted_columns: ds.encrypted_columns,
      });
    }
    
    this.setState({
      showEditPanel: true
    }); 
  }

  save = () => {
    const {
      create_table,
      encrypted_columns,
      selectedJdbcDataSource,
    } = this.state;

    if (!selectedJdbcDataSource) {
      toast.error('Choose data source.');
      return;
    }

    if (!create_table) {
      toast.error('Enter a create table sql.');
      return;
    }

    let ds = {
      encrypted_columns: encrypted_columns,
      create_table: create_table,
      selectedJdbcDataSource: selectedJdbcDataSource,
    };

    axios.post('http://localhost:8888/js_query', ds)
    .then(res => {
        this.closeEditPanel();
    })
    .catch(error => {
        toast.error('The name exists. Try another.');
    });
    
  }

  closeEditPanel = () => {
    this.setState({
      showEditPanel: false
    });
  }

  clearEditPanel = () => {
    this.setState(this.initialState);
  }
  
  render() {
    const { t } = this.props;

    const {
      jdbcDataSourcesForSelect = [],
    } = this.state;
    
    return (
      <div className="full-page-content">

        <div class="row">               
          <button className="button float-left" style={{marginRight: '5px'}} onClick={() => this.openEditPanel(null)}>
            <FontAwesomeIcon icon="plus" /> {t('New')}
          </button>
        </div>
        <Modal 
          show={this.state.showEditPanel}
          onClose={this.closeEditPanel}
          modalClass={'small-modal-panel'}
          title={t('New')} >

          <div className="form-panel">
          <label>{t('Data Source')} <span className="required">*</span></label>
            <ReactSelect
                placeholder={'Select Data Source...'}
                value={this.state.selectedJdbcDataSource}
                onChange={this.handleJdbcDataSourceChange}
                options={jdbcDataSourcesForSelect}
                styles={ReactSelectHelper.CUSTOM_STYLE}
            />
            <label>{t('Create Table')} <span className="required">*</span></label>
            <textarea
              className="form-input"
              rows="10"
              cols="40"
              type="text"
              name="create_table" 
              placeholder="eg: create table test(id varchar(20), name varchar(20), number int)"
              value={this.state.create_table}
              onChange={this.handleInputChange} >
                
            </textarea>

            <label>{t('Encrypted Columns')}</label>
            <textarea
              className="form-input"
              rows="6"
              cols="40"
              type="text"
              name="encrypted_columns" 
              placeholder='{
                "id": {
                    "fuzzy": True,
                    "arithmetic": False,
                },
                "name": {
                    "fuzzy": False,
                    "arithmetic": False
                },
                "number": {
                    "fuzzy": True,
                    "arithmetic": False
                }
            }'
              value={this.state.encrypted_columns}
              onChange={this.handleInputChange} >
            </textarea>
            <button className="button mt-3 button-green" onClick={this.save}>
              <FontAwesomeIcon icon="save"  fixedWidth /> {t('Save')}
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default (withTranslation()(CreateTable));

