
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class EditBoard extends Component {

  state = { 
    id: 0,
    name: '',
    cards: [],
    filters: [],
    showAddFilter: false
  };

  componentDidMount() {
    this.fetchBoardById();
  }

  fetchBoardById = () => {

  }

  addCard = () => {

  }

  addFilter = () => {
    this.setState({
      showAddFilter: !this.state.showAddFilter
    })
  }

  render() {

    const filterDrawerClass = this.state.showAddFilter ? 'right-drawer display-block' : 'right-drawer display-none';

    return (
      <div>
        <h3>Edit Board</h3>
        <div>
          <h5>Cards</h5>
          <button onClick={this.addCard}>add card</button>
          <div>
            
          </div>
        </div>
        <div>
          <h5>Filters</h5>
          <button onClick={this.addFilter}>add filter</button>
          <div>
            
          </div>
        </div>
        
        <div className={filterDrawerClass}>
          <h5>Add Filter</h5>
          xxxx
        </div>
        
      </div>
    );
  }
}

export default withRouter(EditBoard);
