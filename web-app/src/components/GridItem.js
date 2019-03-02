import React from 'react';
import ReactDOM from 'react-dom';
import GridDraggable from './GridDraggable';
import GridResizable from './GridResizable';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import * as Util from '../api/Util';
import * as Constants from '../api/Constants';

import ReactEcharts from 'echarts-for-react';
import * as EchartsApi from '../api/EchartsApi';

class GridItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      x: this.props.x,
      y: this.props.y,
      mode: ''
    };
  }

  componentWillUnmount() {
    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode) {
      const { ownerDocument } = thisNode;
      ownerDocument.removeEventListener('mousedown', this.onMouseDown);
      ownerDocument.removeEventListener('mouseup', this.onMouseUp);
      ownerDocument.removeEventListener('mousemove', this.onMouseMove);
    }
  }

  onMouseDown = (mode) => {
    console.log('GridItem onMouseDown', mode);
    this.setState({
      mode: mode
    });
  }

  onMouseUp = () => {
    console.log('GridItem onMouseUp');
    this.setState({
      mode: ''
    });

    const thisNode = ReactDOM.findDOMNode(this);
    const x = thisNode.offsetLeft;
    const y = thisNode.offsetTop;
    const width = parseInt(thisNode.style.width, 10);
    const height = parseInt(thisNode.style.height, 10);
    const widgetId = this.props.id;

    const widget = {
      id: widgetId,
      x: x,
      y: y,
      width: width,
      height: height
    }

    this.props.onWidgetMove(widget);
  }

  onMouseMove = (event, mode, state) => {
    console.log('GridItem onMouseMove', event);
    event.preventDefault();   
  }

  editWidget = (widgetId) => {
    console.log('editWidget', widgetId);
    this.props.onWidgetEdit(widgetId);
  }

  removeWidget = (widgetId) => {
    this.props.onWidgetRemove(widgetId);
  }

  onTdPropsChange = (state, rowInfo, column, instance) => {
    return {
      onClick: (e, handleOriginal) => {
        console.log("A Td Element was clicked!");
        console.log("it produced this event:", e);
        console.log("It was in this column:", column);
        console.log("It was in this row:", rowInfo);
        console.log("It was in this table instance:", instance);

        // IMPORTANT! React-Table uses onClick internally to trigger
        // events like expanding SubComponents and pivots.
        // By default a custom 'onClick' handler will override this functionality.
        // If you want to fire the original onClick handler, call the
        // 'handleOriginal' function.
        if (handleOriginal) {
          handleOriginal();
        }
      }
    };
  }

  renderWidgetContent = () => {
    const { 
      chartType,
      queryResult 
    } = this.props;
    let widgetItem = (<div>NONE</div>);
    if (chartType === Constants.TABLE) {

      const headers = [];
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

      widgetItem = (
        <ReactTable
          data={queryResult}
          columns={headers}
          minRows={0}
          showPagination={false}
          getTdProps={this.onTdPropsChange}
        />
      );
    } else if (chartType === Constants.PIE) {
      const { 
        name,
        value
      } = this.props.data;
      console.log('Constants.PIE', this.props)
      
      if (!Util.isArrayEmpty(queryResult)) {
        let legend = [];
        let series = [];
        for (let i = 0; i < queryResult.length; i++) {
          const row = queryResult[i];
          legend.push(row[name]);
          series.push({
            name: row[name],
            value: row[value]
          });
        }
        const chartOption = EchartsApi.getPieOption(legend, series);
        widgetItem = (
          <ReactEcharts 
            option={chartOption}   
            className="echarts" />
        );
      }
      
    } 

    return widgetItem;
  }

  render() {
    let styles = {
      left: this.state.x,
      top: this.state.y,
      width: this.props.width,
      height: this.props.height,
      zIndex: 1
    };

    return (
      <div className="grid-box" style={styles}>
        <div className="grid-box-title">
          {this.props.name}

          <div className="icon-button-group" style={{marginRight: '20px'}}>
            <div className="icon-btn" onClick={() => this.editWidget(this.props.id)}>
              <i className="fas fa-edit fa-fw"></i>
            </div>
            <div className="icon-btn" onClick={() => this.removeWidget(this.props.id)}>
              <i className="fas fa-trash-alt fa-fw"></i>
            </div>
          </div>
        </div>
        <div className="grid-box-content">
          {this.renderWidgetContent()}
        </div>

        <GridDraggable 
          onMouseUp={this.onMouseUp}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          mode={this.state.mode}
          snapToGrid={this.props.snapToGrid} />

        <GridResizable 
          onMouseUp={this.onMouseUp}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          mode={this.state.mode} />
      </div>
    )
  }
}

export default GridItem;