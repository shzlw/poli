import React from 'react';
import ReactDOM from 'react-dom';
import ReactEcharts from 'echarts-for-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as EchartsApi from '../api/EchartsApi';
import * as Util from '../api/Util';
import * as Constants from '../api/Constants';

import GridDraggable from './GridDraggable';
import GridResizable from './GridResizable';
import Table from './table/Table';
import Slicer from './filters/Slicer';
import ImageBox from './widgets/ImageBox';
import Iframe from './widgets/Iframe';
import InnerHtml from './widgets/InnerHtml';
import DatePicker from './filters/DatePicker';
import Card from './widgets/Card';
import Kanban from './Kanban/Kanban';

class GridItem extends React.PureComponent {

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

    this.props.onComponentCsvExport(title, columns, queryResultData);
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
    const epoch = Math.round((date).getTime());
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
        const { 
          defaultPageSize = 10,
          showPagination = true,
          fixedHeader = false
        } = data;

        let tableHeight = null;
        if (fixedHeader) {
          const {
            height,
            style = {}
          } = this.props;
          const { showTitle = true } = style; 
          tableHeight = showTitle ? height - 30 : height - 2;
        }

        componentItem = (
          <Table
            data={queryResultData}
            columns={columns}
            defaultPageSize={defaultPageSize}
            drillThrough={drillThrough}
            showPagination={showPagination}
            onTableTdClick={this.onTableTdClick}
            height={tableHeight}
          />
        );
      } else if (subType === Constants.CARD) {
        const { 
          fontSize = 16,
          fontColor = '#000000',
        } = data;
        const obj = Util.isArrayEmpty(queryResultData) ? '' : queryResultData[0];
        const value = Object.values(obj)[0];
        componentItem = (
          <Card 
            fontSize={fontSize} 
            fontColor={fontColor}
            value={value}
          />
        );
      } else if (subType === Constants.KANBAN) {
        const { 
          groupByField = '',
          blockTitleField = ''
        } = data;
        componentItem = (
          <Kanban 
            data={queryResultData} 
            groupByField={groupByField} 
            blockTitleField={blockTitleField} 
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
            <div style={{paddingTop: '5px'}}>
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
        const date = value ? new Date(parseInt(value, 10)) : new Date();
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
          src = '',
          isFull = false,
        } = data;
        componentItem = (
          <ImageBox 
            src={src}
            isFull={isFull} 
          />
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
          <Card 
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

        <div className="grid-box-content" style={contentStyle}>
          {this.renderComponentContent()}
        </div>

        {readModeButtonGroup}

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