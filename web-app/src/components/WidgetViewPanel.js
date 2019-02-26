
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import GridLayout from './GridLayout';
import * as Util from '../api/Util';

const BASE_WIDTH = 1000;

class WidgetViewPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      widgets: [],
      actualWidth: 1200,
      height: 600,
      snapToGrid: false,
      showGridlines: true
    };

    this.widgetViewPanel = React.createRef();
  }

  componentDidMount() {
    this.resizeGrid();
  }

  resizeGrid = () => {
    const thisNode = ReactDOM.findDOMNode(this.refs.widgetViewPanel);
    const actualWidth = thisNode.clientWidth;
    // const height = parentNode.clientHeight;
    this.setState({
      actualWidth: actualWidth - 20,
    }, () => {
      const { widgets } = this.state;
      const newWidgets = [...widgets];
      // this.resizeWidgetsToBase(newWidgets);
      this.resizeWidgetsToActual(newWidgets);
      this.setState({
        widgets: newWidgets
      });
    });
  }

  resizeWidgetsToBase = (widgets) => {
    for (let i = 0; i < widgets.length; i++) {
      const baseX = this.scaleToBase(widgets[i].x);
      const baseWidth = this.scaleToBase(widgets[i].width);
      widgets[i].x = baseX;
      widgets[i].width = baseWidth;
    }
  }

  resizeWidgetsToActual = (widgets) => {
    for (let i = 0; i < widgets.length; i++) {
      const actualX = this.scaleToActual(widgets[i].x);
      const actualWidth = this.scaleToActual(widgets[i].width);
      widgets[i].x = actualX;
      widgets[i].width = actualWidth;
    }
  }

  fetchWidgets = (dashboardId, filterParams) => {
    if (dashboardId === null) {
      return;
    }

    axios.get('/ws/widget/dashboard/' + dashboardId)
      .then(res => {
        const result = res.data;
        this.setState({
          widgets: result,
        }, this.queryWidgets(filterParams));
      });
  }

  queryWidgets = (filterParams) => {
    console.log('queryWidgets', filterParams);
    const params = filterParams === null ? [] : filterParams;
    const { widgets } = this.state;
    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i];
      axios.post('/ws/jdbcquery/widget/' + widget.id, params)
        .then(res => {
          const result = res.data;
          const index = widgets.findIndex(w => w.id === result.id);
          const newWidgets = [...widgets];
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

  save = () => {
    const { widgets } = this.state;
    const newWidgets = [...widgets];
    this.resizeWidgetsToBase(newWidgets);
    console.log('save', newWidgets);
  }

  onWidgetMove = (widget) => {
    console.log('onWidgetMove', widget);
    const { widgets } = this.state;
    const index = widgets.findIndex(w => w.id === widget.id);
    const newWidgets = [...widgets];
    newWidgets[index].x = widget.x;
    newWidgets[index].y = widget.y;
    newWidgets[index].width = widget.width;
    newWidgets[index].height = widget.height;
    this.setState({
      widgets: newWidgets
    });

    // FIXME: use save button to update position and size of all widgets at the same time.
    // axios.post('/ws/widget/position', widget)
    //   .then(res => {
    //  });
      
  }

  onWidgetRemove = (widgetId) => {
    axios.delete('/ws/widget/' + widgetId)
      .then(res => {
        const { widgets } = this.state;
        const index = widgets.findIndex(w => w.id === widgetId);
        const newWidgets = [...widgets];
        newWidgets.splice(index, 1);
        this.setState({
          widgets: newWidgets
        });
      });
  }

  render() {
    const widgetItems = this.state.widgets.map((widget, index) => {
      
      const headers = [];
      const queryResult = widget.queryResult;
      if (!Util.isArrayEmpty(queryResult)) {
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
      <div 
        ref={this.widgetViewPanel} 
        className="testPanel">

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
        
        <GridLayout 
          width={this.state.actualWidth}
          height={this.state.height}
          snapToGrid={this.state.snapToGrid}
          showGridlines={this.state.showGridlines}
          widgets={this.state.widgets}
          onWidgetMove={this.onWidgetMove}
          onWidgetEdit={this.props.onWidgetEdit} 
          onWidgetRemove={this.onWidgetRemove} />
      </div>
    )
  };
}

export default WidgetViewPanel;