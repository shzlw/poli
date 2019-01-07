
import React, { Component } from 'react';
import axios from 'axios';


class EditDataSource extends Component {

  constructor(props){
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      id: 0,
      name: '',
      connectionUrl: '',
      username: '',
      password: '',
      type: '',
      ping: '',
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
    const ds = {
      connectionUrl: this.state.connectionUrl,
      username: this.state.username,
      password: this.state.password,
      name: this.state.name,
      type: this.state.password,
      ping: this.state.ping
    };

    const { router } = this.props;

    axios.post('/ws/jdbcdatasource', ds)
      .then(res => {
        this.reset();
        router.push('/datasources');
      });
  }

  reset = () => {
    this.setState(this.initialState);
  }

  ping = () => {
    
  }

  render() {

    return (
      <div>
        <h1>{this.state.mode} Data Source</h1>
        

        

        <div>
          <button type="primary" onClick={this.save}>Save</button>
          <button type="primary" onClick={this.ping}>Ping</button>
        </div>

      </div>
    );
  }
}

export default EditDataSource;
