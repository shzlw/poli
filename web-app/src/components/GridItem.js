import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import ReactEcharts from 'echarts-for-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as EchartsApi from '../api/EchartsApi';
import * as Util from '../api/Util';
import * as Constants from '../api/Constants';

import GridDraggable from './GridDraggable';
import GridResizable from './GridResizable';
import TableWidget from './TableWidget';
import Slicer from './filters/Slicer';

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
        const drills = instance.props.widgetDrillThrough || []; 
        console.log('onTableTdPropsChange', header, value, drills);
        const index = drills.findIndex(d => d.columnName === header);
        if (index !== -1) {
          const dashboardId = drills[index].dashboardId;
          this.props.history.push(`/workspace/dashboard/${dashboardId}?${header}=${value}`);
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

  onTableTdClick = (link) => {
    this.props.history.push(link);
  }

  onSlicerChange = (widgetId, checkBoxes) => {
    const data = {
      checkBoxes: checkBoxes
    };
    this.props.onWidgetFilterInputChange(widgetId, data);
  }

  onSingleValueChange = (widgetId, event) => {
    const value = event.target.value;
    const data = {
      value: value
    };
    this.props.onWidgetFilterInputChange(widgetId, data);
  }

  renderWidgetContent = () => {
    const onChartEvents = {
      'click': this.onChartClick,
      'legendselectchanged': this.onChartLegendselectchanged
    };

    const { 
      id,
      type,
      chartType,
      filterType,
      queryResult = {},
      drillThrough,
      data = {},
      checkBoxes,
      value
    } = this.props;

    const queryResultData = Util.jsonToArray(queryResult.data);
    const columns = queryResult.columns || [];
    const error = queryResult.error;

    let widgetItem = (<div></div>);
    if (type === Constants.CHART) {
      if (chartType === Constants.TABLE) {
        widgetItem = (
          <TableWidget
            data={queryResultData}
            columns={columns}
            error={error}
            drillThrough={drillThrough}
            onTableTdClick={this.onTableTdClick}
          />
        );
      } else if (chartType === Constants.PIE) {
        const { 
          pieKey,
          pieValue
        } = data;
        const chartOption = EchartsApi.getPieOption(queryResultData, pieKey, pieValue);
        widgetItem = (
          <ReactEcharts 
            option={chartOption}   
            className="echarts"
            onEvents={onChartEvents}  
          />
        );
      } 
    } else if (type === Constants.FILTER) {
      if (filterType === Constants.SLICER) {
        widgetItem = (
          <div className="grid-box-content-panel">
            <Slicer 
              id={id} 
              checkBoxes={checkBoxes} 
              onChange={this.onSlicerChange} 
            />
          </div>
        );
      } else if (filterType === Constants.SINGLE_VALUE) {
        widgetItem = (
          <div className="grid-box-content-panel">
            <input 
              type="text"  
              value={value}
              onChange={(event) => this.onSingleValueChange(id, event)} 
            />
          </div>
        );
      }
    }
    
    return widgetItem;
  }

  render() {
    const {
      id,
      title,
      isEditMode,
      style = {}
    } = this.props;

    const { 
      showBorder = false,
      showTitle = true
    } = style;

    const borderStyle = showBorder ? '2px solid #091E42' : '2px solid transparent';

    let styles = {
      left: this.props.x + 'px',
      top: this.props.y + 'px',
      width: this.props.width + 'px',
      height: this.props.height + 'px',
      zIndex: 1,
      border: borderStyle
    };

    /*
    <div className="grid-box-file-button-group">
      <div className="inline-block" onClick={() => this.exportJson(id)}>
        <FontAwesomeIcon icon="file-export" fixedWidth />
      </div>
      
      <div className="inline-block" onClick={() => this.exportCsv(id)}>
        <FontAwesomeIcon icon="file-csv" fixedWidth />
      </div>
    </div>
    */

    return (
      <div className="grid-box" style={styles}>
        <div className="grid-box-title">
          <div className="grid-box-title-value float-left ellipsis">{title}</div>

          { isEditMode && (
            <div className="float-right" style={{marginRight: '20px'}}>
              <div className="grid-box-icon inline-block" onClick={() => this.editWidget(id)}>
                <FontAwesomeIcon icon="edit" fixedWidth />
              </div>
              <div className="grid-box-icon inline-block" onClick={() => this.removeWidget(id)}>
                <FontAwesomeIcon icon="trash-alt" fixedWidth />
              </div>
            </div>
          )}
          
        </div>

        <div className="grid-box-content">
          {this.renderWidgetContent()}
        </div>

        { isEditMode && (
          <GridDraggable 
            onMouseUp={this.onMouseUp}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            mode={this.state.mode}
            snapToGrid={this.props.snapToGrid} 
          />
        )}

        { isEditMode && (
          <GridResizable 
            onMouseUp={this.onMouseUp}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            mode={this.state.mode} 
          />
        )}
        
      </div>
    )
  }
}

export default withRouter(GridItem);