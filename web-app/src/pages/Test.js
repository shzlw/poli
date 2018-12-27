
import React, { Component } from 'react';
import RGL, { WidthProvider } from "react-grid-layout";



import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;
const ReactGridLayout = WidthProvider(RGL);

class Test extends Component {

  static defaultProps = {
    className: "layout",
    items: 20,
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: 12
  };

  constructor(props) {
    super(props);

    const layout = this.generateLayout();
    this.state = { layout };
  }


  generateLayout() {
    return [
      {i: 'a', x: 0, y: 0, w: 1, h: 2},
      {i: 'b', x: 1, y: 0, w: 3, h: 2},
      {i: 'c', x: 4, y: 0, w: 1, h: 2}
    ];
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  render() {
    return (
      <div>
        <ReactGridLayout 
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          {...this.props}>

          <div key="a">
            <div className="testGrid">
              <RangePicker />
            </div>
          </div>
          <div key="b">
            <div className="testGrid">
              b
            </div>
          </div>
          <div key="c">
            <div className="testGrid">
              c
            </div>
          </div>
        </ReactGridLayout>
      </div>
    )
  }
}

export default Test;
