
import React from 'react';

import AceEditor from 'react-ace';

import 'brace/mode/mysql';
import 'brace/theme/xcode';

import ReactTable from 'react-table';
import 'react-table/react-table.css';


import axios from 'axios';

import * as webApi from '../api/WebApi';
import * as Util from '../api/Util';
import * as EchartsApi from '../api/EchartsApi';
import * as Constants from '../api/Constants';

import ReactEcharts from 'echarts-for-react';


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
      columns: [],
      queryResultData: [],
      chartType: Constants.TABLE,
      aggrKey: '',
      aggrValue: '',
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

  save = (event) => {
    event.preventDefault();
    const {
      widgetId,
      name,
      jdbcDataSourceId,
      sqlQuery,
      chartType,
      drills
    } = this.state;

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
        aggrKey,
        aggrValue
      } = this.state;
      widget.data = {
        name: aggrKey,
        value: aggrValue
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

  runQuery = (event) => {
    event.preventDefault();
    const queryRequest ={
      jdbcDataSourceId: this.state.jdbcDataSourceId,
      sqlQuery: this.state.sqlQuery
    };

    axios.post('/ws/jdbcquery/query', queryRequest)
      .then(res => {
        const result = res.data;
        const columns = result.columns;
        const data = JSON.parse(result.data);
        this.setState({
          queryResultData: data,
          columns: columns 
        });
      });
  }

  addDrillThrough = (event) => {
    event.preventDefault();
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

  removeDrillThrough = (drill, event) => {
    event.preventDefault();
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

  generateChart = (event) => {
    event.preventDefault();
    if (this.state.chartType === Constants.PIE) {
      const { 
        aggrKey, 
        aggrValue, 
        queryResultData 
      } = this.state;
      if (!Util.isArrayEmpty(queryResultData)) {
        let legend = [];
        let series = [];
        for (let i = 0; i < queryResultData.length; i++) {
          const row = queryResultData[i];
          legend.push(row[aggrKey]);
          series.push({
            name: row[aggrKey],
            value: row[aggrValue]
          });
        }
        const chartOption = EchartsApi.getPieOption(legend, series);
        this.setState({
          chartOption: chartOption
        });
      }
    }
  }

  renderChartPreview = () => {
    const { 
      chartType,
      columns 
    } = this.state;
    const columnOptions = (columns || []).map(col =>
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
          <select value={this.state.aggrKey} onChange={(event) => this.handleColumnChange('aggrKey', event)}>
            {columnOptions}
          </select>

          <label>By Aggr Value (number)</label>
          <select value={this.state.aggrValue} onChange={(event) => this.handleColumnChange('aggrValue', event)}>
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
      columns,
      queryResultData,
      jdbcDataSources,
      drills,
      drillDashboards
    } = this.state;

    const dataSourceOptions = (jdbcDataSources || []).map(ds =>
      <option value={ds.id} key={ds.id}>{ds.name}</option>
    );

    const columnOptions = (columns || []).map(col =>
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
        <button onClick={(event) => this.removeDrillThrough(drill, event)}>delete</button>
      </div>
    );

    const headers = [];
    let queryResultItem;
    if (!Util.isArrayEmpty(queryResultData)) {
      const obj = queryResultData[0];
      const keys = Object.keys(obj);
      for (const key of keys) {
        headers.push({
          Header: key,
          accessor: key
        });
      }

      queryResultItem = (
        <ReactTable
          data={queryResultData}
          columns={headers}
          minRows={0}
          showPagination={false}
        />
      );
    } else {
      queryResultItem = (
        <div>{queryResultData}</div>
      );
    }

    const columnItems = (columns || []).map(col =>
      <div key={col.name}>{col.name} {col.dataType}</div>
    );

    return (
      <div>
        <h3>WidgetEditPanel: {this.state.widgetId}</h3>
        <button onClick={this.save}>Save</button>
        <button onClick={this.runQuery}>Run Query</button>

        <form>
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            value={this.state.name}
            onChange={this.handleInputChange} 
          />

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

          <label>Result</label>
          {queryResultItem}

          <label>Columns Mapping</label>
          <div>
             {columnItems}
          </div>

          <label>Chart Options</label>
          <select value={this.state.chartType} onChange={this.handleChartTypeChange}>
            {chartOptionList}
          </select>

          <label>Preview</label>
          {this.renderChartPreview()}  

          <label>Drill through</label>
          <div>
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
            <button onClick={this.addDrillThrough}>Add</button>
          </div>

        </form>
        
      </div>
    )
  };
}

export default WidgetEditPanel;