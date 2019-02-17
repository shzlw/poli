
import React from 'react';

import AceEditor from 'react-ace';

import 'brace/mode/mysql';
import 'brace/theme/xcode';

import ReactTable from 'react-table';
import 'react-table/react-table.css';


import axios from 'axios';

import * as webApi from '../api/WebApi';
import * as util from '../api/Util';
import * as echartsApi from '../api/EchartsApi';

import ReactEcharts from 'echarts-for-react';


const PIE = 'pie';
const TABLE = 'table';
const CHART_TYPES = [TABLE, PIE];

class WidgetEditPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      jdbcDataSources: [],
      filters: [],
      widgetId: null,
      name: '',
      sqlQuery: '',
      jdbcDataSourceId: null,
      queryResult: [],
      filterId: null,
      filterParams: [],
      chartType: 'table',
      aggrKey: '',
      aggrValue: '',
      chartOption: {}
    };
  }

  componentDidMount() {
    console.log('WidgetEditPanel', 'componentDidMount');
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
            jdbcDataSourceId: result.jdbcDataSourceId,
          });
        });
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleAceEditorChange = (newValue) => {
    this.setState({
      sqlQuery: newValue
    });
  }

  handleDataSourceChange = (event) => {
    this.setState({ 
      jdbcDataSourceId: event.target.value
    });
  }

  handleChartTypeChange = (event) => {
    this.setState({ 
      chartType: event.target.value
    });
  }

  save = (event) => {
    event.preventDefault();
    const widget ={
      id: this.state.widgetId,
      name: this.state.name,
      dashboardId: this.props.dashboardId,
      jdbcDataSourceId: this.state.jdbcDataSourceId,
      sqlQuery: this.state.sqlQuery
    };
    
    axios.post('/ws/widget', widget)
      .then(res => {
        
      });
  }

  close = () => {
    this.props.onClose();
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
        const queryResult = result;
        this.setState({
          queryResult: queryResult
        });
      });
  }

  addFilterParam = (event) => {
    event.preventDefault();
    const filterId = this.state.filterId;
    const index = this.state.filterParams.findIndex(f => f === filterId);
    if (index === -1) {
      const newFilterParams = [...this.state.filterParams];
      newFilterParams.push(filterId);
      this.setState({
        filterParams: newFilterParams
      });
    } 
  }

  removeFilterParam = (filterId, event) => {
    event.preventDefault();
    const index = this.state.filterParams.findIndex(f => f === filterId);
    if (index !== -1) {
      const newFilterParams = [...this.state.filterParams];
      newFilterParams.splice(index, 1);
      this.setState({
        filterParams: newFilterParams
      });
    } 
  }

  handleFilterChange = (event) => {
    this.setState({ 
      filterId: event.target.value
    });
  }

  generateChart = () => {
    if (this.state.chartType === PIE) {
      const { 
        aggrKey, 
        aggrValue, 
        queryResult 
      } = this.state.aggrValue;
      if (!util.isArrayEmpty(queryResult)) {
        let legend = [];
        let series = [];
        for (let i = 0; i < queryResult.length; i++) {
          const row = queryResult[i];
          legend.push(row[aggrKey]);
          series.push({
            name: row[aggrKey],
            value: row[aggrValue]
          });
        }
        const chartOption = echartsApi.getPieOption(legend, series);
        this.setState({
          chartOption: chartOption
        })
      }
    }
  }

  render() {
    const panelClass = this.props.show ? 'right-drawer display-block' : 'right-drawer display-none';

    const dataSourceOptions = this.state.jdbcDataSources.map(ds =>
      <option value={ds.id} key={ds.id}>{ds.name}</option>
    );

    const filterOptions = this.state.filters.map(f =>
      <option value={f.id} key={f.id}>{f.id}</option>
    );

    const filterParamItems = this.state.filterParams.map(f =>
      <div key={f}>
        <div>value: {f}</div>
        <button onClick={(event) => this.removeFilterParam(f, event)}>delete</button>
      </div>
    );

    const chartOptionList = CHART_TYPES.map(o =>
      <option value={o} key={o}>{o}</option>
    );

    const headers = [];
    const queryResult = this.state.queryResult;
    let queryResultItem;
    if (!util.isArrayEmpty(queryResult)) {
      const obj = queryResult[0];
      const keys = Object.keys(obj);
      for (const key of keys) {
        headers.push({
          Header: key,
          accessor: key
        })
      }

      queryResultItem = (
        <ReactTable
          data={this.state.queryResult}
          columns={headers}
          minRows={0}
          showPagination={false}
        />
      );
    } else {
      queryResultItem = (
        <div>{queryResult}</div>
      );
    }

    return (
      <div className={panelClass}>
        <h3>WidgetEditPanel: {this.state.widgetId}</h3>
        <button onClick={() => this.props.onClose()}>Close</button>
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
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />

          <label>Result</label>
          {queryResultItem}

          <label>Filter Params</label>
          <div>
            <select value={this.state.filterId} onChange={this.handleFilterChange}>
              {filterOptions}
            </select>
            <div>
              {filterParamItems}
            </div>
            <button onClick={this.addFilterParam}>Add</button>
            <div>
              
            </div>
          </div>
        

          <label>Columns Mapping</label>
          <div>column name, display name, data type</div>

          <label>Chart Options</label>
          <select value={this.state.chartType} onChange={this.handleChartTypeChange}>
            {chartOptionList}
          </select>

          <label><i class="fas fa-table"></i> Table</label>
          <div></div>

          <label><i class="fas fa-chart-pie"></i> Pie Chart</label>
          <div>Count "users" by "last name"</div>
          <label>Aggr Key</label>
          <input 
            type="text" 
            name="aggrKey" 
            value={this.state.aggrKey}
            onChange={this.handleInputChange} 
          />

          <label>By Aggr Value</label>
          <input 
            type="text" 
            name="aggrValue" 
            value={this.state.aggrValue}
            onChange={this.handleInputChange} 
          />
          <button onClick={this.generateChart}></button>

          <ReactEcharts 
            option={this.state.chartOption} 
            style={{height: '350px', width: '100%'}}  
            className='react_for_echarts' />

        </form>
        
      </div>
    )
  };
}

export default WidgetEditPanel;