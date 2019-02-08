import React, { Component } from 'react';
import QuerySlicer from "./QuerySlicer";
import NumberRange from "./NumberRange";

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
            const queryResult = JSON.parse(result.data);
            const checkBoxes = [];

            if (this.isArrayNotEmpty(queryResult)) {
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

            newFilters[index].queryResult = queryResult;
            newFilters[index].checkBoxes = checkBoxes;

            this.setState({
              filters: newFilters
            });
          });
      }
    }
  }

  isArrayNotEmpty(a) {
    return a !== undefined && a.length !== 0 && Array.isArray(a);
  }

  renderFilterPanel = () => {
    const filterPanel = [];
    const filters = this.state.filters;
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (filter.type === 'slicer') {
        const checkBoxes = filter.checkBoxes;
        filterPanel.push(
          (
            <div className="filterCard">
              <div className="filter-card-title">
                {filter.name}
                <div className="icon-button-group">
                  <div className="icon-btn" onClick={() => this.edit(filter.id)}>
                    <i className="fas fa-edit fa-fw"></i>
                  </div>
                  <div className="icon-btn" onClick={() => this.delete(filter.id)}>
                    <i className="fas fa-trash-alt fa-fw"></i>
                  </div>
                </div>
              </div>
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
      } else if (filter.type === 'number-range') {
        filterPanel.push(<NumberRange key={i} />);
      } else if (filter.type === 'date-range') {

      }
    }
    return filterPanel;
  }

  edit = (filterId) => {
    this.props.onEdit(filterId);
  }

  delete = (filterId) => {
    axios.get('/ws/filter/' + filterId)
      .then(res => {
        const index = this.state.filters.findIndex(f => f.id === filterId);
        const newFilters = [...this.state.filters];
        newFilters.splice(index, 1);
        this.setState({
          filters: newFilters
        });
      });
  }

  onQuerySlicerChange = (filterId, checkBoxes) => {
    const index = this.state.filters.findIndex(f => f.id === filterId);
    const newFilters = [...this.state.filters];
    newFilters[index].checkBoxes = [...checkBoxes];
    this.setState({
      filters: newFilters
    });

    // TODO: select all.
    // const isSelectAll = checked.length === checkBoxes.length;    
  }


  run = () => {
    console.log('run');
  
    // TODO: call props
  }

  render() {
    const panelClass = this.props.show ? 'display-block' : 'display-none';

    return (
      <div className={`testPanel ${panelClass}`}>
        <h5>FilterViewPanel</h5>
        <button onClick={() => this.props.onClose()}>Close</button>
        <button onClick={this.run}>Run</button>
        <div className="filterViewPanel">
          {this.renderFilterPanel()}
        </div>
      </div>
    )
  };
}

export default FilterViewPanel;