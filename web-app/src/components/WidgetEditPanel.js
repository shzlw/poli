
import React from 'react';
import axios from 'axios';
import AceEditor from 'react-ace';
import 'brace/mode/mysql';
import 'brace/theme/xcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './WidgetEditPanel.css';

import * as webApi from '../api/WebApi';
import * as Util from '../api/Util';
import * as EchartsApi from '../api/EchartsApi';
import * as Constants from '../api/Constants';

import Checkbox from './Checkbox';
import Tabs from './Tabs';
import Select from './Select';
import TableWidget from './TableWidget';
import ColorPicker from './ColorPicker';
import SelectButtons from './SelectButtons';
import InputRange from './filters/InputRange';

const TABLE_DEFAULT_PAGE_SIZES = [5, 10, 20, 25, 50, 100];

class WidgetEditPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      jdbcDataSources: [],
      widgetId: null,
      title: '',
      sqlQuery: '',
      jdbcDataSourceId: '',
      queryResult: {},
      type: Constants.STATIC,
      subType: '',
      style: {
        showBorder: false,
        borderColor: 'rgba(9, 30, 66, 1)',
        showTitle: true,
        titleFontColor: 'rgba(9, 30, 66, 1)',
        titleBackgroundColor: 'rgba(255, 255, 255, 1)',
        contentBackgroundColor: 'rgba(255, 255, 255, 1)',
        zIndex: 50
      },
      data: {},
      queryParameter: '',
      drillThrough: [],
      drillDashboards: [],
      drillColumnName: '',
      drillDashboardId: '',
      chartOption: {}
    };
  }

  componentDidMount() {
  }

  fetchWidget = async (widgetId) => {
    this.setState(this.initialState);

    const jdbcDataSources = await webApi.fetchDataSources();
    this.setState({ 
      jdbcDataSources: jdbcDataSources 
    });

    axios.get('/ws/dashboard')
      .then(res => {
        const dashboards = res.data;
        this.setState({ 
          drillDashboards: dashboards 
        });
      });

    if (widgetId === null) {
      this.setState({
        widgetId: null
      })
    } else {
      this.setState({
        widgetId: widgetId
      })
      axios.get('/ws/widget/' + widgetId)
        .then(res => {
          const widget = res.data;
          const {
            type,
            subType,
            drillThrough
          } = widget;
          if (type === Constants.CHART) {
            this.setState({
              drillThrough: drillThrough
            });
          } else if (type === Constants.FILTER) {
            const {
              queryParameter
            } = widget.data;
            this.setState({
              queryParameter: queryParameter
            });
            if (subType === Constants.SLICER) {

            } else if (subType === Constants.SINGLE_VALUE) {

            }
          }
          
          this.setState({
            widgetId: widgetId,
            title: widget.title,
            x: widget.x,
            y: widget.y,
            width: widget.width,
            height: widget.height,
            sqlQuery: widget.sqlQuery,
            type: type,
            subType: subType,
            jdbcDataSourceId: widget.jdbcDataSourceId,
            style: widget.style,
            data: widget.data
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

  handleWidgetDataChange = (name, value) => {
    const data = {...this.state.data};
    data[[name]] = value;
    this.setState({
      data: data
    });
  }


  save = () => {
    const {
      widgetId,
      title,
      jdbcDataSourceId,
      sqlQuery,
      type,
      subType,
      style,
      data
    } = this.state;

    const widget = {
      title: title,
      dashboardId: this.props.dashboardId,
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
      widget.drillThrough = drillThrough;
    } else if (type === Constants.FILTER) {
      const  {
        queryParameter
      } = this.state;
      widget.data = {
        queryParameter: queryParameter
      }
    }
    

    if (widgetId === null) {
      widget.style = {
        showBorder: false,
        borderColor: 'rgba(9, 30, 66, 1)',
        showTitle: true,
        titleFontColor: 'rgba(9, 30, 66, 1)',
        titleBackgroundColor: 'rgba(255, 255, 255, 1)',
        contentBackgroundColor: 'rgba(255, 255, 255, 1)',
        zIndex: 50
      }

      widget.x = 0;
      widget.y = 0;
      widget.width = 200 * 100;
      widget.height = 200;

      axios.post('/ws/widget', widget)
        .then(res => {
          const widgetId = res.data;
          this.props.onSave(widgetId);
        });
    } else {
      widget.id = widgetId;
      axios.put('/ws/widget', widget)
        .then(res => {
          this.props.onSave(widgetId);
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
      drillDashboardId
    } = this.state;
    const index = drillThrough.findIndex(d => d.columnName === drillColumnName);
    if (index === -1) {
      const newDrillThrough = [...drillThrough];
      newDrillThrough.push({
        columnName: drillColumnName,
        dashboardId: drillDashboardId
      });
      this.setState({
        drillThrough: newDrillThrough
      });
    } 
  }

  removeDrillThrough = (drill) => {
    const { drillThrough } = this.state;
    const index = drillThrough.findIndex(d => (d.columnName === drill.columnName) && (d.dashboardId === drill.dashboardId));
    if (index !== -1) {
      const newDrillThrough = [...drillThrough];
      newDrillThrough.splice(index, 1);
      this.setState({
        drillThrough: newDrillThrough
      });
    } 
  }

  /*
  generateChart = () => {
    const { 
      data = {},
      queryResult = {},
      chartType
    } = this.state;
    const queryResultData = Util.jsonToArray(queryResult.data);
    const chartOption = EchartsApi.getChartOption(chartType, queryResultData, data);
    this.setState({
      chartOption: chartOption
    });
  }

  /*
  renderChartPreview = () => {
    const { 
      chartType,
      queryResult = {},
      chartOption,
      data = {}
    } = this.state;
    const columns = queryResult.columns || [];

    let chartPreview = (<div>NOT SUPPORTED</div>);
    if (chartType === Constants.TABLE) {

    } else if (chartType === Constants.PIE) {
      const {
        key,
        value
      } = data;
            
      chartPreview = (
        <div>
          <label>Key (Text)</label>
          <Select
            name={'key'}
            value={key}
            onChange={this.handleWidgetDataChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />

          <label>Value (Number)</label>
          <Select
            name={'value'}
            value={value}
            onChange={this.handleWidgetDataChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />
          <div>For example, number of "Value" by "Key"</div>
          <button className="button" onClick={this.generateChart}>Generete Chart</button>
          <ReactEcharts 
            option={chartOption} 
            style={{height: '350px', width: '100%'}}  
            className='react_for_echarts' />
        </div>
      );
    }
    return chartPreview;
  }
  */

  renderChartConfigPanel = () => {
    const { 
      subType,
      queryResult = {},
      data = {}
    } = this.state;
    const columns = queryResult.columns || [];

    let chartConfigPanel;
    if (chartConfigPanel === '') {
      chartConfigPanel = (<div></div>);
    } else if (subType === Constants.TABLE) {
      const {
        defaultPageSize = 10
      } = data;
      chartConfigPanel = (
        <div>
          <label>Default Page Size</label>
          <Select
            name={'defaultPageSize'}
            value={defaultPageSize}
            onChange={this.handleWidgetDataChange}
            options={TABLE_DEFAULT_PAGE_SIZES}
          />
        </div>
      );
    } else {
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
            onChange={this.handleWidgetDataChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />

          <label>Value (Number)</label>
          <Select
            name={'value'}
            value={value}
            onChange={this.handleWidgetDataChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />
        </div>
      );
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
        <div>
          <label>Source</label>
          <input 
            type="text"
            value={src}
            onChange={(event) => this.handleWidgetDataChange('source', event.target.value)} 
          />
        </div>
      );
    } else if (subType === Constants.TEXT) {
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
        <div>
          <label>Title</label>
          <input 
            type="text"
            value={title}
            onChange={(event) => this.handleWidgetDataChange('title', event.target.value)} 
          />
          <label>Source</label>
          <input 
            type="text"
            value={src}
            onChange={(event) => this.handleWidgetDataChange('source', event.target.value)} 
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
      drillDashboards = []
    } = this.state;

    const data = Util.jsonToArray(queryResult.data);
    const columns = queryResult.columns || [];
    const error = queryResult.error;

    const drillItems = [];
    for (let i = 0; i < drillThrough.length; i++) {
      const drill = drillThrough[i];
      for (let j = 0; j < drillDashboards.length; j++) {
        if (drill.dashboardId === drillDashboards[j].id) {
          const dashboardName = drillDashboards[j].name;
          drillItems.push(
            <div key={drill.columnName} className="row table-row">
              <div className="float-left ellipsis" style={{width: '380px'}}>Column: {drill.columnName} goes to Dashboard: {dashboardName}</div>
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
            selections={Constants.WIDGET_TYPES}
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
                        <label className="small-label">Font Color</label>
                        <ColorPicker name={'titleFontColor'} value={this.state.style.titleFontColor} onChange={this.onStyleValueChange} />
                      </div>

                      <div style={{marginTop: '8px'}}>
                        <label className="small-label">Background Color</label>
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
                      <label className="small-label">Color</label>
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
                  <TableWidget
                    data={data}
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

                  <label>Dashboard</label>
                  <Select
                    name={'drillDashboardId'}
                    value={this.state.drillDashboardId}
                    options={drillDashboards}
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

export default WidgetEditPanel;