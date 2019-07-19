
import React from 'react';
import axios from 'axios';
import AceEditor from 'react-ace';
import 'brace/mode/mysql';
import 'brace/mode/html';
import 'brace/theme/xcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';

import './ComponentEditPanel.css';

import * as Util from '../api/Util';
import * as Constants from '../api/Constants';

import Tabs from '../components/Tabs';
import Select from '../components/Select';
import Table from '../components/Table';
import ColorPicker from '../components/ColorPicker';
import SelectButtons from '../components/SelectButtons';
import InputRange from '../components/filters/InputRange';
import SearchInput from '../components/SearchInput';
import Checkbox from '../components/Checkbox';

const TABLE_DEFAULT_PAGE_SIZES = [5, 10, 20, 25, 50, 100];

class ComponentEditPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      activeTab: '',
      jdbcDataSources: [],
      componentId: null,
      title: '',
      sqlQuery: '',
      jdbcDataSourceId: '',
      queryResult: {},
      type: Constants.STATIC,
      subType: Constants.TEXT,
      style: this.initialStyle,
      data: {},
      queryParameter: '',
      drillThrough: [],
      drillReports: [],
      drillColumnName: '',
      drillReportId: '',
      chartOption: {},
      showSchema: false,
      schemas: [],
      searchSchemaName: ''
    };
  }

  get initialStyle() {
    return {
      showBorder: false,
      borderColor: Constants.COLOR_SLATE,
      showTitle: true,
      titleFontColor: Constants.COLOR_SLATE,
      titleBackgroundColor: Constants.COLOR_WHITE,
      contentBackgroundColor: Constants.COLOR_WHITE,
      zIndex: 1
    }
  }

  componentDidMount() {
  }

  onTabChange = (activeTab) => {
    this.setState({
      activeTab: activeTab
    });
  }

  fetchComponent = async (componentId) => {
    this.setState(this.initialState);
    axios.get('/ws/jdbcdatasource')
      .then(res => {
        const jdbcDataSources = res.data;
        this.setState({ 
          jdbcDataSources: jdbcDataSources 
        });
      });

    axios.get('/ws/report')
      .then(res => {
        const reports = res.data;
        this.setState({ 
          drillReports: reports 
        });
      });

    if (componentId === null) {
      this.setState({
        componentId: null
      })
    } else {
      this.setState({
        componentId: componentId
      })
      axios.get('/ws/component/' + componentId)
        .then(res => {
          const component = res.data;
          const {
            type,
            subType,
            drillThrough
          } = component;
          if (type === Constants.CHART) {
            this.setState({
              drillThrough: drillThrough
            });
          } else if (type === Constants.FILTER) {
            const {
              queryParameter
            } = component.data;
            this.setState({
              queryParameter: queryParameter
            });
            if (subType === Constants.SLICER) {

            } else if (subType === Constants.SINGLE_VALUE) {

            }
          }
          
          this.setState({
            componentId: componentId,
            title: component.title,
            x: component.x,
            y: component.y,
            width: component.width,
            height: component.height,
            sqlQuery: component.sqlQuery,
            type: type,
            subType: subType,
            jdbcDataSourceId: component.jdbcDataSourceId,
            style: component.style,
            data: component.data
          }, () => {
            this.runQuery();
          });

        });
    }
  }

  onStyleValueChange = (name, value) => {
    const style = {...this.state.style};
    style[[name]] = value;
    this.setState({
      style: style
    });
  }

  handleAceEditorChange = (newValue) => {
    this.setState({
      sqlQuery: newValue
    });
  }

  handleInnerHtmlChange = (newValue) => {
    const data = {...this.state.data};
    data.innerHtml = newValue;
    this.setState({
      data: data
    });
  }

  handleIntegerChange = (name, value) => {
    const intValue = (parseInt(value, 10) || 0);
    this.setState({ 
      [name]: intValue
    });
  }

  handleInputChange = (name, value, isNumber = false) => {
    let v = isNumber ? (parseInt(value, 10) || 0) : value;
    this.setState({
      [name]: v
    });
  }

  handleOptionChange = (name, value) => {
    if (name === 'type') {
      this.setState({
        activeTab: '',
        subType: ''
      });
    }

    this.setState({
      [name]: value
    });
  }

  handleComponentDataChange = (name, value) => {
    const data = {...this.state.data};
    data[[name]] = value;
    this.setState({
      data: data
    });
  }

  save = () => {
    const {
      componentId,
      title,
      jdbcDataSourceId,
      sqlQuery,
      type,
      subType,
      style,
      data
    } = this.state;

    const component = {
      title: title,
      reportId: this.props.reportId,
      type: type,
      subType: subType,
      jdbcDataSourceId: jdbcDataSourceId,
      sqlQuery: sqlQuery,
      style: style,
      data: data
    }

    if (type === Constants.CHART) {
      const {
        drillThrough
      } = this.state;
      component.drillThrough = drillThrough;
    } else if (type === Constants.FILTER) {
      const  {
        queryParameter
      } = this.state;
      component.data = {
        queryParameter: queryParameter
      }
    }
    

    if (componentId === null) {
      component.style = this.initialStyle;
      component.x = 0;
      component.y = 0;
      component.width = 200;
      component.height = 200;

      axios.post('/ws/component', component)
        .then(res => {
          const componentId = res.data;
          this.props.onSave(componentId);
        });
    } else {
      component.id = componentId;
      axios.put('/ws/component/data', component)
        .then(res => {
          this.props.onSave(componentId);
        });
    }
  }

  runQuery = () => {
    const queryRequest ={
      jdbcDataSourceId: this.state.jdbcDataSourceId,
      sqlQuery: this.state.sqlQuery
    };

    axios.post('/ws/jdbcquery/query', queryRequest)
      .then(res => {
        const result = res.data;
        this.setState({
          queryResult: result
        });
      });
  }

  toggleSchemaPanel = () => {
    this.setState(prevState => ({
      showSchema: !prevState.showSchema
    }), () => {
      if (this.state.showSchema) {
        const { jdbcDataSourceId } = this.state;
        axios.get(`/ws/jdbcdatasource/schema/${jdbcDataSourceId}`)
          .then(res => {
            const schemas = res.data;
            this.setState({
              schemas: schemas
            });
          });
      }
    });
  }

  toggleSchemaColumns = (name) => {
    const { schemas = [] } = this.state;
    const index = schemas.findIndex(s => s.name === name);
    if (index !== -1) {
      const newSchemas = [...schemas];
      const { showColumns = false } = newSchemas[index];
      newSchemas[index].showColumns = !showColumns;
      this.setState({
        schemas: newSchemas
      });
    }
  }

  addDrillThrough = () => {
    const { 
      drillThrough,
      drillColumnName,
      drillReportId
    } = this.state;
    const index = drillThrough.findIndex(d => d.columnName === drillColumnName);
    if (index === -1) {
      const newDrillThrough = [...drillThrough];
      newDrillThrough.push({
        columnName: drillColumnName,
        reportId: drillReportId
      });
      this.setState({
        drillThrough: newDrillThrough
      });
    } 
  }

  removeDrillThrough = (drill) => {
    const { drillThrough } = this.state;
    const index = drillThrough.findIndex(d => (d.columnName === drill.columnName) && (d.reportId === drill.reportId));
    if (index !== -1) {
      const newDrillThrough = [...drillThrough];
      newDrillThrough.splice(index, 1);
      this.setState({
        drillThrough: newDrillThrough
      });
    } 
  }

  renderChartConfigPanel = () => {
    const { t } = this.props;
    const { 
      subType,
      queryResult = {},
      data = {}
    } = this.state;
    const columns = queryResult.columns || [];

    const { 
      colorPlatte = 'default' 
    } = data;
    const colorPlattePanel = (
      <div>
        <label>{t('Color Platte')}</label>
        <Select
          name={'colorPlatte'}
          value={colorPlatte}
          onChange={this.handleComponentDataChange}
          options={Constants.CHART_COLOR_PLATETTES}
        />
      </div>
    );

    const {
      xAxis,
      legend,
      yAxis,
      hasMultiSeries = false,
    } = data;
    const seriesChartPanel = (
      <div>
        <label>{t('X-Axis')}</label>
        <Select
          name={'xAxis'}
          value={xAxis}
          onChange={this.handleComponentDataChange}
          options={columns}
          optionDisplay={'name'}
          optionValue={'name'}
        />

        <label>{t('Y-Axis')}</label>
        <Select
          name={'yAxis'}
          value={yAxis}
          onChange={this.handleComponentDataChange}
          options={columns}
          optionDisplay={'name'}
          optionValue={'name'}
        />

        <label>{t('Has multi-series')}</label>
        <div style={{marginBottom: '8px'}}>
          <Checkbox name="hasMultiSeries" value="" checked={hasMultiSeries} onChange={this.handleComponentDataChange} />
        </div>

        {hasMultiSeries && (
          <div>
            <label>{t('Legend')}</label>
            <Select
              name={'legend'}
              value={legend}
              onChange={this.handleComponentDataChange}
              options={columns}
              optionDisplay={'name'}
              optionValue={'name'}
            />
          </div>
        )}
      </div>
    );

    let chartConfigPanel;
    if (subType === Constants.TABLE) {
      const {
        defaultPageSize = 10,
        showPagination = true
      } = data;
      chartConfigPanel = (
        <div>
          <label>{t('Show Pagination')}</label>
          <div style={{marginBottom: '8px'}}>
            <Checkbox name="showPagination" value="" checked={showPagination} onChange={this.handleComponentDataChange} />
          </div>

          {showPagination && (
            <div>
              <label>{t('Default Page Size')}</label>
              <Select
                name={'defaultPageSize'}
                value={defaultPageSize}
                onChange={this.handleComponentDataChange}
                options={TABLE_DEFAULT_PAGE_SIZES}
              />
            </div>
          )}
          
        </div>
      );
    } else if (subType === Constants.PIE || subType === Constants.TREEMAP) {
      const {
        key,
        value
      } = data;

      chartConfigPanel = (
        <div>
          <label>{t('Key')} <span style={{color: '#8993A4', fontSize: '15px'}}>Text</span></label>
          <Select
            name={'key'}
            value={key}
            onChange={this.handleComponentDataChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />

          <label>{t('Value')} <span style={{color: '#8993A4', fontSize: '15px'}}>Number</span></label>
          <Select
            name={'value'}
            value={value}
            onChange={this.handleComponentDataChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />

          {colorPlattePanel}
        </div>
      );
    } else if (subType === Constants.LINE || subType === Constants.AREA) {
      const {
        isSmooth = false,
        showAllAxisLabels = false
      } = data;

      chartConfigPanel = (
        <div>
          {seriesChartPanel}

          <label>{t('Is Smooth')}</label>
          <div style={{marginBottom: '8px'}}>
            <Checkbox name="isSmooth" value="" checked={isSmooth} onChange={this.handleComponentDataChange} />
          </div>

          <label>{t('Show All Axis Labels')}</label>
          <div style={{marginBottom: '8px'}}>
            <Checkbox name="showAllAxisLabels" value="" checked={showAllAxisLabels} onChange={this.handleComponentDataChange} />
          </div>

          {colorPlattePanel}
        </div>
      );
    } else if (subType === Constants.BAR) {
      const {
        hasMultiSeries = false,
        isStacked = true,
        isHorizontal = false,
        showAllAxisLabels = false
      } = data;

      chartConfigPanel = (
        <div>
          {seriesChartPanel}

          {hasMultiSeries && (
            <div>
              <label>{t('Is Stacked')}</label>
              <div style={{marginBottom: '8px'}}>
                <Checkbox name="isStacked" value="" checked={isStacked} onChange={this.handleComponentDataChange} />
              </div>
            </div>
          )}

          <label>{t('Is Horizontal')}</label>
          <div style={{marginBottom: '8px'}}>
            <Checkbox name="isHorizontal" value="" checked={isHorizontal} onChange={this.handleComponentDataChange} />
          </div>

          <label>{t('Show all axis labels')}</label>
          <div style={{marginBottom: '8px'}}>
            <Checkbox name="showAllAxisLabels" value="" checked={showAllAxisLabels} onChange={this.handleComponentDataChange} />
          </div>

          {colorPlattePanel}
        </div>
      );
    } else if (subType === Constants.FUNNEL) {
      const {
        key,
        value,
        sort = 'descending'
      } = data;

      const SORT_OPTIONS = ['ascending', 'descending'];

      chartConfigPanel = (
        <div>
          <label>{t('Key')} <span style={{color: '#8993A4', fontSize: '15px'}}>Text</span></label>
          <Select
            name={'key'}
            value={key}
            onChange={this.handleComponentDataChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />

          <label>{t('Value')} <span style={{color: '#8993A4', fontSize: '15px'}}>Number</span></label>
          <Select
            name={'value'}
            value={value}
            onChange={this.handleComponentDataChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />

          <label>{t('Sort')}</label>
          <Select
            name={'sort'}
            value={sort}
            onChange={this.handleComponentDataChange}
            options={SORT_OPTIONS}
          />

          {colorPlattePanel}
        </div>
      );
    } else if (subType === Constants.HEATMAP) {
      const {
        xAxis,
        yAxis,
        series,
        minColor = Constants.DEFAULT_MIN_COLOR,
        maxColor = Constants.DEFAULT_MAX_COLOR,
        showAllAxisLabels = false
      } = data;

      chartConfigPanel = (
        <div>
          <label>{t('X-Axis')}</label>
          <Select
            name={'xAxis'}
            value={xAxis}
            onChange={this.handleComponentDataChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />

          <label>{t('Y-Axis')}</label>
          <Select
            name={'yAxis'}
            value={yAxis}
            onChange={this.handleComponentDataChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />

          <label>{t('Value')}</label>
          <Select
            name={'series'}
            value={series}
            onChange={this.handleComponentDataChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />

          <label>{t('Min Value Color')}</label>
          <ColorPicker name={'minColor'} value={minColor} onChange={this.handleComponentDataChange} />

          <label>{t('Max Value Color')}</label>
          <ColorPicker name={'maxColor'} value={maxColor} onChange={this.handleComponentDataChange} />

          <label>{t('Show all axis labels')}</label>
          <div style={{marginBottom: '8px'}}>
            <Checkbox name="showAllAxisLabels" value="" checked={showAllAxisLabels} onChange={this.handleComponentDataChange} />
          </div>
        </div>
      );
      
    } else if (subType === Constants.CARD) {
      const { 
        fontSize = 16,
        fontColor = 'rgba(9, 30, 66, 1)',
      } = data;
      chartConfigPanel = (
        <div className="form-panel">
          <label>{t('Font Size')}</label>
          <div style={{marginTop: '3px'}}>
            <InputRange
              name="fontSize" 
              value={fontSize}
              onChange={this.handleComponentDataChange} 
              min={1}
              max={100}
              step={1}
            />
          </div>
          <label>{t('Font Color')}</label>
          <ColorPicker name={'fontColor'} value={fontColor} onChange={this.handleComponentDataChange} />
        </div>
      );
    } else {
      chartConfigPanel = (<div></div>);
    }

    return chartConfigPanel;
  }

  renderStaticConfigPanel = () => {
    const { t } = this.props;
    const { 
      subType,
      data = {}
    } = this.state;

    let staticConfigPanel = (<div></div>);
    if (subType === Constants.IMAGE) {
      const {
        src,
        isFull = false
      } = data;
      staticConfigPanel = (
        <div className="form-panel">
          <label>{t('Source')}</label>
          <input 
            className="form-input"
            type="text"
            value={src}
            onChange={(event) => this.handleComponentDataChange('src', event.target.value)} 
          />

          <label>{t('Is Full Size')}</label>
          <div style={{marginBottom: '8px'}}>
            <Checkbox name="isFull" value="" checked={isFull} onChange={this.handleComponentDataChange} />
          </div>
        </div>
      );
    } else if (subType === Constants.TEXT) {
      const { 
        fontSize = 16,
        fontColor = 'rgba(9, 30, 66, 1)',
        value
      } = data;
      staticConfigPanel = (
        <div className="form-panel">
          <label>{t('Value')}</label>
          <input 
            className="form-input"
            type="text"
            value={value}
            onChange={(event) => this.handleComponentDataChange('value', event.target.value)} 
          />
          <label>{t('Font Size')}</label>
          <div style={{marginTop: '3px'}}>
            <InputRange
              name="fontSize" 
              value={fontSize}
              onChange={this.handleComponentDataChange} 
              min={1}
              max={100}
              step={1}
            />
          </div>
          <label>{t('Font Color')}</label>
          <ColorPicker name={'fontColor'} value={fontColor} onChange={this.handleComponentDataChange} />
        </div>
      );
    } else if (subType === Constants.HTML) {
      const {
        innerHtml
      } = data;
      staticConfigPanel = (
        <div className="form-panel">
          <label>{t('Inner Html')}</label>
          <AceEditor
            value={innerHtml}
            mode="html"
            theme="xcode"
            name="innerHtml"
            onChange={this.handleInnerHtmlChange}
            height={'300px'}
            width={'100%'}
            fontSize={15}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2
          }}/>
      </div>
      );
      
      
    } else if (subType === Constants.IFRAME) {
      const {
        title,
        src
      } = data;
      staticConfigPanel = (
        <div className="form-panel">
          <label>{t('Title')}</label>
          <input 
            className="form-input"
            type="text"
            value={title}
            onChange={(event) => this.handleComponentDataChange('title', event.target.value)} 
          />
          <label>{t('Source')}</label>
          <input 
            className="form-input"
            type="text"
            value={src}
            onChange={(event) => this.handleComponentDataChange('src', event.target.value)} 
          />
        </div>
      );
    }
    return staticConfigPanel;
  }

  render() {
    const { t } = this.props;

    const { 
      type,
      subType,
      queryResult,
      jdbcDataSources = [],
      drillThrough = [],
      drillReports = [],
      showSchema,
      schemas = [],
      searchSchemaName
    } = this.state;

    const data = Util.jsonToArray(queryResult.data);
    const { 
      columns = [],
      error
    } = queryResult;

    // Render the drill through list.
    const drillItems = [];
    for (let i = 0; i < drillThrough.length; i++) {
      const drill = drillThrough[i];
      for (let j = 0; j < drillReports.length; j++) {
        if (drill.reportId === drillReports[j].id) {
          const reportName = drillReports[j].name;
          drillItems.push(
            <div key={drill.columnName} className="row table-row">
              <div className="float-left ellipsis" style={{width: '680px'}}>
                <div className="tag-label">{t('Column')}</div> <span style={{marginRight: '10px'}}>{drill.columnName}</span>
                <FontAwesomeIcon icon="long-arrow-alt-right" size="lg" fixedWidth />
                <div className="tag-label" style={{marginLeft: '10px', backgroundColor: '#36B37E'}}>{t('Report')}</div> {reportName}
              </div>
              <button className="button table-row-button float-right button-red" onClick={() => this.removeDrillThrough(drill)}>
                <FontAwesomeIcon icon="trash-alt" />
              </button>
            </div>
          );
          break;
        }
      }
    }

    // Render the column list.
    const columnItems = columns.map(column =>
      <div className="row schema-column-row" key={column.name}>
        <div className="float-left schema-column-name">{column.name}</div>
        <div className="float-right schema-column-type">{column.dbType}({column.length})</div> 
      </div>
    );

    const showQueryTab = type === Constants.CHART 
      || (type === Constants.FILTER && subType === Constants.SLICER);

    // Render the sub types.
    let subTypes = [];
    if (type === Constants.STATIC) {
      subTypes = Constants.STATIC_TYPES;
    } else if (type === Constants.CHART) {
      subTypes = Constants.CHART_TYPES;
    } else if (type === Constants.FILTER) {
      subTypes = Constants.FILTER_TYPES;
    }


    // Render the schema.
    const schemaItems = [];
    for (let i = 0; i < schemas.length; i++) {
      const table = schemas[i];
      const { 
        name,
        type,
        columns = [],
        showColumns = false
      } = table;
      if (!searchSchemaName || (searchSchemaName && name.includes(searchSchemaName))) {
        const columnItems = [];
        for (let j = 0; j < columns.length; j++) {
          const column = columns[j];
          columnItems.push(
            <div className="row schema-column-row">
              <div className="float-left schema-column-name">{column.name}</div>
              <div className="float-right schema-column-type">{column.dbType}({column.length})</div> 
            </div>
          );
        }
        schemaItems.push(
          <div>
            <div className="row schema-table-title" onClick={() => this.toggleSchemaColumns(name)}>
              <div className="float-left">{name}</div>
              <div className="float-right">{type}</div>
            </div>
            { showColumns && (
              <div>
                {columnItems}
              </div>
            )}
          </div>
        );
      }
    }

    const queryTitle = showSchema ? 'Schema' : 'SQL Query'; 
    const schemaButtonValue = showSchema ? 'Edit Query' : 'Show Schema';

    const componentTypes = Constants.COMPONENT_TYPES.map(component => {
      return {
        display: t(component),
        value: component
      }
    });

    return (
      <div>
        <button className="button button-green" onClick={this.save}>
          <FontAwesomeIcon icon="save" size="lg" fixedWidth /> {t('Save')}
        </button>
        <div className="row mt-10">
          <label className="float-left inline-text-label bold" style={{width: '100px'}}>{t('Type')}: </label>
          <div className="float-left">
            <SelectButtons
              name={'type'}
              value={type}
              onChange={this.handleOptionChange}
              selections={componentTypes}
            />
          </div>
        </div>

        <div className="row mt-10">
          <label className="float-left inline-text-label bold" style={{width: '100px'}}>{t('Sub Type')}: </label>
          <div className="float-left" style={{width: '310px'}}>
            <Select
              name={'subType'}
              value={subType}
              options={subTypes}
              onChange={this.handleOptionChange}
            />
          </div>
        </div>
        
        <div className="mt-10">
          <Tabs 
            activeTab={this.state.activeTab}
            onTabChange={this.onTabChange}>

            {/* ---------- Query Tab ---------- */}

            { showQueryTab && (
              <div title={t('Query')}>
                <div className="form-panel" style={{paddingTop: '10px'}}>
                  <label>{t('DataSource')}:</label>
                  <Select
                    name={'jdbcDataSourceId'}
                    value={this.state.jdbcDataSourceId}
                    onChange={this.handleIntegerChange}
                    options={jdbcDataSources}
                    optionDisplay={'name'}
                    optionValue={'id'}
                  />

                  { this.state.jdbcDataSourceId !== '' && (
                    <React.Fragment>
                      <div className="row">
                        <label className="float-left inline-text-label" style={{width: '200px'}}>
                          {t(queryTitle)}
                        </label>
                        <div className="float-right">
                          {!showSchema && (
                            <button className="button" style={{marginRight: '5px'}} onClick={this.runQuery}>{t('Run Query')}</button>
                          )}
                          <button className="button" onClick={this.toggleSchemaPanel}>
                            {t(schemaButtonValue)}
                          </button>
                        </div>
                      </div>

                      <React.Fragment>
                        {showSchema ? (
                          <div className="schema-panel">
                            <div>
                              <SearchInput 
                                name={'searchSchemaName'} 
                                value={searchSchemaName} 
                                onChange={this.handleInputChange} 
                                inputWidth={200}
                              />
                            </div>
                            <div style={{marginTop: '5px'}}>
                              {schemaItems}
                            </div>
                          </div>
                        ): (
                          <div>
                            <AceEditor
                              value={this.state.sqlQuery}
                              mode="mysql"
                              theme="xcode"
                              name="sqlQuery"
                              onChange={this.handleAceEditorChange}
                              height={'300px'}
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

                            <label style={{marginTop: '10px'}}>{t('Result')}</label>
                            { error ? (
                                <div>
                                  {error}
                                </div>
                              ) : (
                                <Table
                                  data={data}
                                  defaultPageSize={10}
                                  columns={columns}
                                />
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    </React.Fragment>
                  )}

                </div>

              </div>
            )}

            {/* ---------- Config Tab ---------- */}

            <div title={t('Config')}>
              <div className="form-panel" style={{paddingTop: '10px'}}>
                { type === Constants.STATIC && (
                  <div>
                    {this.renderStaticConfigPanel()} 
                  </div>
                )}

                { type === Constants.FILTER && (
                  <div>
                    <label>Parameter</label>
                    <input 
                      className="form-input"
                      type="text" 
                      name="queryParameter" 
                      value={this.state.queryParameter}
                      onChange={(event) => this.handleInputChange('queryParameter', event.target.value)} 
                    />
                  </div>
                )}

                { type === Constants.CHART && (
                  <div className="row">
                    <div className="float-left" style={{width: '300px'}}>
                      <label>{t('Columns')}</label>
                      <div style={{backgroundColor: '#FFFFFF'}}>
                        {columnItems}
                      </div>
                    </div>
                    <div className="float-right" style={{width: '480px'}}>
                      {this.renderChartConfigPanel()} 
                    </div>
                  </div>
                )}
              </div>
            </div>


            {/* ---------- Drill Through Tab ---------- */}
            
            { type === Constants.CHART && (
              <div title={t('Drill Through')}>
                <div className="form-panel" style={{paddingTop: '10px'}}>
                  <div>
                    <label>{t('Column')}</label>
                    <Select
                      name={'drillColumnName'}
                      value={this.state.drillColumnName}
                      options={columns}
                      onChange={this.handleOptionChange}
                      optionDisplay={'name'}
                      optionValue={'name'}
                    />

                    <label>{t('Report')}</label>
                    <Select
                      name={'drillReportId'}
                      value={this.state.drillReportId}
                      options={drillReports}
                      onChange={this.handleIntegerChange}
                      optionDisplay={'name'}
                      optionValue={'id'}
                    />
                    <button className="button" onClick={this.addDrillThrough}>{t('Add')}</button>
                  </div>
                  <div style={{marginTop: '8px'}}>
                    {drillItems}
                  </div>
                </div>
              </div>
            )}

          </Tabs>
        </div>
      </div>
    )
  };
}

export default (withTranslation('', { withRef: true })(ComponentEditPanel));