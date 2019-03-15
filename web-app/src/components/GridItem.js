import React from 'react';
import ReactDOM from 'react-dom';
import GridDraggable from './GridDraggable';
import GridResizable from './GridResizable';

import { withRouter } from 'react-router-dom';


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
    event.preventDefault();   
  }

  editWidget = (widgetId) => {
    this.props.onWidgetEdit(widgetId);
  }

  exportCsv = (widgetId) => {

  }

  exportJson = (widgetId) => {

  }

  removeWidget = (widgetId) => {
    this.props.onWidgetRemove(widgetId);
  }

  onTableTdPropsChange = (state, rowInfo, column, instance) => {
    return {
      onClick: (e, handleOriginal) => {
        console.log("A Td Element was clicked!");
        console.log("it produced this event:", e);
        console.log("It was in this column:", column);
        console.log("It was in this row:", rowInfo);
        console.log("It was in this table instance:", instance);
        
        const header = column.Header;
        const row = rowInfo.row;
        const value = row[header];
        const drills = instance.props.widgetDrillThrough; 
        console.log('onTableTdPropsChange', header, value, drills);
        if (!Util.isArrayEmpty(drills)) {
          const index = drills.findIndex(d => d.columnName === header);
          if (index !== -1) {
            const dashboardId = drills[index].dashboardId;
            this.props.history.push(`/dashboards/${dashboardId}?${header}=${value}`);
          }
        }
      }
    };
  }

  onChartClick = (param, echarts) => {
    console.log('onChartClick', param, echarts);
  };

  onChartLegendselectchanged = (param, echart) => {
    console.log('onChartLegendselectchanged', param, echart);
  };

  renderWidgetContent = () => {
    const onChartEvents = {
      'click': this.onChartClick,
      'legendselectchanged': this.onChartLegendselectchanged
    };

    const { 
      chartType,
      queryResult,
      drillThrough
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
          getTdProps={this.onTableTdPropsChange}
          widgetDrillThrough={drillThrough}  
        />
      );
    } else if (chartType === Constants.PIE) {
      const { 
        name,
        value
      } = this.props.data;
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
            className="echarts"
            onEvents={onChartEvents}  />
        );
      }
      
    } 

    return widgetItem;
  }

  render() {
    let styles = {
      left: this.props.x + 'px',
      top: this.props.y + 'px',
      width: this.props.width + 'px',
      height: this.props.height + 'px',
      zIndex: 1
    };

    return (
      <div className="grid-box" style={styles}>
        <div className="grid-box-title">
          {this.props.name}

          { this.props.isEditMode ? (
            <div className="icon-button-group" style={{marginRight: '20px'}}>
              <div className="icon-btn" onClick={() => this.editWidget(this.props.id)}>
                <i className="fas fa-edit fa-fw"></i>
              </div>
              <div className="icon-btn" onClick={() => this.removeWidget(this.props.id)}>
                <i className="fas fa-trash-alt fa-fw"></i>
              </div>
            </div>
          ) : (
            <div className="icon-button-group" style={{marginRight: '20px'}}>
              <div className="icon-btn" onClick={() => this.exportJson(this.props.id)}>
                <i class="fas fa-file-export fa-fw"></i>
              </div>
              <div className="icon-btn" onClick={() => this.exportCsv(this.props.id)}>
                <i className="fas fa-file-csv fa-fw"></i>
              </div>
            </div>
          )}
          
        </div>
        <div className="grid-box-content">
          {this.renderWidgetContent()}
        </div>

        { this.props.isEditMode ? (
          <GridDraggable 
            onMouseUp={this.onMouseUp}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            mode={this.state.mode}
            snapToGrid={this.props.snapToGrid} />
        ): null}

        { this.props.isEditMode ? (
          <GridResizable 
            onMouseUp={this.onMouseUp}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            mode={this.state.mode} />
        ): null}
        
      </div>
    )
  }
}

export default withRouter(GridItem);