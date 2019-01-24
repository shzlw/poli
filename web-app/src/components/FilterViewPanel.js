import React, { Component } from 'react';
import QuerySlicer from "./QuerySlicer";
import NumberRange from "./NumberRange";


const filters = [
  {
    type: 'slicer',
    id: 1,
    dashboardId: 1,
    data: {
      dataSourceId: 2,
      sqlQuery: 'select name from table',
      display: 'Name',
      columns: [{
          name: 'name',
          param: 'name'
        },
        {
          name: 'b',
          param: ':column b'
        }
      ]
    },
    queryResult: ['s1', 's2', 's3']
  }
]

class FilterViewPanel extends Component {

  constructor(props){
    super(props);
    this.state = {
      filters: filters
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.fetchFilters();
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
        for (let i = 0; i < queryResult.length; i++) {
          checkBoxes.push({
            value: queryResult[i],
            isChecked: false
          });
        }

        filterPanel.push(<QuerySlicer key={i} filterId={filter.id} checkBoxes={checkBoxes} onChange={this.onQuerySlicerChange} />);
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

    const isSelectAll = checked.length === checkBoxes.length;
  }


  fetchFilters = () => {
    console.log('fetchFilters');
    this.setState({
      filters: filters
    });
  }

  run = () => {
    console.log('run');
    
    this.fetchFilters();

    // TODO: call props
  }

  render() {
    return (
      <div>
        <h5>FilterViewPanel</h5>
        {this.renderFilterPanel()}
        <button onClick={this.run}>Run</button>
      </div>
    )
  };
}

export default FilterViewPanel;