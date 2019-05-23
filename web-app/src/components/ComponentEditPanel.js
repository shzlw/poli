
import React from 'react';
import axios from 'axios';
import AceEditor from 'react-ace';
import 'brace/mode/mysql';
import 'brace/theme/xcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './ComponentEditPanel.css';

import * as Util from '../api/Util';
import * as Constants from '../api/Constants';

import Checkbox from './Checkbox';
import Tabs from './Tabs';
import Select from './Select';
import Table from './Table';
import ColorPicker from './ColorPicker';
import SelectButtons from './SelectButtons';
import InputRange from './filters/InputRange';

const TABLE_DEFAULT_PAGE_SIZES = [5, 10, 20, 25, 50, 100];

class ComponentEditPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      jdbcDataSources: [],
      componentId: null,
      title: '',
      sqlQuery: '',
      jdbcDataSourceId: '',
      queryResult: {},
      type: Constants.STATIC,
      subType: '',
      style: this.initialStyle,
      data: {},
      queryParameter: '',
      drillThrough: [],
      drillReports: [],
      drillColumnName: '',
      drillReportId: '',
      chartOption: {}
    };
  }

  get initialStyle() {
    return {
      showBorder: false,
      borderColor: 'rgba(9, 30, 66, 1)',
      showTitle: true,
      titleFontColor: 'rgba(9, 30, 66, 1)',
      titleBackgroundColor: 'rgba(244, 245, 247, 1)',
      contentBackgroundColor: 'rgba(244, 245, 247, 1)',
      zIndex: 50
    }
  }

  componentDidMount() {
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

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
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

  handleIntegerOptionChange = (name, value) => {
    const intValue = parseInt(value, 10) || 0;
    this.setState({ 
      [name]: intValue
    });
  }

  handleOptionChange = (name, value) => {
    if (name === 'type') {
      this.setState({
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
      component.width = 200 * 100;
      component.height = 200;

      axios.post('/ws/component', component)
        .then(res => {
          const componentId = res.data;
          this.props.onSave(componentId);
        });
    } else {
      component.id = componentId;
      axios.put('/ws/component', component)
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
    const { 
      subType,
      queryResult = {},
      data = {}
    } = this.state;
    const columns = queryResult.columns || [];

    let chartConfigPanel;
    if (subType === Constants.TABLE) {
      const {
        defaultPageSize = 10
      } = data;
      chartConfigPanel = (
        <div>
          <label>Default Page Size</label>
          <Select
            name={'defaultPageSize'}
            value={defaultPageSize}
            onChange={this.handleComponentDataChange}
            options={TABLE_DEFAULT_PAGE_SIZES}
          />
        </div>
      );
    } else if (subType === Constants.PIE
      || subType === Constants.LINE
      || subType === Constants.BAR
      || subType === Constants.AREA) {
      const {
        key,
        value
      } = data;

      chartConfigPanel = (
        <div>
          <label>Key (Text)</label>
          <Select
            name={'key'}
            value={key}
            onChange={this.handleComponentDataChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />

          <label>Value (Number)</label>
          <Select
            name={'value'}
            value={value}
            onChange={this.handleComponentDataChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />
        </div>
      );
    } else {
      chartConfigPanel = (<div></div>);
    }

    return chartConfigPanel;
  }

  renderStaticConfigPanel = () => {
    const { 
      subType,
      data = {}
    } = this.state;

    let staticConfigPanel = (<div></div>);
    if (subType === Constants.IMAGE) {
      const {
        src
      } = data;
      staticConfigPanel = (
        <div className="form-panel">
          <label>Source</label>
          <input 
            type="text"
            value={src}
            onChange={(event) => this.handleComponentDataChange('src', event.target.value)} 
          />
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
          <label>Value</label>
          <input 
            type="text"
            value={value}
            onChange={(event) => this.handleComponentDataChange('value', event.target.value)} 
          />
          <label>Font Size</label>
          <div style={{marginTop: '3px'}}>
            <InputRange
              name="fontSize" 
              value={fontSize}
              onChange={this.handleComponentDataChange} 
              min={1}
              max={50}
              step={1}
            />
          </div>
          <label>Font Color</label>
          <ColorPicker name={'fontColor'} value={fontColor} onChange={this.handleComponentDataChange} />
        </div>
      );
    } else if (subType === Constants.HTML) {
      const {
        innerHtml
      } = data;
    } else if (subType === Constants.IFRAME) {
      const {
        title,
        src
      } = data;
      staticConfigPanel = (
        <div className="form-panel">
          <label>Title</label>
          <input 
            type="text"
            value={title}
            onChange={(event) => this.handleComponentDataChange('title', event.target.value)} 
          />
          <label>Source</label>
          <input 
            type="text"
            value={src}
            onChange={(event) => this.handleComponentDataChange('src', event.target.value)} 
          />
        </div>
      );
    }
    return staticConfigPanel
  }

  render() {
    const { 
      type,
      subType,
      queryResult,
      jdbcDataSources = [],
      drillThrough = [],
      drillReports = []
    } = this.state;

    const data = Util.jsonToArray(queryResult.data);
    const columns = queryResult.columns || [];
    const error = queryResult.error;

    const drillItems = [];
    for (let i = 0; i < drillThrough.length; i++) {
      const drill = drillThrough[i];
      for (let j = 0; j < drillReports.length; j++) {
        if (drill.reportId === drillReports[j].id) {
          const reportName = drillReports[j].name;
          drillItems.push(
            <div key={drill.columnName} className="row table-row">
              <div className="float-left ellipsis" style={{width: '380px'}}>Column: {drill.columnName} goes to Report: {reportName}</div>
              <button className="button table-row-button float-right"onClick={() => this.removeDrillThrough(drill)}>
                <FontAwesomeIcon icon="trash-alt" />
              </button>
            </div>
          );
          break;
        }
      }
    }

    const columnItems = columns.map(col =>
      <div className="table-row row" key={col.name}>
        <div className="float-left">{col.name}</div>
        <div className="float-right">{col.dataType}</div>
      </div>
    );

    const showQueryTab = type === Constants.CHART 
      || (type === Constants.FILTER && subType === Constants.SLICER);

    return (
      <div>
        <button className="button button-green" style={{width: '80px'}} onClick={this.save}>Save</button>
        <div className="mt-10">
          <SelectButtons
            name={'type'}
            value={type}
            onChange={this.handleOptionChange}
            selections={Constants.COMPONENT_TYPES}
          />
        </div>
        
        <div className="mt-10">
          <Tabs activeTab="Basic">
            <div title="Basic">
              <div className="form-panel">
                <div>
                  <label>Title</label>
                  <Checkbox name="showTitle" value="Show" checked={this.state.style.showTitle} onChange={this.onStyleValueChange} />
                  { this.state.style.showTitle && (
                    <div style={{marginTop: '5px'}}>
                      <input 
                        type="text" 
                        name="title" 
                        value={this.state.title}
                        onChange={this.handleInputChange} 
                      />

                      <div>
                        <label>Font Color</label>
                        <ColorPicker name={'titleFontColor'} value={this.state.style.titleFontColor} onChange={this.onStyleValueChange} />
                      </div>

                      <div style={{marginTop: '8px'}}>
                        <label>Background Color</label>
                        <ColorPicker name={'titleBackgroundColor'} value={this.state.style.titleBackgroundColor} onChange={this.onStyleValueChange} />
                      </div>
                    </div>
                  )}
                </div>

                <hr/>
               
                <div style={{marginTop: '8px'}}>
                  <label>Border</label>
                  <Checkbox name="showBorder" value="Show" checked={this.state.style.showBorder} onChange={this.onStyleValueChange} />
                  { this.state.style.showBorder && (
                    <div style={{marginTop: '5px'}}>
                      <label>Color</label>
                      <ColorPicker name={'borderColor'} value={this.state.style.borderColor} onChange={this.onStyleValueChange} />
                    </div>
                  )}
                </div>

                <hr/>

                <div style={{marginTop: '8px'}}>
                  <label>Content Background Color</label>
                  <div style={{marginTop: '5px'}}>
                    <ColorPicker name={'contentBackgroundColor'} value={this.state.style.contentBackgroundColor} onChange={this.onStyleValueChange} />
                  </div>
                </div>

                <hr/>
                <div style={{marginTop: '8px'}}>
                  <label>Z Index</label>
                  <div style={{marginTop: '3px'}}>
                    <InputRange
                      name="zIndex" 
                      value={this.state.style.zIndex}
                      onChange={this.onStyleValueChange} 
                      min={1}
                      max={50}
                      step={1}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ---------- Static Tab ---------- */}

            { type === Constants.STATIC && (
              <div title="Static">
                <div className="form-panel">
                  <label>Type</label>
                  <Select
                    name={'subType'}
                    value={subType}
                    onChange={this.handleOptionChange}
                    options={Constants.STATIC_TYPES}
                  />
                </div>
                {this.renderStaticConfigPanel()} 
              </div>
            )}

            {/* ---------- Filter Tab ---------- */}

            { type === Constants.FILTER && (  
              <div title="Filter">
                <div className="form-panel">
                  <label>Type</label>
                  <Select
                    name={'subType'}
                    value={subType}
                    onChange={this.handleOptionChange}
                    options={Constants.FILTER_TYPES}
                  />
                </div>
              </div>
            )}

            {/* ---------- Query Tab ---------- */}

            { showQueryTab && (
              <div title="Query">
                <div className="form-panel">
                  <label>DataSource</label>
                  <Select
                    name={'jdbcDataSourceId'}
                    value={this.state.jdbcDataSourceId}
                    onChange={this.handleIntegerOptionChange}
                    options={jdbcDataSources}
                    optionDisplay={'name'}
                    optionValue={'id'}
                    />
                
                  <label>SQL Query</label>
                  <AceEditor
                    value={this.state.sqlQuery}
                    mode="mysql"
                    theme="xcode"
                    name="blah2"
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

                  <div style={{margin: '5px 0px 8px 0px'}}>
                    <button className="button" onClick={this.runQuery}>Run Query</button>
                  </div>

                  <label>Result</label>
                  <Table
                    data={data}
                    defaultPageSize={10}
                    columns={columns}
                    error={error}
                  />

                  <label style={{marginTop: '8px'}}>Columns Mapping</label>
                  <div>
                    {columnItems}
                  </div>
                </div>
              </div>
            )}

            {/* ---------- Chart Config Tab ---------- */}

            { type === Constants.CHART && (
              <div title="Chart">
                <div className="form-panel">
                  <label>Type</label>
                  <Select
                    name={'subType'}
                    value={subType}
                    onChange={this.handleOptionChange}
                    options={Constants.CHART_TYPES}
                  />
                  {this.renderChartConfigPanel()} 
                </div>
              </div>
            )}

            {/* ---------- Drill Through Tab ---------- */}
            
            { type === Constants.CHART && (
              <div title="Drill Through">
                <div className="form-panel">
                  <label>Column</label>
                  <Select
                    name={'drillColumnName'}
                    value={this.state.drillColumnName}
                    options={columns}
                    onChange={this.handleOptionChange}
                    optionDisplay={'name'}
                    optionValue={'name'}
                  />

                  <label>Report</label>
                  <Select
                    name={'drillReportId'}
                    value={this.state.drillReportId}
                    options={drillReports}
                    onChange={this.handleIntegerOptionChange}
                    optionDisplay={'name'}
                    optionValue={'id'}
                  />
                  <button className="button" onClick={this.addDrillThrough}>Add</button>
                  <div style={{marginTop: '8px'}}>
                    {drillItems}
                  </div>
                </div>
              </div>
            )}

            { type === Constants.FILTER && (
              <div title="Query parameter">
                <div className="form-panel">
                  <label>Parameter</label>
                  <input 
                    type="text" 
                    name="queryParameter" 
                    value={this.state.queryParameter}
                    onChange={this.handleInputChange} 
                  />
                </div>
              </div>
            )}

          </Tabs>
        </div>
      </div>
    )
  };
}

export default ComponentEditPanel;