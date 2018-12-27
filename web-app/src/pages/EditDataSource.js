
import React, { Component } from 'react';
import { Select, Button } from 'antd';

class EditDataSource extends Component {

  state = this.initialState;

  get initialState() {
    return {
      id: 0,
      name: '',
      url: '',
      username: '',
      password: '',
      mode: ''
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    console.log("id", id);
    let mode = 'Edit';
    if (id === undefined) {
      mode = 'New';
    }
    this.setState({
      mode: mode
    });
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  save = (event) => {
    event.preventDefault();
    console.log(this.state.name, this.state.url, this.state.username, this.state.password);

    this.reset();
  }

  reset = () => {
    this.setState(this.initialState);
  }

  ping = () => {
    
  }

  render() {
    const Option = Select.Option;

    return (
      <div>
        <h1>{this.state.mode} Data Source</h1>
        

        <form>
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            value={this.state.name}
            onChange={this.handleInputChange} />

          <label>Url</label>
          <textarea
            row="3"
            type="text" 
            name="url" 
            value={this.state.url}
            onChange={this.handleInputChange} >
          </textarea>

          <label>Username</label>
          <input 
            type="text" 
            name="username" 
            value={this.state.username}
            onChange={this.handleInputChange} />

          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            value={this.state.password}
            onChange={this.handleInputChange} />
        </form>

        <div>
          <Button type="primary" onClick={this.save}>Save</Button>
          <Button type="primary" onClick={this.ping}>Ping</Button>
        </div>

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
