import React, { Component } from 'react';
import Slicer from "./Slicer";
import NumberRange from "./NumberRange";
import * as Util from '../api/Util';
import * as Constants from '../api/Constants';

import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './FilterViewPanel.css';

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
            const queryResult = res.data;
            const queryResultData = Util.jsonToArray(queryResult.data);

            const index = filters.findIndex(f => f.id === queryResult.id);
            const newFilters = [...this.state.filters];
            newFilters[index].queryResult = queryResult;
            const type = newFilters[index].type;
            if (type === Constants.SLICER) {
              const checkBoxes = [];
              for (let i = 0; i < queryResultData.length; i++) {
                const values = Object.values(queryResultData[i]);
                for (const val of values) {
                  checkBoxes.push({
                    value: val,
                    isChecked: false
                  });
                }
              }

              newFilters[index].checkBoxes = checkBoxes;
            } else if (type === Constants.SINGLE_VALUE) {
              const values = Object.values(queryResultData);
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

              { this.props.isEditMode ? 
                (
                  <div className="icon-button-group">
                    <div className="inline-block" onClick={() => this.edit(filter.id)}>
                      <FontAwesomeIcon icon="edit" fixedWidth />
                    </div>
                    <div className="inline-block" onClick={() => this.remove(filter.id)}>
                      <FontAwesomeIcon icon="trash-alt" fixedWidth />
                    </div>
                  </div>
                ): null 
              }
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
    const { filters } = this.state;
    const filterParams = [];
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      const filterParam = {};
      if (filter.type === Constants.SLICER) {
        const checkBoxes = filter.checkBoxes;
        const paramValues = [];
        for (let j = 0; j < checkBoxes.length; j++) {
          const checkBox = checkBoxes[j];
          if (checkBox.isChecked) {
            paramValues.push(checkBox.value);
          }
        }
        filterParam.value = paramValues;
        if (paramValues.length === checkBoxes.length) {
          filterParam.remark = 'select all';
        }
      } else if (filter.type === Constants.SINGLE_VALUE) {
        filterParam.value = filter.value;
      }
      filterParam.param = filter.data.param;
      filterParam.type = filter.type;
      filterParams.push(filterParam);
    }

    this.props.onApplyFilters(filterParams);
  }

  render() {
    const { show } = this.props;
    const style = {};
    if (show) {
      style.width = Constants.DEFAULT_FILTER_VIEW_WIDTH + 'px';
    } else {
      style.width = '0px';
    }

    return (
      <div className="dashboard-content-filter-panel" style={style}>
        <div>Filters</div>
        <button className="button" onClick={this.applyFilters}>Run</button>
        <div className="filter-view-panel">
          {this.renderFilterPanel()}
        </div>
      </div>
    )
  };
}

export default FilterViewPanel;