
import React, { Component } from 'react';
import FilterViewPanel from '../components/FilterViewPanel';

class SingleTest extends Component {

  constructor(props) {
    super(props);
    this.filterViewPanel = React.createRef();
  }

  refresh = () => {
    console.log('refresh');
    this.filterViewPanel.current.fetchFilters();
  }

  render() {
    return (
      <div>
        <h5>SingleTest</h5>
        <FilterViewPanel ref={this.filterViewPanel}/>
        <button onClick={this.refresh}>Refresh</button>
      </div>
    )
  };
}

export default SingleTest;