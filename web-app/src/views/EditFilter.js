
import React, { Component } from 'react';
import Select from 'react-select';
import * as webApi from '../api/WebApi';
import axios from 'axios';

const options = [
  { value: 'slicer', label: 'Slicer' },
  { value: 'number-range', label: 'Number Range' },
  { value: 'date-range', label: 'Date Range' }
];

/**
 * 
 * filter.data = {
          sqlQuery: 'select name from page group by name',
          display: 'column a',
          columns: [{
              name: 'a',
              param: ':column a'
            },
            {
              name: 'b',
              param: ':column b'
            }
          ]
        };
 */

class EditFilter extends Component {

  constructor(props){
    super(props);
    console.log('EditFilter', this.props);
    this.state = {
      jdbcDataSources: [],
      id: this.props.filterId,
      label: '',
      selectedType : {},
      querySlicerSqlQuery: '',
      querySlicerColumnParam: ''
    };
  }

  componentDidMount() {
    console.log('componentDidMount', this.props);
    this.initData();

    if (this.props.filterId !== null) {
      axios.get('/ws/filter/' + this.props.filterId)
        .then(res => {
          const filter = res.data;
          console.log('fetch', filter);
          if (filter.type === 'slicer') {
            const data = JSON.parse(filter.data);
            this.setState({
              selectedType: {value: 'slicer', label: 'Slicer'},
              querySlicerSqlQuery: data.sqlQuery,
              querySlicerColumnParam: data.columnParam
            });
          }

          
        });
    }
  }

  async initData() {
    const jdbcDataSources = await webApi.fetchDataSources();
    this.setState({ 
      jdbcDataSources: jdbcDataSources 
    });
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleTypeChange = (selectedType) => {
    this.setState({ selectedType });
    console.log(`Option selected:`, selectedType);
  }
  

  saveFilter = (event) => {
    event.preventDefault();

    const type = this.state.selectedType.value;
    // TODO: type cannot be null

    const dataSourceId = 1;
    const dashboardId = this.state.dashboardId;
    const filter = {
      type: type,
      dataSourceId: dataSourceId,
      dashboardId: dashboardId
    };
    switch (type) {
      case 'slicer':
        filter.data = {
          sqlQuery: 'select name from page group by name',
          display: 'column a',
          columns: [{
              name: 'a',
              param: ':column a'
            },
            {
              name: 'b',
              param: ':column b'
            }
          ]
        };
        break;
      case 'number-range':
        filter.data = {
          minParam: ':p1',
          maxParam: ':p2',
          minDefault: 0,
          maxDefault: 100,
          minValue: 0,
          maxValue: 100
        };
        break;
      case 'date-range':
        filter.data = {
          startParam: ':p1',
          endParam: ':p2'
        };
        break;
      default:
    }

    axios.post('/ws/filter', filter)
      .then(res => {
      });

    console.log('state', this.state);
  }

  

  buildQuerySlicerForm = () => {
    return (
      <div>
        <label>SQL</label>
        <br/>
        <input 
          type="text" 
          name="querySlicerSqlQuery" 
          value={this.state.querySlicerSqlQuery}
          onChange={this.handleInputChange} />

        <label>Column Name</label>
        <br/>
        <input 
          type="text" 
          name="querySlicerColumnParam" 
          value={this.state.querySlicerColumnParam}
          onChange={this.handleInputChange} />
      </div>
    );
  }

  render() {
    const { selectedType } = this.state;

    const jdbcDataSourceItems = this.state.jdbcDataSources.map((ds, index) => 
      <div key={index}>
        {ds.id} - {ds.name} - {ds.username}
      </div>
    );

    let form = null;
    if (selectedType.value === 'slicer') {
      form = this.buildQuerySlicerForm();
    }

    return (
      <div key={this.props.filterId}>
        <h3>EditFilter</h3>
        <label>Data Sources</label>
        <br/>
        {jdbcDataSourceItems}

        <label>Label</label>
        <br/>
        <input 
          type="text" 
          name="label" 
          value={this.state.label}
          onChange={this.handleInputChange} />

        <label>Type</label>
        <br/>
        <Select
          value={selectedType}
          onChange={this.handleTypeChange}
          options={options}
        />

        {form}

        <button onClick={this.saveFilter}>save filter</button>
      </div>
    )
  };
}

export default EditFilter;