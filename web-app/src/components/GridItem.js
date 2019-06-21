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
import InnerHtml from './widgets/InnerHtml';
import DatePicker from './filters/DatePicker';

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

  exportCsv = (title, queryResult = {}) => {
    const queryResultData = Util.jsonToArray(queryResult.data);
    const {
      columns = [],
      error
    } = queryResult;
    if (error) {
      return;
    }

    this.convertCsv(title, columns, queryResultData);
  }

  convertCsv = (title = 'poli', columns = [], data = []) => {
    let csvHeader = '';
    for (let i = 0; i < columns.length; i++) {
      if (i !== 0) {
          csvHeader += ',';
      }
      csvHeader += columns[i].name;
    }

    let csvBody = '';
    for (let i = 0; i < data.length; i++) {
        const row = Object.values(data[i]);
        csvBody += row.join(',') + '\r\n';
    } 

    const csvData = csvHeader + '\r\n' + csvBody;
    const filename = title + '.csv';
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) { 
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  removeComponent = (componentId) => {
    this.props.onComponentRemove(componentId);
  }

  /**
   * Multiple series chart doesn't support Drill Through.
   */
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

  onDatePickerChange = (componentId, date) => { 
    const epoch = Math.round((date).getTime() / 1000);
    const data = {
      value: epoch
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
      value,
      title,
      reportType
    } = this.props;

    const queryResultData = Util.jsonToArray(queryResult.data);
    const {
      columns = [],
      error
    } = queryResult;

    if (error) {
      return (<div>{error}</div>);
    }

    const isReadOnly = reportType === Constants.CANNED;
    
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
        const chartOption = EchartsApi.getChartOption(subType, queryResultData, data, title);
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
              readOnly={isReadOnly}
            />
          </div>
        );
      } else if (subType === Constants.SINGLE_VALUE) {
        componentItem = (
          <div className="grid-box-content-panel">
            <div>
              <input 
                className="filter-input"
                type="text"  
                value={value}
                onChange={(event) => this.onSingleValueChange(id, event)}
                readOnly={isReadOnly}
              />
            </div>
          </div>
        );
      } else if (subType === Constants.DATE_PICKER) {
        const date = value ? new Date(parseInt(value, 10) * 1000) : new Date();
        componentItem = (
          <div className="grid-box-content-panel">
            <DatePicker 
              name={id}
              value={date}
              onChange={this.onDatePickerChange}
              readOnly={isReadOnly}
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
      } else if (subType === Constants.HTML) {
        const { 
          innerHtml
        } = data;
        componentItem = (
          <InnerHtml 
            html={innerHtml}
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
      queryResult = {},
      type,
      selectedComponentId
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
    if (isEditMode && (this.state.mode !== '' || selectedComponentId === id)) {
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

    let readModeButtonGroup;
    if (!isEditMode && type === Constants.CHART) {
      if (hasDrillThrough) {
        readModeButtonGroup = (
          <div className="grid-title-button-panel">
            <div className="cursor-pointer download-csv-button" style={{marginRight: '3px'}} onClick={() => this.exportCsv(title, queryResult)}>
              <FontAwesomeIcon icon="file-csv" fixedWidth />
            </div>
            <div className="inline-block">
              <FontAwesomeIcon icon="long-arrow-alt-right" fixedWidth />
            </div>
          </div>
        )
      } else {
        readModeButtonGroup = (
          <div className="grid-title-button-panel">
            <div className="cursor-pointer download-csv-button" onClick={() => this.exportCsv(title, queryResult)}>
              <FontAwesomeIcon icon="file-csv" fixedWidth />
            </div>
          </div>
        )
      }
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
            isSelected={selectedComponentId === id}
          />
        )}

        { showTitle && (
          <div className="grid-box-title" style={titleStyle}>
            <div className="grid-box-title-value ellipsis" style={titleValueStyle}>{title}</div>
          </div>
        )}

        { isEditMode && (
          <div className="grid-title-button-panel" style={{zIndex: 20}}>
            <div className="cursor-pointer inline-block" style={{marginRight: '3px'}} onClick={() => this.editComponent(id)}>
              <FontAwesomeIcon icon="wrench" fixedWidth />
            </div>
            <div className="cursor-pointer inline-block" onClick={() => this.removeComponent(id)}>
              <FontAwesomeIcon icon="trash-alt" fixedWidth />
            </div>
          </div>
        )}

        {readModeButtonGroup}
        
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