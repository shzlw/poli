
import React from 'react';
import { withTranslation } from 'react-i18next';
import AceEditor from 'react-ace';
import { default as ReactSelect } from 'react-select';
import { toast } from 'react-toastify';
import 'brace/mode/mysql';
import 'brace/mode/html';
import 'brace/theme/xcode';

import * as ApiService from '../../api/ApiService';
import * as Util from '../../api/Util';
import * as ReactSelectHelper from './ReactSelectHelper';

import Tabs from '../../components/Tabs/Tabs';
import Table from '../../components/table/Table';
import SearchInput from '../../components/SearchInput/SearchInput';
import Checkbox from '../../components/Checkbox/Checkbox';
import ScrollTabPanel from './ScrollTabPanel';
import SchemaPanel from './SchemaPanel';

import './Studio.css';

class Studio extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeSidebarTab: 'Query',
      // jdbcDataSource
      selectedJdbcDataSource: null,
      jdbcDataSourcesForSelect: [],
      // Query
      sqlQuery: '',
      resultLimit: 100,
      queryResult: [],
      isRunning: false,
      elapsed: 0,
      // Save queries
      seachQueryName: '',
      queryTabList: []
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

  onTabChange = (activeTab) => {
    this.setState({
      activeSidebarTab: activeTab
    });
  }

  newQueryTab = () => {

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
      isRunning: true
    });
    const { data: queryResult = []} = await ApiService.runQuery(jdbcDataSourceId, sqlQuery, resultLimit);
    const millis = Date.now() - start;
    const elapsed = (millis / 1000).toFixed(2);
    this.setState({
      queryResult,
      elapsed,
      isRunning: false
    });
  }

  onTabClick = (tab) => {

  }

  onRemoveTab = (tab) => {

  }

  onAddTab = () => {
    /*
    const {
      queryTabList
    } = this.state;
    const queryTabListClone = [...queryTabList];
    const id = Math.random();
    queryTabListClone.push({
      id: 'id' + index,
      label: 'New Tab',
      seletect: true
    });
    const newIndex = index + 1;
    this.setState({
      tabs: newTabs,
      index: newIndex
    }, () => {
      const $container = document.getElementById('studio-tab-droppable-container');
      $container.scrollLeft += $container.offsetWidth;
    });
    */
  }

  render() {
    const { t } = this.props;

    const {
      jdbcDataSourcesForSelect = [],
      queryResult = [],
      elapsed = 0,
      selectedJdbcDataSource = {},
      queryTabList = []
    } = this.state;

    const tabs = queryTabList.map((val) => {
      return {
        id: val.id,
        label: val.value
      };
    });

    const data = Util.jsonToArray(queryResult.data);
    const { 
      columns = [],
      error
    } = queryResult;

    const runQueryButtonText = this.state.isRunning ? 'Running...' : 'Run';

    return (
      <div className="studio-container">
        <div className="studio-sidebar">
          <div>
            <Tabs 
              activeTab={this.state.activeSidebarTab}
              onTabChange={this.onTabChange}
              >
              <div title={t('Query')}>
                <div style={{margin: '8px 0px'}}>
                  <SearchInput 
                    name={'searchValue'} 
                    value={this.state.searchValue} 
                    onChange={this.handleInputChange} 
                  />
                </div>
                <div>
                  Saved data tables
                  <div>
                    name, http?
                  </div>
                </div>
              </div>

              <div title={t('Schema')}>
                { selectedJdbcDataSource ? (
                  <div>
                    <SchemaPanel 
                      jdbcDataSourceId={selectedJdbcDataSource.value} 
                    />
                  </div>
                ): (
                  <div>
                    Select a data source.
                  </div>
                )}
              </div>

              </Tabs>
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
          </div>
          <div>
            <ScrollTabPanel tabs={tabs} />
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
                style={{width: '100px', margin: '0px 8px 0px 4px'}} 
                onClick={this.runQuery}>{t(runQueryButtonText)}</button>
              <div className="form-text">
                { elapsed !== 0 && (
                  <React.Fragment>{elapsed}s</React.Fragment>
                )}
              </div>
            </div>
            <div>
              <button className="button" onClick={this.confirmDelete}>{t('Csv')}</button>
              <button className="button" onClick={this.confirmDelete}>{t('Save')}</button>
              <button className="button" onClick={this.confirmDelete}>{t('Delete')}</button>
            </div>
          </div>

          <div className="studio-result-container">
            <Table
              data={data}
              defaultPageSize={10}
              columns={columns}
              errorMsg={error}
            />
          </div>
        </div>
      </div>
    )
  };
}

export default (withTranslation()(Studio));