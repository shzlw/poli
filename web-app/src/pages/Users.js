
import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Checkbox, DatePicker } from 'antd';

const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

class Users extends Component {

  state = {
    layout: this.generateLayout
  }

  get generateLayout() {
    return [
      {i: 'a', x: 0, y: 0, w: 1, h: 2},
      {i: 'b', x: 1, y: 0, w: 3, h: 2},
      {i: 'c', x: 4, y: 0, w: 1, h: 2}
    ];
  }

  onLayoutChange = (layout) => {
    this.setState({
      layout: layout
    });
  }

  render() {
    return (
      <div>
        <GridLayout 
          className="layout" 
          layout={this.state.layout} 
          cols={12} 
          rowHeight={30} 
          width={1200} 
          onLayoutChange={this.onLayoutChange} 
          compactType={null} 
          preventCollision={true}
          draggableHandle={'.MyDragHandleClassName'} >

          <div key="a">
            <div className="testGrid">
              <RangePicker />
            </div>
          </div>
          <div key="b">
            <div className="testGrid">
              <CheckboxGroup style={{ width: '100%' }} onChange={this.checkboxOnChange}>
                <Checkbox value="A">A</Checkbox>
                <br/>
                <Checkbox value="B">B</Checkbox>
                <br/>
                <Checkbox value="C">C</Checkbox>
                <br/>
                <Checkbox value="D">D</Checkbox>
                <br/>
              </CheckboxGroup>
            </div>
          </div>
          <div key="c">
            <div className="testGrid">
              <div className="MyDragHandleClassName">
              handle
              </div>
              c
            </div>
          </div>
        </GridLayout>
      </div>
    )
  }
}

export default Users;
