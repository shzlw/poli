
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Board extends Component {

  state = { 
    boards: [],
    id: 0,
    name: ''
  };

  componentDidMount() {
    this.fetchBoards();
  }

  fetchBoards = () => {

  }

  save = () => {
    const board = {
      id: this.state.id,
      name: this.state.name
    };
  }

  update = () => {

  }

  delete = () => {

  }

  jump = () => {
    this.props.history.push('/overview');
  }


  render() {
    return (
      <div>
        Board
        <button onClick={this.jump}>Overview</button>
        <button onClick={() => this.props.history.push('/board/edit')}>Editboard</button>
        
      </div>
    );
  }
}

export default withRouter(Board);
