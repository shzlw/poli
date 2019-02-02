
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import axios from 'axios';


class Dashboard extends Component {

  state = { 
    dashboards: [],
    showEditPanel: false,
    name: ''
  };

  componentDidMount() {
    this.fetchBoards();
  }

  fetchBoards = () => {
    axios.get('/ws/dashboard')
      .then(res => {
        const dashboards = res.data;
        this.setState({ 
          dashboards: dashboards 
        });
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

  save = () => {
    const dashboard = {
      name: this.state.name
    };

    axios.post('/ws/dashboard', dashboard)
      .then(res => {
        const dashboardId = res.data;
        this.props.history.push(`/dashboard/edit/${dashboardId}`);
      });
  }

  update = (dashboardId) => {
    this.props.history.push(`/dashboard/edit/${dashboardId}`);
  }

  delete = (dashboardId) => {
    console.log('delete', dashboardId);
    axios.delete('/ws/dashboard/' + dashboardId)
      .then(res => {
        this.fetchBoards();
      });
  }

  jump = () => {
    this.props.history.push('/overview');
  }

  render() {
    const panelClass = this.state.showEditPanel ? 'right-drawer display-block' : 'right-drawer display-none';

    const dashboardRows = this.state.dashboards.map((d, index) => 
      <tr key={index}>
        <td>{d.id}</td>
        <td>{d.name}</td>
        <td><button onClick={() => this.update(d.id)}>update</button></td>
        <td><button onClick={() => this.delete(d.id)}>delete</button></td>
      </tr>
    );

    return (
      <div>
        Board
        <button onClick={this.jump}>Overview</button>
        <button onClick={() => this.setState({ showEditPanel: true })}>Add</button>

        <table>
          <thead>
          </thead>
          <tbody>
            {dashboardRows}
          </tbody>
        </table>

        <div className={panelClass}>
          <div>New dashboard</div>
          <button onClick={() => this.setState({showEditPanel: false })}>Close</button>
          <button onClick={this.save}>Save</button>
          <form>
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange} />
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Dashboard);
