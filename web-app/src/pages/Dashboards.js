
import React, { Component } from 'react';
import { Checkbox, DatePicker } from 'antd';

const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;


class Dashboard extends Component {

  onChange = () => {
    console.log('test');
  }

  checkboxOnChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  }

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <button>Add</button>
        <div>
          <div>public</div>
          <div>private</div>
          
        </div>
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
        <br />

        <RangePicker 
            onChange={this.onChange} />
        
      </div>
    );
  }
}

export default Dashboard;
