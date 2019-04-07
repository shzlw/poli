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
import TableWidget from './TableWidget';

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
      jdbcDataSourceId: '',
      queryResult: {},
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
          const { 
            data,
            type
          } = result;
          this.setState({
            filterId: filterId,
            name: result.name,
            type: result.type,
            data: data
          });

          if (type === Constants.SLICER) {
            this.setState({
              sqlQuery: data.sqlQuery,
              jdbcDataSourceId: data.jdbcDataSourceId,
              param: data.param
            });
          } else if (type === Constants.SINGLE_VALUE) {
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
      filterId,
      name,
      type,
      jdbcDataSourceId,
      sqlQuery,
      param
    } = this.state;

    const filter = {
      name: name,
      type: type,
      dashboardId: this.props.dashboardId
    };

    if (type === Constants.SLICER) {
      filter.data = {
        jdbcDataSourceId: jdbcDataSourceId,
        sqlQuery: sqlQuery,
        param: param
      }
    } else if (type === Constants.SINGLE_VALUE) {
      filter.data = {
        useQuery: false,
        jdbcDataSourceId: jdbcDataSourceId,
        sqlQuery: sqlQuery,
        param: param,
      }
    }

    if (filterId === null) {
      axios.post('/ws/filter', filter)
        .then(res => {
          this.props.onSave();
        });
    } else {
      filter.id = filterId;
      axios.put('/ws/filter', filter)
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
        const queryResult = result;
        this.setState({
          queryResult: queryResult
        });
      });
  }

  render() {

    const { 
      queryResult = {},
      jdbcDataSources = []
    } = this.state;

    const data = Util.jsonToArray(queryResult.data);
    const columns = queryResult.columns || [];
    const error = queryResult.error;

    const dataSourceOptions = jdbcDataSources.map(ds =>
      <option value={ds.id} key={ds.id}>{ds.name}</option>
    );

    const typeOptions = Constants.FILTER_TYPES.map(t =>
      <option value={t} key={t}>{t}</option>
    );

    return (
      <div>
        <button className="button" onClick={this.save}>Save</button>
        <button className="button" onClick={this.runQuery}>Run</button>

        <div className="form-panel">
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
            style={{marginTop: '8px'}}
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
          <TableWidget
            data={data}
            columns={columns}
            error={error}
          />

          <label>Param</label>
          <input 
            type="text" 
            name="param" 
            value={this.state.param}
            onChange={this.handleInputChange} 
          />

        </div>

      </div>
    )
  };
}

export default FilterEditPanel;