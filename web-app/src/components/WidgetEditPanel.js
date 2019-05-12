
import React from 'react';
import axios from 'axios';
import AceEditor from 'react-ace';
import 'brace/mode/mysql';
import 'brace/theme/xcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactEcharts from 'echarts-for-react';

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
      type: Constants.CHART,
      filterType: Constants.SINGLE_VALUE,
      chartType: Constants.TABLE,
      style: {
        showBorder: false,
        borderColor: 'rgba(9, 30, 66, 1)',
        showTitle: true,
        titleFontColor: 'rgba(9, 30, 66, 1)',
        titleBackgroundColor: 'rgba(255, 255, 255, 1)',
        contentBackgroundColor: 'rgba(255, 255, 255, 1)',
        zIndex: 50
      },
      queryParameter: '',
      drillThrough: [],
      drillDashboards: [],
      drillColumnName: '',
      drillDashboardId: '',
      pieKey: '',
      pieValue: '',
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
            chartType,
            filterType,
            drillThrough
          } = widget;
          if (type === Constants.CHART) {
            this.setState({
              chartType: chartType,
              drillThrough: drillThrough
            });

            if (chartType === Constants.PIE) {
              const {
                pieKey,
                pieValue
              } = widget.data;
              this.setState({
                pieKey: pieKey,
                pieValue: pieValue
              });
            }
          } else if (type === Constants.FILTER) {
            const {
              queryParameter
            } = widget.data;
            this.setState({
              filterType: filterType,
              queryParameter: queryParameter
            });
            if (filterType === Constants.SLICER) {

            } else if (filterType === Constants.SINGLE_VALUE) {

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
            jdbcDataSourceId: widget.jdbcDataSourceId,
            style: widget.style
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
    this.setState({
      [name]: value
    });
  }


  save = () => {
    const {
      widgetId,
      title,
      jdbcDataSourceId,
      sqlQuery,
      type,
      style
    } = this.state;

    const widget = {
      title: title,
      dashboardId: this.props.dashboardId,
      type: type,
      jdbcDataSourceId: jdbcDataSourceId,
      sqlQuery: sqlQuery,
      style: style
    }

    if (type === Constants.CHART) {
      const {
        chartType,
        drillThrough
      } = this.state;
      widget.drillThrough = drillThrough;
      widget.chartType = chartType;

      if (chartType === Constants.TABLE) {

      } else if (chartType === Constants.PIE) {
        const {
          pieKey,
          pieValue
        } = this.state;
        widget.data = {
          pieKey: pieKey,
          pieValue: pieValue
        }
      }
    } else if (type === Constants.FILTER) {
      const  {
        filterType,
        queryParameter
      } = this.state;
      widget.filterType = filterType;
      widget.data = {
        queryParameter: queryParameter
      }
      if (filterType === Constants.SLICER) {

      } else if (filterType === Constants.SINGLE_VALUE) {

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

  generateChart = () => {
    if (this.state.chartType === Constants.PIE) {
      const { 
        pieKey, 
        pieValue, 
        queryResult = {}
      } = this.state;
      const data = Util.jsonToArray(queryResult.data);
      const chartOption = EchartsApi.getPieOption(data, pieKey, pieValue);
      this.setState({
        chartOption: chartOption
      });
    }
  }

  renderChartPreview = () => {
    const { 
      chartType,
      queryResult = {},
    } = this.state;
    const columns = queryResult.columns || [];

    let chartPreview = (<div>NOT SUPPORTED</div>);
    if (chartType === Constants.TABLE) {

    } else if (chartType === Constants.PIE) {
      const { 
        chartOption,
        pieKey,
        pieValue
      } = this.state;

      chartPreview = (
        <div>
          <div>For example, count "value" by "key"</div>
          <label>Key (text)</label>
          <Select
            name={'pieKey'}
            value={pieKey}
            onChange={this.handleOptionChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />

          <label>Value (number)</label>
          <Select
            name={'pieValue'}
            value={pieValue}
            onChange={this.handleOptionChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />
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

  render() {
    const { 
      type,
      queryResult,
      jdbcDataSources = [],
      drillThrough = [],
      drillDashboards = []
    } = this.state;

    const data = Util.jsonToArray(queryResult.data);
    const columns = queryResult.columns || [];
    const error = queryResult.error;

    const drillItems = drillThrough.map(drill =>
      <div key={drill.columnName} className="row table-row">
        <div className="float-left ellipsis">Column: {drill.columnName}, Dashboard: {drill.dashboardId}</div>
        <button className="button table-row-button float-right"onClick={() => this.removeDrillThrough(drill)}>
          <FontAwesomeIcon icon="trash-alt" />
        </button>
      </div>
    );

    const columnItems = columns.map(col =>
      <div className="table-row row" key={col.name}>
        <div className="float-left">{col.name}</div>
        <div className="float-right">{col.dataType}</div>
      </div>
    );

    const showQueryTab = type === Constants.CHART || (type === Constants.FILTER && this.state.filterType === Constants.SLICER);

    return (
      <div>
        <button className="button" style={{width: '80px'}} onClick={this.save}>Save</button>
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
                <label>Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={this.state.title}
                  onChange={this.handleInputChange} 
                />
                <hr/>

                <label>Z Index</label>
                <input 
                  type="number" 
                  name="zIndex" 
                  value={this.state.style.zIndex}
                  onChange={(event) => this.onStyleValueChange('zIndex', event.target.value)} 
                />
                <InputRange
                  name="zIndex" 
                  value={this.state.style.zIndex}
                  onChange={this.onStyleValueChange} 
                  min={1}
                  max={50}
                  step={1}
                />
                <hr/>

                <Checkbox name="showBorder" value="Show border" checked={this.state.style.showBorder} onChange={this.onStyleValueChange} />
                { this.state.style.showBorder && (
                  <div>
                    <label>Border Color</label>
                    <ColorPicker name={'borderColor'} value={this.state.style.borderColor} onChange={this.onStyleValueChange} />
                  </div>
                )}
                <hr/>

                <Checkbox name="showTitle" value="Show title" checked={this.state.style.showTitle} onChange={this.onStyleValueChange} />
                { this.state.style.showTitle && (
                  <React.Fragment>
                    <div>
                      <label>Title Font Color</label>
                      <ColorPicker name={'titleFontColor'} value={this.state.style.titleFontColor} onChange={this.onStyleValueChange} />
                    </div>

                    <div>
                      <label>Title Background Color</label>
                      <ColorPicker name={'titleBackgroundColor'} value={this.state.style.titleBackgroundColor} onChange={this.onStyleValueChange} />
                    </div>
                  </React.Fragment>
                )}
                <hr/>

                <div>
                  <label>Content Background Color</label>
                  <ColorPicker name={'contentBackgroundColor'} value={this.state.style.contentBackgroundColor} onChange={this.onStyleValueChange} />
                </div>

                
              </div>
            </div>

            { type === Constants.FILTER && (  
              <div title="Filter">
                <div className="form-panel">
                  <label>Filter Options</label>
                  <Select
                    name={'filterType'}
                    value={this.state.filterType}
                    onChange={this.handleOptionChange}
                    options={Constants.FILTER_TYPES}
                    preloadOneEmpty={false}
                  />
                </div>
              </div>
            )}

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

            { type === Constants.CHART && (
              <div title="Chart">
                <div className="form-panel">
                  <label>Chart Type</label>
                  <Select
                    name={'chartType'}
                    value={this.state.chartType}
                    onChange={this.handleOptionChange}
                    options={Constants.CHART_TYPES}
                    preloadOneEmpty={false}
                  />
                  <label>Preview</label>
                  {this.renderChartPreview()} 
                </div>
              </div>
            )}
            
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