
import React from 'react';
import axios from 'axios';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import GridLayout from './GridLayout';


class WidgetViewPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      widgets: [],
      snapToGrid: false,
      showGridlines: true
    };
  }

  fetchWidgets = (dashboardId) => {
    if (dashboardId === null) {
      return;
    }

    axios.get('/ws/widget/dashboard/' + dashboardId)
      .then(res => {
        const result = res.data;
        this.setState({
          widgets: result,
        }, this.queryWidgets);
      });
  }

  queryWidgets() {
    const widgets = this.state.widgets;
    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i];
      axios.get('/ws/jdbcquery/widget/' + widget.id)
        .then(res => {
          const result = res.data;
          const index = widgets.findIndex(w => w.id === result.id);
          const newWidgets = [...this.state.widgets];
          newWidgets[index].queryResult = JSON.parse(result.data);
          this.setState({
            widgets: newWidgets
          });
        });
    }
  }

  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const isChecked = target.checked;
    this.setState({
      [name]: isChecked
    })
  }

  onWidgetMove = (widget) => {
    console.log('onWidgetMove', widget);

    const index = this.state.widgets.findIndex(w => w.id === widget.id);
    const newWidgets = [...this.state.widgets];
    newWidgets[index].x = widget.x;
    newWidgets[index].y = widget.y;
    newWidgets[index].width = widget.width;
    newWidgets[index].height = widget.height;

    this.setState({
      widgets: newWidgets
    });
  }

  render() {

    const widgetItems = this.state.widgets.map((widget, index) => {
      
      const headers = [];
      const queryResult = widget.queryResult;
      if (queryResult !== undefined && Array.isArray(queryResult)) {
        const obj = queryResult[0];
        const keys = Object.keys(obj);
        for (const key of keys) {
          headers.push({
            Header: key,
            accessor: key
          })
        }
      }

      return (
        <div key={index}>
          <ReactTable
            data={queryResult}
            columns={headers}
            minRows={0}
            showPagination={false}
          />
        </div>);
    });

    return (
      <div className="testPanel">
        <h3>WidgetViewPanel</h3>
        <input 
          type="checkbox" 
          name="snapToGrid"
          value="snapToGrid"
          checked={this.state.snapToGrid} 
          onChange={this.handleChange}
          />
          snapToGrid
        <br/>
        <input 
          type="checkbox" 
          name="showGridlines"
          value="showGridlines"
          checked={this.state.showGridlines} 
          onChange={this.handleChange}
          />
          showGridlines
        <br/>
        
        {widgetItems}
        <div>
          <GridLayout 
            width={800}
            height={600}
            snapToGrid={this.state.snapToGrid}
            showGridlines={this.state.showGridlines}
            widgets={this.state.widgets}
            onWidgetMove={this.onWidgetMove}
            onWidgetEdit={this.props.onWidgetEdit} />
        </div>
      </div>
    )
  };
}

export default WidgetViewPanel;