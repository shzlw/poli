import React from 'react';
import ReactDOM from 'react-dom';

class GridResizable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      xOffset: 0,
      yOffset: 0,
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

  onMouseDown = (event) => {
    console.log('onMouseDown', event);
    event.preventDefault();
    const thisNode = ReactDOM.findDOMNode(this);
    const xOffset = event.clientX;
    const yOffset = event.clientY;
    
    const { ownerDocument } = thisNode;
    ownerDocument.addEventListener('mouseup', this.onMouseUp);
    ownerDocument.addEventListener('mousemove', this.onMouseMove);
    this.setState({
      xOffset: xOffset,
      yOffset: yOffset
    });

    this.props.onMouseDown('resize');
  }

  onMouseUp = (event) => {
    event.preventDefault();
    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode) {
      const { ownerDocument } = thisNode;
      ownerDocument.removeEventListener('mousedown', this.onMouseDown);
      ownerDocument.removeEventListener('mouseup', this.onMouseUp);
      ownerDocument.removeEventListener('mousemove', this.onMouseMove);
    }
    this.props.onMouseUp();
  }

  onMouseMove = (event) => {
    console.log('GridResizer onMouseMove', event);
    event.preventDefault();

    const thisNode = ReactDOM.findDOMNode(this);
    const gridItemNode = thisNode.parentNode;
    const prevWidth = parseInt(gridItemNode.style.width, 10);
    const prevHeight = parseInt(gridItemNode.style.height, 10);

    let currentX = event.clientX - this.state.xOffset;
    let currentY = event.clientY - this.state.yOffset;

    gridItemNode.style.width = Math.floor(prevWidth + currentX) + 'px';
    gridItemNode.style.height = Math.floor(prevHeight + currentY) + 'px';

    const xOffset = event.clientX;
    const yOffset = event.clientY;
    this.setState({
      xOffset: xOffset,
      yOffset: yOffset
    });
  }

  render() {
    return (
      <div 
        className="grid-resizable"
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp} >
      </div>
    )
  }
}

export default GridResizable;