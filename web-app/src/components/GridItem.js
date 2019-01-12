import React from 'react';
import ReactDOM from 'react-dom';
import GridDraggable from './GridDraggable';
import GridResizable from './GridResizable';

import ReactTable from 'react-table';
import 'react-table/react-table.css';


class GridItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      x: this.props.x,
      y: this.props.y,
      mode: ''
    };
  }

  componentWillUnmount() {
    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode) {
      const { ownerDocument } = thisNode;
      ownerDocument.removeEventListener('mousedown', this.onMouseDown);
      ownerDocument.removeEventListener('mouseup', this.onMouseUp);
      ownerDocument.removeEventListener('mousemove', this.onMouseMove);
    }
  }

  onMouseDown = (mode) => {
    console.log('GridItem onMouseDown', mode);
    this.setState({
      mode: mode
    });
  }

  onMouseUp = () => {
    console.log('GridItem onMouseUp');
    this.setState({
      mode: ''
    });
  }

  onMouseMove = (event, mode, state) => {
    console.log('GridItem onMouseMove', event);
    event.preventDefault();   
  }

  render() {
    let styles = {
      left: this.state.x,
      top: this.state.y,
      width: this.props.width,
      height: this.props.height,
      backgroundColor: '#f1f1f1',
      position: 'absolute',
      zIndex: 1
    };

    const data = [
      {firstName: 'a1', lastName: 'b1'},
      {firstName: 'a2', lastName: 'b2'},
      {firstName: 'a3', lastName: 'b3'}
    ];

    return (
      <div className="grid-box" style={styles}>
        <div className="grid-box-title">
          {this.props.title}
        </div>
        <GridDraggable 
          onMouseUp={this.onMouseUp}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          mode={this.state.mode} />
          
          <ReactTable
            data={data}
            columns={[
              {
                Header: "First Name",
                accessor: "firstName"
              },
              {
                Header: "Last Name",
                accessor: "lastName"
              },
            ]}
            defaultPageSize={10}
          />
        <GridResizable 
          onMouseUp={this.onMouseUp}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          mode={this.state.mode} />
      </div>
    )
  }
}

export default GridItem;