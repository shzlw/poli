import React from 'react';
import ReactDOM from 'react-dom';
import ReactEcharts from 'echarts-for-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as EchartsApi from '../api/EchartsApi';
import * as Util from '../api/Util';
import * as Constants from '../api/Constants';

import GridDraggable from './GridDraggable';
import GridResizable from './GridResizable';
import Table from './Table';
import Slicer from './filters/Slicer';
import ImageBox from './widgets/ImageBox';
import Iframe from './widgets/Iframe';
import TextBox from './widgets/TextBox';

class GridItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: '',
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
    this.setState({
      mode: mode,
    });
  }

  onMouseUp = () => {
    this.setState({
      mode: '',
    });

    const thisNode = ReactDOM.findDOMNode(this);
    const x = thisNode.offsetLeft;
    const y = thisNode.offsetTop;
    const width = parseInt(thisNode.style.width, 10);
    const height = parseInt(thisNode.style.height, 10);
    const componentId = this.props.id;

    const component = {
      id: componentId,
      x: x,
      y: y,
      width: width,
      height: height
    }

    this.props.onComponentMove(component);
  }

  onMouseMove = (event, mode, state) => {
    event.preventDefault();   
  }

  editComponent = (componentId) => {
    this.props.onComponentEdit(componentId);
  }

  exportCsv = (componentId) => {

  }

  exportJson = (componentId) => {

  }

  removeComponent = (componentId) => {
    this.props.onComponentRemove(componentId);
  }

  onChartClick = (param, echarts) => {
    const {
      drillThrough = [],
      data = {}
    } = this.props;

    if (drillThrough.length === 0) {
      return;   
    }

    const { 
      key,
    } = data;
    const columnName = key;
    const columnValue = param.name;

    const index = drillThrough.findIndex(d => d.columnName === columnName);
    if (index === -1) {
      return;
    }
    
    const reportId = drillThrough[index].reportId;
    const componentClickEvent = {
      type: 'chartClick',
      data: {
        reportId: reportId,
        columnName: columnName,
        columnValue: columnValue
      }
    }
    this.props.onComponentContentClick(componentClickEvent);
  };

  onChartLegendselectchanged = (param, echart) => {
  };

  onTableTdClick = (reportId, columnName, columnValue) => {
    const componentClickEvent = {
      type: 'tableTdClick',
      data: {
        reportId: reportId,
        columnName: columnName,
        columnValue: columnValue
      }
    }
    this.props.onComponentContentClick(componentClickEvent);
  }

  onSlicerChange = (componentId, checkBoxes) => {
    const data = {
      checkBoxes: checkBoxes
    };
    this.props.onComponentFilterInputChange(componentId, data);
  }

  onSingleValueChange = (componentId, event) => {
    const value = event.target.value;
    const data = {
      value: value
    };
    this.props.onComponentFilterInputChange(componentId, data);
  }

  renderComponentContent = () => {
    const onChartEvents = {
      'click': this.onChartClick,
      'legendselectchanged': this.onChartLegendselectchanged
    };

    const { 
      id,
      type,
      subType,
      queryResult = {},
      drillThrough,
      data = {},
      checkBoxes,
      value
    } = this.props;

    const queryResultData = Util.jsonToArray(queryResult.data);
    const {
      columns = [],
      error
    } = queryResult;

    if (error) {
      return (<div>{error}</div>);
    }
    
    let componentItem = (<div></div>);
    if (type === Constants.CHART) {
      if (subType === Constants.TABLE) {
        const { defaultPageSize } = data;
        componentItem = (
          <Table
            data={queryResultData}
            columns={columns}
            defaultPageSize={defaultPageSize}
            drillThrough={drillThrough}
            onTableTdClick={this.onTableTdClick}
          />
        );
      } else {
        const chartOption = EchartsApi.getChartOption(subType, queryResultData, data);
        componentItem = (
          <ReactEcharts 
            option={chartOption}   
            notMerge={true}
            lazyUpdate={true}
            className="echarts"
            onEvents={onChartEvents}  
          />
        );
      } 
    } else if (type === Constants.FILTER) {
      if (subType === Constants.SLICER) {
        componentItem = (
          <div className="grid-box-content-panel">
            <Slicer 
              id={id} 
              checkBoxes={checkBoxes} 
              onChange={this.onSlicerChange} 
            />
          </div>
        );
      } else if (subType === Constants.SINGLE_VALUE) {
        componentItem = (
          <div className="grid-box-content-panel">
            <input 
              className="form-input"
              type="text"  
              value={value}
              onChange={(event) => this.onSingleValueChange(id, event)}
              className="filter-input" 
            />
          </div>
        );
      }
    } else if (type === Constants.STATIC) {
      if (subType === Constants.IMAGE) {
        const { 
          src = '' 
        } = data;
        componentItem = (
          <ImageBox src={src} />
        );
      } else if (subType === Constants.IFRAME) {
        const {
          title = '', 
          src = ''
        } = data;
        componentItem = (
          <Iframe title={title} src={src} />
        );
      } else if (subType === Constants.TEXT) {
        const { 
          fontSize = 16,
          fontColor = '#000000',
          value = ''
        } = data;
        componentItem = (
          <TextBox 
            fontSize={fontSize} 
            fontColor={fontColor}
            value={value}
          />
        );
      }
    }
    
    return componentItem;
  }

  render() {
    const {
      id,
      title,
      isEditMode,
      style = {},
      drillThrough,
    } = this.props;

    const { 
      showBorder = false,
      showTitle = true,
      borderColor,
      titleFontColor,
      titleBackgroundColor,
      contentBackgroundColor,
      zIndex
    } = style;

    let borderStyle;
    if (isEditMode && (this.state.mode !== '' || this.props.selectedComponentId === id)) {
      borderStyle = '2px dashed ' + Constants.COLOR_SLATE;
    } else {
      borderStyle = showBorder ? `2px solid ${borderColor}` : '2px solid transparent';
    }

    let gridBoxStyle = {
      left: this.props.x + 'px',
      top: this.props.y + 'px',
      width: this.props.width + 'px',
      height: this.props.height + 'px',
      zIndex: zIndex,
      border: borderStyle
    };

    const hasDrillThrough = !Util.isArrayEmpty(drillThrough);

    const titleStyle = {
      color: titleFontColor,
      backgroundColor: titleBackgroundColor
    };

    let titleValueStyle = {};
    if (showTitle && isEditMode) {
      titleValueStyle = {marginRight: '60px'};
    }

    const contentStyle = {
      backgroundColor: contentBackgroundColor
    }

    return (
      <div className="grid-box" style={gridBoxStyle}>
        { isEditMode && (
          <GridDraggable 
            onMouseUp={this.onMouseUp}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            mode={this.state.mode}
            snapToGrid={this.props.snapToGrid} 
          />
        )}

        { showTitle && (
          <div className="grid-box-title" style={titleStyle}>
            <div className="grid-box-title-value ellipsis" style={titleValueStyle}>{title}</div>
          </div>
        )}

        { isEditMode && (
          <div className="grid-edit-panel" style={{zIndex: 20}}>
            <div className="cursor-pointer inline-block" style={{marginRight: '3px'}} onClick={() => this.editComponent(id)}>
              <FontAwesomeIcon icon="wrench" fixedWidth />
            </div>
            <div className="cursor-pointer inline-block" onClick={() => this.removeComponent(id)}>
              <FontAwesomeIcon icon="trash-alt" fixedWidth />
            </div>
          </div>
        )}

        { !isEditMode && hasDrillThrough && (
          <div className="grid-edit-panel grid-box-icon inline-block">
            <FontAwesomeIcon icon="long-arrow-alt-right" fixedWidth />
          </div>
        )}
        
        <div className="grid-box-content" style={contentStyle}>
          {this.renderComponentContent()}
        </div>

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

export default GridItem;