
import React from 'react';
import axios from 'axios';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

class WidgetViewPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dashboardId: null,
      widgets: []
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
        {widgetItems}
      </div>
    )
  };
}

export default WidgetViewPanel;