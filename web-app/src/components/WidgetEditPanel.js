
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

import Tabs from '../components/Tabs';

class WidgetEditPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      jdbcDataSources: [],
      widgetId: null,
      name: '',
      sqlQuery: '',
      jdbcDataSourceId: '',
      queryResult: {},
      chartType: Constants.TABLE,
      pieKey: '',
      pieValue: '',
      chartOption: {},
      drills: [],
      drillDashboards: [],
      drillColumnName: '',
      drillDashboardId: ''
    };
  }

  componentDidMount() {
  }

  fetchWidget = async (widgetId, dashboardId) => {
    this.setState(this.initialState);

    const jdbcDataSources = await webApi.fetchDataSources();
    this.setState({ 
      jdbcDataSources: jdbcDataSources 
    });

    const filters = await webApi.fetchFiltersByDashboardId(dashboardId);
    this.setState({ 
      filters: filters 
    });

    axios.get('/ws/dashboard')
      .then(res => {
        const dashboards = res.data;
        this.setState({ 
          drillDashboards: dashboards 
        });
      });

    if (widgetId === null) {
      if (jdbcDataSources.length !== 0) {
        this.setState({
          jdbcDataSourceId: jdbcDataSources[0].id 
        });
      }

      if (filters.length !== 0) {
        this.setState({
          filterId: filters[0].id
        });
      }
      this.setState({
        widgetId: null
      })
    } else {
      this.setState({
        widgetId: widgetId
      })
      axios.get('/ws/widget/' + widgetId)
        .then(res => {
          const result = res.data;
          const { chartType } = result;
          if (chartType === Constants.PIE) {
            const {
              pieKey,
              pieValue
            } = result.data;
            this.setState({
              pieKey: pieKey,
              pieValue: pieValue
            });
          }

          this.setState({
            widgetId: widgetId,
            name: result.name,
            x: result.x,
            y: result.y,
            width: result.width,
            height: result.height,
            sqlQuery: result.sqlQuery,
            chartType: result.chartType,
            jdbcDataSourceId: result.jdbcDataSourceId,
            drills: result.drillThrough
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

  handleAceEditorChange = (newValue) => {
    this.setState({
      sqlQuery: newValue
    });
  }

  handleDataSourceChange = (event) => {
    const jdbcDataSourceId = parseInt(event.target.value, 10);
    this.setState({ 
      jdbcDataSourceId: jdbcDataSourceId
    });
  }

  handleChartTypeChange = (event) => {
    this.setState({ 
      chartType: event.target.value
    });
  }

  handleColumnChange = (name, event) => {
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleDrillColumnChange = (event) => {
    this.setState({ 
      drillColumnName: event.target.value
    });
  }

  handleDrillDashboardChange = (event) => {
    const drillDashboardId = parseInt(event.target.value, 10);
    this.setState({ 
      drillDashboardId: drillDashboardId
    });
  }

  save = () => {
    const {
      widgetId,
      name,
      jdbcDataSourceId,
      sqlQuery,
      chartType,
      drills
    } = this.state;

    if (!name) {
      return;
    }

    const widget = {
      name: name,
      dashboardId: this.props.dashboardId,
      chartType: chartType,
      jdbcDataSourceId: jdbcDataSourceId,
      sqlQuery: sqlQuery,
      drillThrough: drills
    }

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
      drills,
      drillColumnName,
      drillDashboardId
    } = this.state;
    const filterId = this.state.filterId;
    const index = drills.findIndex(d => d.columnName === drillColumnName);
    if (index === -1) {
      const newDrills = [...drills];
      newDrills.push({
        columnName: drillColumnName,
        dashboardId: drillDashboardId
      });
      this.setState({
        drills: newDrills
      });
    } 
  }

  removeDrillThrough = (drill) => {
    const { drills } = this.state;
    const index = drills.findIndex(d => (d.columnName === drill.columnName) && (d.dashboardId === drill.dashboardId));
    if (index !== -1) {
      const newDrills = [...drills];
      newDrills.splice(index, 1);
      this.setState({
        drills: newDrills
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
    const columnOptions = columns.map(col =>
      <option value={col.name} key={col.name}>{col.name}</option>
    );

    let chartPreview = (<div>NOT SUPPORTED</div>);
    if (chartType === Constants.TABLE) {

    } else if (chartType === Constants.PIE) {
      chartPreview = (
        <div>
          <label><i class="fas fa-chart-pie"></i> Pie Chart</label>
          <div>Count "value" by "key"</div>
          <label>Aggr Key (string)</label>
          <select value={this.state.pieKey} onChange={(event) => this.handleColumnChange('pieKey', event)}>
            {columnOptions}
          </select>

          <label>By Aggr Value (number)</label>
          <select value={this.state.pieValue} onChange={(event) => this.handleColumnChange('pieValue', event)}>
            {columnOptions}
          </select>
          <button onClick={this.generateChart}>Generete Chart</button>
          <ReactEcharts 
            option={this.state.chartOption} 
            style={{height: '350px', width: '100%'}}  
            className='react_for_echarts' />
        </div>
      );
    }
    return chartPreview;
  }

  render() {
    const { 
      queryResult,
      jdbcDataSources,
      drills,
      drillDashboards
    } = this.state;

    const data = Util.jsonToArray(queryResult.data);
    const columns = queryResult.columns || [];
    const error = queryResult.error;

    const dataSourceOptions = (jdbcDataSources || []).map(ds =>
      <option value={ds.id} key={ds.id}>{ds.name}</option>
    );

    const columnOptions = columns.map(col =>
      <option value={col.name} key={col.name}>{col.name}</option>
    );

    const chartOptionList = Constants.CHART_TYPES.map(o =>
      <option value={o} key={o}>{o}</option>
    );

    const dashboardOptions = (drillDashboards || []).map(dash =>
      <option value={dash.id} key={dash.id}>{dash.name}</option>
    );

    const drillItems = (drills || []).map(drill =>
      <div key={drill.columnName}>
        <div>Column: {drill.columnName}</div>
        <div>Dashboard: {drill.dashboardId}</div>
        <button onClick={() => this.removeDrillThrough(drill)}>delete</button>
      </div>
    );

    const columnItems = columns.map(col =>
      <div key={col.name}>{col.name} {col.dataType}</div>
    );

    return (
      <div>
        <button className="button" onClick={this.save}>Save</button>
        
        <div className="form-panel">
          <Tabs activeTab="basic">
            <div title="basic">
              <label>Name</label>
              <input 
                type="text" 
                name="name" 
                value={this.state.name}
                onChange={this.handleInputChange} 
              />
            </div>

            <div title="Query">
              <label>DataSource</label>
              <select value={this.state.jdbcDataSourceId} onChange={this.handleDataSourceChange}>
                {dataSourceOptions}
              </select>
            
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

              <button className="button" onClick={this.runQuery}>Run Query</button>

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

            <div title="Chart">
              <label>Chart Options</label>
              <select value={this.state.chartType} onChange={this.handleChartTypeChange}>
                {chartOptionList}
              </select>

              <label>Preview</label>
              {this.renderChartPreview()}  
            </div>

            <div title="Drill through">
              <label>Drill through</label>
              <label>Column</label>
              <select value={this.state.drillColumnName} onChange={this.handleDrillColumnChange}>
                {columnOptions}
              </select>
              <label>Dashboard</label>
              <select value={this.state.drillDashboardId} onChange={this.handleDrillDashboardChange}>
                {dashboardOptions}
              </select>
              <div>
                {drillItems}
              </div>
              <button className="button" onClick={this.addDrillThrough}>Add</button>
            </div>
          </Tabs>

        </div>
      </div>
    )
  };
}

export default WidgetEditPanel;