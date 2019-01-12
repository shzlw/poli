import React from 'react';

import GridItem from './GridItem';

const boxes = [
   {
    title: 'title1',
    x: 0,
    y: 0,
    width: 100,
    height: 100
  },
  {
    title: 'title2',
    x: 100,
    y: 100,
    width: 100,
    height: 100
  }
];

class GridLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      boxes: [],
      snapToGrid: false,
      showGridlines: true,
    };
  }

  componentDidMount() {
    this.setState({
      boxes: boxes
    });
  }

  render() {
    const width = 600;
    const height = 400;

    let styles = {
      width: width,
      height: height,
      position: 'relative',
      margin: '20px',
      border: '1px solid blue'
    };

    if (this.state.showGridlines) {
      styles.backgroundSize = '20px 20px';
      styles.backgroundImage = 'linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)';
    }

    const boxItems = this.state.boxes.map((box, index) => 
      <GridItem
        key={index}
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        title={box.title}
      />
    );


    return (
      <div
        style={styles} >
        {boxItems}
      </div>
    )
  }
}

export default GridLayout;