import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/mysql';
import 'brace/theme/xcode';

import ReactTable from 'react-table';
import 'react-table/react-table.css';


import axios from 'axios';

import * as webApi from '../api/WebApi';
import * as Util from '../api/Util';
import * as Constants from '../api/Constants';

class FilterEditPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      jdbcDataSources: [],
      filterId: null,
      name: '',
      type: Constants.SLICER,
      data: {},
      sqlQuery: '',
      jdbcDataSourceId: null,
      queryResult: [],
      param: '',
    };
  }

  fetchFilter = async (filterId) => {
    this.setState(this.initialState);

    const jdbcDataSources = await webApi.fetchDataSources();
    this.setState({ 
      jdbcDataSources: jdbcDataSources 
    });

    if (filterId === null) {
      if (jdbcDataSources.length !== 0) {
        this.setState({
          jdbcDataSourceId: jdbcDataSources[0].id 
        });
      }
      this.setState({
        filterId: null
      })
    } else {
      axios.get('/ws/filter/' + filterId)
        .then(res => {
          const result = res.data;
          const data = result.data;
          this.setState({
            filterId: filterId,
            name: result.name,
            type: result.type,
            data: data
          });

          if (result.type === Constants.SLICER) {
            this.setState({
              sqlQuery: data.sqlQuery,
              jdbcDataSourceId: data.jdbcDataSourceId,
              param: data.param
            });
          }
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

  handleTypeChange = (event) => {
    this.setState({ 
      type: event.target.value
    });
  }

  save = (event) => {
    event.preventDefault();
    const {
      type
    } = this.state;

    const filter = {
      id: this.state.filterId,
      name: this.state.name,
      type: this.state.type,
      dashboardId: this.props.dashboardId
    };

    if (type === Constants.SLICER) {
      filter.data = {
        jdbcDataSourceId: this.state.jdbcDataSourceId,
        sqlQuery: this.state.sqlQuery,
        param: this.state.param
      }
    } else if (type === Constants.SINGLE_VALUE) {
      filter.data = {
        useQuery: false,
        jdbcDataSourceId: this.state.jdbcDataSourceId,
        sqlQuery: this.state.sqlQuery,
        param: this.state.param,
      }
    }

    axios.post('/ws/filter', filter)
      .then(res => {
        this.props.onSave();
      });
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

  render() {

    const { 
      queryResult,
      jdbcDataSources
    } = this.state;

    const dataSourceOptions = jdbcDataSources.map(ds =>
      <option value={ds.id} key={ds.id}>{ds.name}</option>
    );

    const typeOptions = Constants.FILTER_TYPES.map(t =>
      <option value={t} key={t}>{t}</option>
    );

    const headers = [];
    let queryResultItem;
    if (!Util.isArrayEmpty(queryResult)) {
      console.log('queryResult', queryResult);
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
      <div>
        <h3>FilterEditPanel: {this.state.filterId}</h3>
        <button onClick={this.save}>Save</button>
        <button onClick={this.runQuery}>Run</button>

        <form>
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            value={this.state.name}
            onChange={this.handleInputChange} 
          />

          <label>Type</label>
          <select value={this.state.type} onChange={this.handleTypeChange}>
            {typeOptions}
          </select>

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

          <label>Param</label>
          <input 
            type="text" 
            name="param" 
            value={this.state.param}
            onChange={this.handleInputChange} 
          />

        </form>

      </div>
    )
  };
}

export default FilterEditPanel;