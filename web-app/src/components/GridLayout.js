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
      backgroundColor,
      components = [],
      showGridlines,
      isEditMode
    } = this.props;

    let style = {
      width: width + 'px',
      height: height + 'px',
      backgroundColor: backgroundColor
    };

    if (showGridlines && isEditMode) {
      style.backgroundSize = '15px 15px';
      style.backgroundImage = 'radial-gradient(rgb(23, 43, 77) 10%, transparent 10%)';
    }

    const boxItems = components.map((component, index) => 
      <GridItem
        key={index}
        snapToGrid={this.props.snapToGrid}
        isEditMode={isEditMode}
        selectedComponentId={this.props.selectedComponentId}
        reportType={this.props.reportType}
        {...component}
        onComponentMove={this.props.onComponentMove}
        onComponentEdit={this.props.onComponentEdit}
        onComponentRemove={this.props.onComponentRemove}
        onComponentFilterInputChange={this.props.onComponentFilterInputChange}
        onComponentContentClick={this.props.onComponentContentClick}
        onComponentCsvExport={this.props.onComponentCsvExport}
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