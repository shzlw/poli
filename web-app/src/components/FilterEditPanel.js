import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/mysql';
import 'brace/theme/xcode';

import ReactTable from 'react-table';
import 'react-table/react-table.css';


import axios from 'axios';

import * as webApi from '../api/WebApi';

const QUERY_SLICER = 'slicer'
const TYPES = [QUERY_SLICER];

class FilterEditPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      jdbcDataSources: [],
      filterId: null,
      name: '',
      type: 'slicer',
      data: {},
      sqlQuery: '',
      jdbcDataSourceId: null,
      queryResult: []
    };
  }

  fetchFilter = async (id) => {
    const jdbcDataSources = await webApi.fetchDataSources();
    this.setState({ 
      jdbcDataSources: jdbcDataSources 
    });

    if (id === null) {
      if (jdbcDataSources.length !== 0) {
        this.setState({
          jdbcDataSourceId: jdbcDataSources[0].id 
        });
      }
      this.setState({
        filterId: null
      })
    } else {
      this.setState({
        filterId: id
      })
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
    const filter ={
      id: this.state.filterId,
      name: this.state.name,
      type: this.state.type,
      dashboardId: this.props.dashboardId,
      data: {
        jdbcDataSourceId: this.state.jdbcDataSourceId,
        sqlQuery: this.state.sqlQuery
      }
    };
    
    axios.post('/ws/filter', filter)
      .then(res => {
        
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
    const panelClass = this.props.show ? 'right-drawer display-block' : 'right-drawer display-none';
    const dataSourceOptions = this.state.jdbcDataSources.map(ds =>
      <option value={ds.id} key={ds.id}>{ds.name}</option>
    );

    const typeOptions = TYPES.map(t =>
      <option value={t} key={t}>{t}</option>
    );

    const headers = [];
    const queryResult = this.state.queryResult;
    let queryResultItem;
    if (queryResult !== undefined && queryResult.length !== 0 && Array.isArray(queryResult)) {
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
        <h3>FilterEditPanel</h3>
        <button onClick={() => this.props.onClose()}>Close</button>
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

        </form>

      </div>
    )
  };
}

export default FilterEditPanel;