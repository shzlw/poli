
import React, { Component } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class EditDataSource extends Component {

  componentDidMount() {
    const id = this.props.match.params.id;
    console.log("id", id);
  }

  render() {
    return (
      <div>
        <h1>Edit Data Source</h1>
        <button>Save</button>

        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a person"
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="tom">Tom</Option>
        </Select>,
      </div>
    );
  }
}

export default EditDataSource;
