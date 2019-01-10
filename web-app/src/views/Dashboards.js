
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import axios from 'axios';


class Dashboard extends Component {

  state = { 
    dashboards: [],
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

  save = () => {

  }

  update = (dashboardId) => {
    this.props.history.push(`/dashboard/edit/${dashboardId}`);
  }

  delete = () => {

  }

  jump = () => {
    this.props.history.push('/overview');
  }


  render() {

    const dashboardRows = this.state.dashboards.map((d, index) => 
      <tr key={index}>
        <td>{d.id}</td>
        <td>{d.name}</td>
        <td><button onClick={() => this.update(d.id)}>update</button></td>
      </tr>
    );

    return (
      <div>
        Board
        <button onClick={this.jump}>Overview</button>
        <button onClick={() => this.props.history.push('/dashboard/new')}>New</button>

        <table>
          <thead>
          </thead>
          <tbody>
            {dashboardRows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(Dashboard);
