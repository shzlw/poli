
import React from 'react';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AceEditor from 'react-ace';
import { default as ReactSelect } from 'react-select';
import { toast } from 'react-toastify';
import 'brace/mode/mysql';
import 'brace/mode/html';
import 'brace/theme/xcode';

import * as ApiService from '../../api/ApiService';
import * as Util from '../../api/Util';
import * as ReactSelectHelper from './ReactSelectHelper';

import Table from '../../components/table/Table';
import SearchInput from '../../components/SearchInput/SearchInput';
import Modal from '../../components/Modal/Modal';
import SchemaPanel from './SchemaPanel';

import './Studio.css';

class Studio extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // Modal
      showSchemaPanel: false,
      showConfirmDeletionPanel: false,
      // jdbcDataSource
      selectedJdbcDataSource: null,
      jdbcDataSourcesForSelect: [],
      // Saved query
      savedQueryList: [],
      // Form
      id: 0,
      name: '',
      sqlQuery: '',
      endpointName: '',
      endpointAccessCode: '',
      // Run query
      resultLimit: 100,
      queryResultData: [],
      queryResultColumns: [],
      queryResultError: null,
      isRunning: false,
      elapsed: 0,
      // Search
      savedQuerySearchValue: ''
    }
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

    this.fetchSavedQueries();
  }

  fetchSavedQueries = async () => {
    const { data: savedQueryList = [] } = await ApiService.httpGet('/ws/saved-queries');
    this.setState({
      savedQueryList
    });
  }

  fetchSavedQuery = async (queryId) => {
    const { data: savedQuery = {} } = await ApiService.httpGet(`/ws/saved-queries/${queryId}`);

    // Data source id to select object.
    const jdbcDataSourceId = savedQuery.jdbcDataSourceId;
    const { jdbcDataSourcesForSelect = [] } = this.state;
    const index = jdbcDataSourcesForSelect.findIndex(obj => obj.value === jdbcDataSourceId);
    if (index !== -1) {
      this.setState({
        selectedJdbcDataSource: {
          label: jdbcDataSourcesForSelect[index].label,
          value: jdbcDataSourcesForSelect[index].value
        }
      });
    }

    this.setState({
      id: savedQuery.id,
      name: savedQuery.name || '',
      sqlQuery: savedQuery.sqlQuery || '',
      endpointName: savedQuery.endpointName || '',
      endpointAccessCode: savedQuery.endpointAccessCode || '',
    });
  }

  handleJdbcDataSourceChange = (selectedOption) => {
    this.setState({ 
      selectedJdbcDataSource: selectedOption
    });
  };

  handleInputChange = (name, value, isNumber = false) => {
    let v = isNumber ? (parseInt(value, 10) || 0) : value;
    this.setState({
      [name]: v
    });
  }

  handleAceEditorChange = (newValue) => {
    this.setState({
      sqlQuery: newValue
    });
  }

  onSelectSavedQuery = (id) => {
    this.setState({
      queryResultData: [],
      queryResultColumns: [],
      queryResultError: null,
      id: 0,
      name: '',
      sqlQuery: '',
      endpointName: '',
      endpointAccessCode: '',
      selectedJdbcDataSource: {}
    }, async () => {
      await this.fetchSavedQuery(id);
    });
  }

  newQuery = () => {
    this.setState({
      id: 0,
      name: '',
      sqlQuery: '',
      endpointName: '',
      endpointAccessCode: '',
      selectedJdbcDataSource: {}
    });
  }

  saveQuery = async () => {
    const {
      id,
      name,
      sqlQuery,
      endpointName,
      endpointAccessCode,
      selectedJdbcDataSource = {}
    } = this.state;

    if (!name) {
      toast.error('Enter a name');
    }

    const jdbcDataSourceId = selectedJdbcDataSource ? parseInt(selectedJdbcDataSource.value, 10): 0;
    const body = {
      id,
      name,
      sqlQuery,
      endpointName,
      endpointAccessCode,
      jdbcDataSourceId
    };

    if (id === 0) {
      const { data: id = 0 } = await ApiService.httpPost('/ws/saved-queries', body);
      await this.fetchSavedQueries();
      if (id !== 0) {
        toast.success('Success');
      }
      this.setState({
        id: id
      });
    } else {
      await ApiService.httpPut('/ws/saved-queries', body);
      toast.success('Success');
    }
  }

  runQuery = async () => {
    const {
      selectedJdbcDataSource = {},
      sqlQuery,
      resultLimit,
      isRunning = false
    } = this.state;

    if (!selectedJdbcDataSource) {
      toast.error('Select a data source.');
      return;
    }

    if (!sqlQuery) {
      toast.error('SQL query cannot be empty.');
      return;
    }

    if (isRunning) {
      toast.error('The query is running.');
      return;
    }

    const { value: jdbcDataSourceId } = selectedJdbcDataSource;
    const start = Date.now();
    this.setState({
      elapsed: 0,
      isRunning: true,
      queryResultData: [],
      queryResultColumns: [],
      queryResultError: null
    });
    const { data: queryResult = []} = await ApiService.runQuery(jdbcDataSourceId, sqlQuery, resultLimit);
    const data = Util.jsonToArray(queryResult.data);
    const { 
      columns = [],
      error
    } = queryResult;
    const millis = Date.now() - start;
    const elapsed = (millis / 1000).toFixed(2);
    this.setState({
      queryResultData: data,
      queryResultColumns: columns,
      queryResultError: error,
      elapsed,
      isRunning: false
    });
  }

  toggleSchema = () => {
    this.setState(prevState => ({
      showSchemaPanel: !prevState.showSchemaPanel
    })); 
  }

  confirmDelete = async () => {
    const { id } = this.state;
    await ApiService.httpDelete(`/ws/saved-queries/${id}`);
    await this.fetchSavedQueries();
    this.closeConfirmDeletionPanel();
  }

  openConfirmDeletionPanel = () => {
    this.setState({
      showConfirmDeletionPanel: true
    });
  }

  closeConfirmDeletionPanel = () => {
    this.setState({
      showConfirmDeletionPanel: false
    });
  }

  openApiWindow = async () => {
    const {
      endpointName,
      endpointAccessCode
    } = this.state;

    // If the query is not saved, it will show 404.

    const { location } = window;
    const host = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    let url = host + `/api/v1/saved-queries?name=${endpointName}`;
    if (endpointAccessCode) {
      url += `&accessCode=${endpointAccessCode}`;
    }

    if (endpointName) {
      window.open(url, '_blank');
    }
  }

  render() {
    const { t } = this.props;

    const {
      jdbcDataSourcesForSelect = [],
      elapsed = 0,
      selectedJdbcDataSource = {},
      savedQueryList = [],
      savedQuerySearchValue = '',
      id: activeQueryId,
    } = this.state;

    const runQueryButtonText = this.state.isRunning ? 'Running...' : 'Run';

    const savedQueryListItems = [];
    for (let i = 0; i < savedQueryList.length; i++) {
      const { 
        id,
        name,
        endpointName
      } = savedQueryList[i];
      const menuActive = activeQueryId === id ? 'studio-query-menu-item-active' : '';
      if (!savedQuerySearchValue || (savedQuerySearchValue && name.includes(savedQuerySearchValue))) {
        savedQueryListItems.push(
          <div key={id} className={`row studio-query-menu-item ${menuActive}`} onClick={() => this.onSelectSavedQuery(id)}>
            <div className="float-left ellipsis" style={{maxWidth: '140px'}}>{name}</div>
            <div className="float-right">
              { endpointName && (
                <span>API</span>
              )}
            </div>
          </div>
        );
      }
    }

    const schemaJdbcDataSourceId = selectedJdbcDataSource ? selectedJdbcDataSource.value : null;

    return (
      <div className="studio-container">
        <div className="studio-menu-sidebar">
          <div style={{margin: '8px 5px 5px 5px'}}>
            <button className="button full-width" onClick={this.newQuery}>
              <FontAwesomeIcon icon="plus" /> {t('New')}
            </button>
          </div>
          <div style={{margin: '8px 5px 5px 5px'}}>
            <SearchInput 
              name={'savedQuerySearchValue'} 
              value={this.state.savedQuerySearchValue} 
              onChange={this.handleInputChange} 
            />
          </div>
          <div style={{margin: '8px 5px 5px 5px'}}>
            {savedQueryListItems}
          </div>
        </div>

        <div className="studio-property-sidebar">
          <div className="studio-property-panel">
            <div className="form-panel">
              <label>{t('Query Name')}</label>
              <input 
                className="form-input"
                type="text" 
                name="name" 
                value={this.state.name}
                onChange={(event) => this.handleInputChange('name', event.target.value)} 
              />
            </div>
          </div>
          
          <div className="studio-property-panel">
            <div className="form-panel">
              <label>{t('Endpoint Name')}</label>
              <input 
                className="form-input"
                type="text" 
                name="endpointName" 
                value={this.state.endpointName}
                onChange={(event) => this.handleInputChange('endpointName', event.target.value)} 
              />

              <label>{t('Access Code')}</label>
              <input 
                className="form-input"
                type="text" 
                name="endpointAccessCode" 
                value={this.state.endpointAccessCode}
                onChange={(event) => this.handleInputChange('endpointAccessCode', event.target.value)} 
              />

              { this.state.endpointName && (
                <div className="row" style={{paddingBottom: '8px'}}>
                  <button className="button float-right" onClick={this.openApiWindow}>{t('API')}</button>
                </div>
              )}
            </div>
          </div>
          
          <div className="row" style={{padding: '8px'}}>
            <div className="float-right">
              <button className="button" onClick={this.saveQuery}>{t('Save')}</button>
              { this.state.id !== 0 && (
                <button className="button" style={{marginLeft: '5px'}} onClick={this.openConfirmDeletionPanel}>{t('Delete')}</button>
              )}
            </div>
          </div>
        </div>

        <div className="studio-body">
          <div className="studio-datasource-container">
            <div className="studio-datasource-select">
              <ReactSelect
                placeholder={'Select Data Source...'}
                value={this.state.selectedJdbcDataSource}
                onChange={this.handleJdbcDataSourceChange}
                options={jdbcDataSourcesForSelect}
                styles={ReactSelectHelper.CUSTOM_STYLE}
              />
            </div>
            { schemaJdbcDataSourceId && (
              <button className="button" style={{marginLeft: '5px'}} onClick={this.toggleSchema}>{t('Schema')}</button>
            )}
          </div>
          
          <div className="studio-editor-container">
            <AceEditor
              value={this.state.sqlQuery}
              mode="mysql"
              theme="xcode"
              name="sqlQuery"
              onChange={this.handleAceEditorChange}
              height="inherit"
              width={'100%'}
              fontSize={15}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                showLineNumbers: true,
                tabSize: 2
              }}
            />
          </div>

          <div className="studio-result-control-container">
            <div className="display-flex">
              <div className="form-text">
                Limit:
              </div>
              <input 
                type="text"
                name="resultLimit"
                value={this.state.resultLimit} 
                onChange={(event) => this.handleInputChange('resultLimit', event.target.value, true)} 
                className="form-input"
                style={{width: '60px', marginLeft: '4px'}}
              />
              <button className="button button-blue" 
                style={{width: '90px', margin: '0px 8px 0px 4px'}} 
                onClick={this.runQuery}>{t(runQueryButtonText)}</button>
              <div className="form-text">
                { elapsed !== 0 && (
                  <React.Fragment>{elapsed}s</React.Fragment>
                )}
              </div>
            </div>
          </div>

          <div className="studio-result-container">
            <Table
              data={this.state.queryResultData}
              defaultPageSize={10}
              columns={this.state.queryResultColumns}
              errorMsg={this.state.queryResultError}
            />
          </div>
        </div>

        <Modal 
          show={this.state.showConfirmDeletionPanel}
          onClose={this.closeConfirmDeletionPanel}
          modalClass={'small-modal-panel'}
          title={t('Confirm Deletion')} >
          <div className="confirm-deletion-panel">
            {t('Are you sure you want to delete')} {this.state.name}?
          </div>
          <button className="button button-red full-width" onClick={this.confirmDelete}>{t('Delete')}</button>
        </Modal>

        { this.state.showSchemaPanel && (
          <SchemaPanel 
            jdbcDataSourceId={schemaJdbcDataSourceId}
            onClose={() => { this.setState({ showSchemaPanel: false })}}
          />
        )}

      </div>
    )
  };
}

export default (withTranslation()(Studio));