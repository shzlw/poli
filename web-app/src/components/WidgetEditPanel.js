
import React from 'react';

import AceEditor from 'react-ace';

import 'brace/mode/mysql';
import 'brace/theme/xcode';

import TableWidget from './TableWidget';

import axios from 'axios';

import * as webApi from '../api/WebApi';
import * as Util from '../api/Util';
import * as EchartsApi from '../api/EchartsApi';
import * as Constants from '../api/Constants';

import ReactEcharts from 'echarts-for-react';

import './WidgetEditPanel.css';

import Checkbox from './Checkbox';
import Tabs from '../components/Tabs';
import Select from '../components/Select';

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
        showTitle: true
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

  handleCheckBoxChange = (name, isChecked) => {
    const style = {...this.state.style};
    style[[name]] = isChecked;
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
      axios.post('/ws/widget', widget)
        .then(res => {
          this.props.onSave();
        });
    } else {
      widget.id = widgetId;
      axios.put('/ws/widget', widget)
        .then(res => {
          this.props.onSave();
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
      console.log("generateChart", pieKey, pieValue);
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
          <label><i class="fas fa-chart-pie"></i> Pie Chart</label>
          <div>Count "value" by "key"</div>
          <label>Aggr Key (string)</label>
          <Select
            name={'pieKey'}
            value={pieKey}
            onChange={this.handleOptionChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />


          <label>By Aggr Value (number)</label>
          <Select
            name={'pieValue'}
            value={pieValue}
            onChange={this.handleOptionChange}
            options={columns}
            optionDisplay={'name'}
            optionValue={'name'}
          />
          <button onClick={this.generateChart}>Generete Chart</button>
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
      <div key={drill.columnName}>
        <div>Column: {drill.columnName}</div>
        <div>Dashboard: {drill.dashboardId}</div>
        <button onClick={() => this.removeDrillThrough(drill)}>delete</button>
      </div>
    );

    const columnItems = columns.map(col =>
      <div key={col.name}>{col.name} {col.dataType}</div>
    );

    const showQueryTab = type === Constants.CHART || (type === Constants.FILTER && this.state.filterType === Constants.SLICER);

    return (
      <div>
        <button className="button" onClick={this.save}>Save</button>
        <div className="row mt-5">
          <div className="float-left">Type:</div>
          <div className="float-left">
            <Select
              name={'type'}
              value={type}
              onChange={this.handleOptionChange}
              options={Constants.WIDGET_TYPES}
              preloadOneEmpty={false}
            />
          </div>
        </div>
        
        <div className="mt-5">
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
              </div>

              <Checkbox name="showBorder" value="Show border" checked={this.state.style.showBorder} onChange={this.handleCheckBoxChange} />
              <Checkbox name="showTitle" value="Show title" checked={this.state.style.showTitle} onChange={this.handleCheckBoxChange} />
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
                    style={{ marginTop: '8px' }}
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

                  <div className="mt-3">
                    <button className="button" onClick={this.runQuery}>Run Query</button>
                  </div>

                  <label>Result</label>
                  <TableWidget
                    data={data}
                    columns={columns}
                    error={error}
                  />

                  <label>Columns Mapping</label>
                  <div>
                    {columnItems}
                  </div>
                </div>
              </div>
            )}

            { type === Constants.CHART && (
              <div title="Chart">
                <div className="form-panel">
                  <label>Chart Options</label>
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
              <div title="Drill through">
                <div className="form-panel">
                  <label>Drill through</label>
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
                  <div>
                    {drillItems}
                  </div>
                  <button className="button" onClick={this.addDrillThrough}>Add</button>
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