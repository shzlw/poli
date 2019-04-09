import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/mysql';
import 'brace/theme/xcode';

import axios from 'axios';

import * as webApi from '../api/WebApi';
import * as Util from '../api/Util';
import * as Constants from '../api/Constants';
import TableWidget from './TableWidget';
import Select from './Select';


import './FilterEditPanel.css';

class FilterEditPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      jdbcDataSources: [],
      filterId: null,
      title: '',
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
            title: result.title,
            type: result.type,
            jdbcDataSourceId: result.jdbcDataSourceId,
            data: data
          });

          if (type === Constants.SLICER) {
            this.setState({
              sqlQuery: data.sqlQuery,
              param: data.param
            });
          } else if (type === Constants.SINGLE_VALUE) {
            this.setState({
              sqlQuery: data.sqlQuery,
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

  handleOptionChange = (name, value) => {
    this.setState({ 
      [name]: value
    });
  }

  handleIntegerOptionChange = (name, value) => {
    const intValue = parseInt(value, 10) || 0;
    this.setState({ 
      [name]: intValue
    });
  }

  save = () => {
    const {
      filterId,
      title,
      type,
      jdbcDataSourceId,
      sqlQuery,
      param
    } = this.state;

    const filter = {
      title: title,
      type: type,
      dashboardId: this.props.dashboardId,
      jdbcDataSourceId: jdbcDataSourceId
    };

    if (type === Constants.SLICER) {
      filter.data = {
        sqlQuery: sqlQuery,
        param: param
      }
    } else if (type === Constants.SINGLE_VALUE) {
      filter.data = {
        useQuery: false,
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
      jdbcDataSources = [],
      type
    } = this.state;

    const data = Util.jsonToArray(queryResult.data);
    const columns = queryResult.columns || [];
    const error = queryResult.error;

    const requireSql = type === Constants.SLICER;

    return (
      <div>
        <button className="button" onClick={this.save}>Save</button>
        <button className="button" onClick={this.runQuery}>Run</button>

        <div className="form-panel">
          <label className="form-label">Title</label>
          <input 
            type="text" 
            name="title" 
            value={this.state.title}
            onChange={this.handleInputChange} 
          />

          <label className="form-label">Type</label>
          <Select
            name={'type'} 
            value={this.state.type} 
            onChange={this.handleOptionChange}
            options={Constants.FILTER_TYPES}
          />

          {
            requireSql ?
            (
              <React.Fragment>
                <label className="form-label">DataSource</label>
                <Select
                  name={'jdbcDataSourceId'} 
                  value={this.state.jdbcDataSourceId} 
                  onChange={this.handleIntegerOptionChange}
                  options={jdbcDataSources}
                  optionDisplay={'name'}
                  optionValue={'id'}
                />
    
                <label className="form-label">SQL Query</label>
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

                <label className="form-label">Result</label>
                <TableWidget
                  data={data}
                  columns={columns}
                  error={error}
                />
              </React.Fragment>
            ) : null
          }

          <label className="form-label">Param</label>
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