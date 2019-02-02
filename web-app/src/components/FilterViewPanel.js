import React, { Component } from 'react';
import QuerySlicer from "./QuerySlicer";
import NumberRange from "./NumberRange";

import axios from 'axios';


class FilterViewPanel extends Component {

  constructor(props){
    super(props);
    this.state = {
      filters: []
    };
  }

  fetchFilters = (dashboardId) => {
    if (dashboardId === null) {
      return;
    }

    axios.get('/ws/filter/dashboard/' + dashboardId)
      .then(res => {
        const result = res.data;
        this.setState({
          filters: result,
        }, this.queryFilters);
      });
  }

  queryFilters = () => {
    const filters = this.state.filters;
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (filter.type === 'slicer') {
        const queryRequest = filter.data;
        axios.post('/ws/jdbcquery/filter/' + filter.id, queryRequest)
          .then(res => {
            const result = res.data;
            const index = filters.findIndex(f => f.id === result.id);
            const newFilters = [...this.state.filters];
            newFilters[index].queryResult = JSON.parse(result.data);
            this.setState({
              filters: newFilters
            });
          });
      }
    }
  }


  renderFilterPanel = () => {
    console.log('renderFilterPanel');
    const filterPanel = [];
    const filters = this.state.filters;
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (filter.type === 'slicer') {
        console.log('11111');

        const queryResult = filter.queryResult;
        const checkBoxes = [];
        if (queryResult !== undefined 
          && queryResult.length !== 0 
          && Array.isArray(queryResult)) {
          for (let i = 0; i < queryResult.length; i++) {
            const values = Object.values(queryResult[i]);
            for (const val of values) {
              checkBoxes.push({
                value: val,
                isChecked: false
              });
            }
          }

          filterPanel.push(
            (
              <div className="filterCard">
                <div>{filter.name}</div>
                <div>
                  <QuerySlicer 
                    key={i} 
                    filterId={filter.id} 
                    checkBoxes={checkBoxes} 
                    onChange={this.onQuerySlicerChange} 
                  />
                </div>
              </div>
            )
          );
        }
      } else if (filter.type === 'number-range') {
        filterPanel.push(<NumberRange key={i} />);
      } else if (filter.type === 'date-range') {

      }
    }
    return filterPanel;
  }

  onQuerySlicerChange = (filterId, checkBoxes) => {
    console.log('onQuerySlicerChange', filterId, checkBoxes);

    const filter = this.state.filters.find(f => f.id === filterId);

    const checked = [];
    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].isChecked) {
        checked.push(checkBoxes[i]);
      }
    }

    // const isSelectAll = checked.length === checkBoxes.length;    
  }


  run = () => {
    console.log('run');
  
    // TODO: call props
  }

  render() {
    return (
      <div className="testPanel">
        <h5>FilterViewPanel</h5>
        <button onClick={this.run}>Run</button>
        <div className="filterViewPanel">
          {this.renderFilterPanel()}
        </div>
      </div>
    )
  };
}

export default FilterViewPanel;