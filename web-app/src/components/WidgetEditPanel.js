
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
      jdbcDataSourceId: null,
      columns: [],
      queryResultData: [],
      chartType: Constants.TABLE,
      aggrKey: '',
      aggrValue: '',
      chartOption: {}
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

  save = (event) => {
    event.preventDefault();
    const {
      widgetId,
      name,
      jdbcDataSourceId,
      sqlQuery,
      chartType,
    } = this.state;

    const widget = {
      name: name,
      dashboardId: this.props.dashboardId,
      chartType: chartType,
      jdbcDataSourceId: jdbcDataSourceId,
      sqlQuery: sqlQuery
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
    const dataSourceOptions = this.state.jdbcDataSources.map(ds =>
      <option value={ds.id} key={ds.id}>{ds.name}</option>
    );

    const chartOptionList = Constants.CHART_TYPES.map(o =>
      <option value={o} key={o}>{o}</option>
    );

    const headers = [];
    const { 
      columns,
      queryResultData
    } = this.state;

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

    const columnItems = columns.map(col =>
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
        </form>
        
      </div>
    )
  };
}

export default WidgetEditPanel;