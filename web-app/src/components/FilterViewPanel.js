import React, { Component } from 'react';
import Slicer from "./Slicer";
import NumberRange from "./NumberRange";
import * as Util from '../api/Util';
import * as Constants from '../api/Constants';

import axios from 'axios';


class FilterViewPanel extends Component {

  constructor(props){
    super(props);
    this.state = {
      dashboardId: null,
      filters: []
    };
  }

  fetchFilters = (dashboardId) => {
    if (dashboardId === null) {
      return;
    }

    this.setState({
      dashboardId: dashboardId
    })

    axios.get('/ws/filter/dashboard/' + dashboardId)
      .then(res => {
        const result = res.data;
        this.setState({
          filters: result,
        }, this.queryFilters);
      });
  }

  queryFilters = () => {
    const { filters } = this.state;
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (filter.type === Constants.SLICER) {
        const queryRequest = filter.data;
        axios.post('/ws/jdbcquery/filter/' + filter.id, queryRequest)
          .then(res => {
            const result = res.data;
            const queryResult = JSON.parse(result.data);

            const index = filters.findIndex(f => f.id === result.id);
            const newFilters = [...this.state.filters];
            newFilters[index].queryResult = queryResult;
            const type = newFilters[index].type;
            if (type === Constants.SLICER) {
              const checkBoxes = [];
              if (!Util.isArrayEmpty(queryResult)) {
                for (let i = 0; i < queryResult.length; i++) {
                  const values = Object.values(queryResult[i]);
                  for (const val of values) {
                    checkBoxes.push({
                      value: val,
                      isChecked: false
                    });
                  }
                }
              }

              newFilters[index].checkBoxes = checkBoxes;
            } else if (type === Constants.SINGLE_VALUE) {
              const values = Object.values(queryResult);
              let value = '';
              for (const val of values) {
                value = val;
                break;
              }
              newFilters[index].value = value;
            }

            this.setState({
              filters: newFilters
            });
          });
      }
    }
  }

  renderFilterPanel = () => {
    const filterPanel = [];
    const filters = this.state.filters;
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      let filterComponent = (<div>NONE</div>);
      if (filter.type === Constants.SLICER) {
        const checkBoxes = filter.checkBoxes;
        filterComponent = (
          <Slicer 
            key={i} 
            filterId={filter.id} 
            checkBoxes={checkBoxes} 
            onChange={this.onSlicerChange} 
          />
        );
      } else if (filter.type === Constants.SINGLE_VALUE) {
        filterComponent = (
          <input 
            type="text"  
            value={filter.value}
            onChange={(event) => this.onSingleValueChange(filter.id, event)} 
          />
        );
      }

      filterPanel.push(
          (
            <div className="filter-card">
              <div className="filter-card-title">
                {filter.name}
                <div className="icon-button-group">
                  <div className="icon-btn" onClick={() => this.edit(filter.id)}>
                    <i className="fas fa-edit fa-fw"></i>
                  </div>
                  <div className="icon-btn" onClick={() => this.remove(filter.id)}>
                    <i className="fas fa-trash-alt fa-fw"></i>
                  </div>
                </div>
              </div>
              <div>
                {filterComponent}
              </div>
            </div>
          )
        );
    }
    return filterPanel;
  }

  edit = (filterId) => {
    this.props.onEdit(filterId);
  }

  remove = (filterId) => {
    axios.delete('/ws/filter/' + filterId)
      .then(res => {
        const index = this.state.filters.findIndex(f => f.id === filterId);
        const newFilters = [...this.state.filters];
        newFilters.splice(index, 1);
        this.setState({
          filters: newFilters
        });
      });
  }

  onSlicerChange = (filterId, checkBoxes) => {
    const index = this.state.filters.findIndex(f => f.id === filterId);
    const newFilters = [...this.state.filters];
    newFilters[index].checkBoxes = [...checkBoxes];
    this.setState({
      filters: newFilters
    });

    // TODO: select all.
    // const isSelectAll = checked.length === checkBoxes.length;    
  }

  onSingleValueChange = (filterId, event) => {
    const { filters } = this.state;
    const value = event.target.value;
    const index = filters.findIndex(f => f.id === filterId);
    const newFilters = [...filters];
    newFilters[index].value = value;
    this.setState({
      filters: newFilters
    });
  }

  applyFilters = () => {
    console.log('applyFilters');
    const { filters } = this.state;
    const filterParams = [];
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (filter.type === Constants.SLICER) {
        const checkBoxes = filter.checkBoxes;
        const paramValues = [];
        for (let j = 0; j < checkBoxes.length; j++) {
          const checkBox = checkBoxes[j];
          if (checkBox.isChecked) {
            paramValues.push(checkBox.value);
          }
        }
        filterParams.push({
          param: filter.data.param,
          value: paramValues
        });
      } else if (filter.type === Constants.SINGLE_VALUE) {
        filterParams.push({
          param: filter.data.param,
          value: filter.value
        });
      }
    }

    this.props.onApplyFilters(filterParams);
  }

  render() {
    return (
      <div>
        <h5>FilterViewPanel</h5>
        <button onClick={this.applyFilters}>Run</button>
        <div className="filterViewPanel">
          {this.renderFilterPanel()}
        </div>
      </div>
    )
  };
}

export default FilterViewPanel;