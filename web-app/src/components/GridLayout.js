import React from 'react';

import GridItem from './GridItem';
import './GridLayout.css';

class GridLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    let styles = {
      width: this.props.width + 'px',
      height: this.props.height + 'px',
    };

    if (this.props.showGridlines) {
      styles.backgroundSize = '15px 15px';
      styles.backgroundImage = 'radial-gradient(rgb(63, 93, 131) 10%, transparent 10%)';
    }

    const boxItems = this.props.widgets.map((widget, index) => 
      <GridItem
        key={index}
        snapToGrid={this.props.snapToGrid}
        {...widget}
        onWidgetMove={this.props.onWidgetMove}
        onWidgetEdit={this.props.onWidgetEdit}
        onWidgetRemove={this.props.onWidgetRemove}
      />
    );


    return (
      <div
        className="grid-layout"
        style={styles} >
        {boxItems}
      </div>
    )
  }
}

export default GridLayout;