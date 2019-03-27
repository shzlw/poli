import React from 'react';

import GridItem from './GridItem';
import './GridLayout.css';

class GridLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      width,
      height,
      backgroundColor
    } = this.props;

    let style = {
      width: width + 'px',
      height: height + 'px',
      backgroundColor: backgroundColor
    };

    if (this.props.showGridlines) {
      style.backgroundSize = '15px 15px';
      style.backgroundImage = 'radial-gradient(rgb(63, 93, 131) 10%, transparent 10%)';
    }

    const boxItems = this.props.widgets.map((widget, index) => 
      <GridItem
        key={index}
        snapToGrid={this.props.snapToGrid}
        isEditMode={this.props.isEditMode}
        {...widget}
        onWidgetMove={this.props.onWidgetMove}
        onWidgetEdit={this.props.onWidgetEdit}
        onWidgetRemove={this.props.onWidgetRemove}
      />
    );


    return (
      <div
        className="grid-layout"
        style={style} >
        {boxItems}
      </div>
    )
  }
}

export default GridLayout;