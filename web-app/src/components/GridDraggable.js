import React from 'react';
import ReactDOM from 'react-dom';

const COMPONENT_BORDER = 2;

class GridDraggable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      xOffset: 0,
      yOffset: 0
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
    event.preventDefault();
    const thisNode = ReactDOM.findDOMNode(this);
    const gridItemNode = thisNode.parentNode;
    const xOffset = event.clientX - gridItemNode.offsetLeft;
    const yOffset = event.clientY - gridItemNode.offsetTop;
   
    const { ownerDocument } = gridItemNode;
    ownerDocument.addEventListener('mouseup', this.onMouseUp);
    ownerDocument.addEventListener('mousemove', this.onMouseMove);
    this.setState({
      xOffset: xOffset,
      yOffset: yOffset
    });

    // Select first then allow to drag.
    if (this.props.isSelected) {
      this.props.onMouseDown('drag');
    }
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
    event.preventDefault();
    if (this.props.mode !== 'drag') {
      return; 
    }

    let gridCell = 1;
    if (this.props.snapToGrid) {
      gridCell = 4;
    }

    const thisNode = ReactDOM.findDOMNode(this);
    const gridItemNode = thisNode.parentNode;
    let currentX = event.clientX - this.state.xOffset;
    let currentY = event.clientY - this.state.yOffset;
    
    const containerNode = gridItemNode.parentNode;
    const containerWidth = containerNode.clientWidth;
    const containerHeight = containerNode.clientHeight;
    
    let boxWidth = parseInt(gridItemNode.style.width, 10) + COMPONENT_BORDER * 2;
    let boxHeight = parseInt(gridItemNode.style.height, 10) + COMPONENT_BORDER * 2;

    if (currentX < 0) {
      currentX = 0;
    }
    if (currentY < 0) {
      currentY = 0;
    }
    if (currentX + boxWidth > containerWidth) {
      currentX = containerWidth - boxWidth;
    }
    if (currentY + boxHeight > containerHeight) {
      currentY = containerHeight - boxHeight;
    }

    currentX = Math.floor(currentX / gridCell) * gridCell;
    currentY = Math.floor(currentY / gridCell) * gridCell;

    gridItemNode.style.left = currentX + 'px';
    gridItemNode.style.top = currentY + 'px';
  }

  render() {
    return (
      <div className="grid-draggable"
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}>
        {this.props.children}
      </div>
    )
  }
}

export default GridDraggable;