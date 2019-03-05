import React from 'react';
import ReactDOM from 'react-dom';

const MIN_WIDTH = 30;
const MIN_HEIGHT = 30;
const WIDGET_BORDER = 2;

class GridResizable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentX: 0,
      currentY: 0,
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
    const currentX = event.clientX;
    const currentY = event.clientY;
    
    const { ownerDocument } = thisNode;
    ownerDocument.addEventListener('mouseup', this.onMouseUp);
    ownerDocument.addEventListener('mousemove', this.onMouseMove);
    this.setState({
      currentX: currentX,
      currentY: currentY
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
    event.preventDefault();
    if (this.props.mode !== 'resize') {
      return; 
    }

    let xOffset = event.clientX - this.state.currentX;
    let yOffset = event.clientY - this.state.currentY;

    const thisNode = ReactDOM.findDOMNode(this);
    const gridItemNode = thisNode.parentNode;
    const prevWidth = parseInt(gridItemNode.style.width, 10);
    const prevHeight = parseInt(gridItemNode.style.height, 10);

    const containerNode = gridItemNode.parentNode;
    const containerWidth = containerNode.clientWidth;
    const containerHeight = containerNode.clientHeight;

    let newWidth = Math.floor(prevWidth + xOffset);
    let newHeight = Math.floor(prevHeight + yOffset);

    if (newWidth < MIN_WIDTH) {
      newWidth = MIN_WIDTH;
    }
    
    if (newHeight < MIN_HEIGHT) {
      newHeight = MIN_HEIGHT;
    }

    const left = gridItemNode.offsetLeft + WIDGET_BORDER * 2;
    const top = gridItemNode.offsetTop + WIDGET_BORDER * 2;

    if (newWidth +  left > containerWidth) {
      newWidth = containerWidth - left;
    }

    if (newHeight + top > containerHeight) {
      newHeight = containerHeight - top;
    }

    gridItemNode.style.width = newWidth + 'px';
    gridItemNode.style.height = newHeight + 'px';

    this.setState({
      currentX: event.clientX,
      currentY: event.clientY
    });
  }

  render() {
    return (
      <div 
        className="grid-resizable"
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp} >
        <i class="fas fa-compress fa-fw"></i>
      </div>
    )
  }
}

export default GridResizable;