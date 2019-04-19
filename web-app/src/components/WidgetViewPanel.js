
import React from 'react';
import axios from 'axios';

import ColorPicker from './ColorPicker';
import Checkbox from './Checkbox';

import GridLayout from './GridLayout';
import * as Util from '../api/Util';
import Modal from '../components/Modal';
import * as Constants from '../api/Constants';


const BASE_WIDTH = 1200;

class WidgetViewPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      widgets: [],
      gridWidth: 1200,
      snapToGrid: false,
      showGridlines: false,
      showConfirmDeletionPanel: false,
      objectToDelete: {}
    };
  }

  componentDidMount() {
  }

  resizeGrid = (viewWidth) => {
    const { widgets } = this.state;
    const newWidgets = [...widgets];

    const gridWidth = viewWidth - 10;
    this.resizeWidgetsToActual(newWidgets, gridWidth);
    this.setState({
      widgets: newWidgets,
      gridWidth: gridWidth
    });
  }

  resizeWidgetsToBase = (widgets, gridWidth) => {
    for (let i = 0; i < widgets.length; i++) {
      const baseX = this.scaleToBase(widgets[i].x, gridWidth);
      const baseWidth = this.scaleToBase(widgets[i].width, gridWidth);
      widgets[i].x = baseX;
      widgets[i].width = baseWidth;
    }
  }

  resizeWidgetsToActual = (widgets, gridWidth) => {
    for (let i = 0; i < widgets.length; i++) {
      const actualX = this.scaleToActual(widgets[i].x, gridWidth);
      const actualdWidth = this.scaleToActual(widgets[i].width, gridWidth);
      widgets[i].x = actualX;
      widgets[i].width = actualdWidth;
    }
  }

  scaleToActual = (num, gridWidth) => {
    return Math.round(num * gridWidth / BASE_WIDTH);
  }

  scaleToBase = (num, gridWidth) => {
    return Math.round(num * BASE_WIDTH / gridWidth);
  }

  fetchWidgets = (dashboardId, viewWidth) => {
    if (dashboardId === null) {
      return;
    }
    axios.get(`/ws/widget/dashboard/${dashboardId}`)
      .then(res => {
        const result = res.data;
        this.setState({
          widgets: result
        }, () => {
          this.resizeGrid(viewWidth);
          this.queryFilters();
          this.queryCharts();
        });
      });
  }
 
  queryCharts() {
    const filterParams = this.getFilterParams();
    const { widgets } = this.state;
    for (let i = 0; i < widgets.length; i++) {
      const {
        id,
        type,
      } = widgets[i];
      if (type === Constants.CHART) {
        this.queryChart(id, filterParams);
      }
    }
  }

  queryFilters() {
    const { widgets } = this.state;
    for (let i = 0; i < widgets.length; i++) {
      const {
        id,
        type,
        filterType
      }  = widgets[i];
      if (type === Constants.FILTER) {
        this.queryFilter(id, filterType);
      }
    }
  }

  queryChart(widgetId, filterParams) {
    const params = filterParams === null ? [] : filterParams;
    const { widgets } = this.state;
    axios.post(`/ws/jdbcquery/widget/${widgetId}`, params)
      .then(res => {
        const queryResult = res.data;
        const index = widgets.findIndex(w => w.id === queryResult.id);
        const newWidgets = [...widgets];
        newWidgets[index].queryResult = queryResult;
        this.setState({
          widgets: newWidgets
        });
      });
  }

  queryFilter(widgetId, filterType) {
    const { widgets } = this.state;
    if (filterType === Constants.SLICER) {
      axios.post(`/ws/jdbcquery/widget/${widgetId}`, [])
        .then(res => {
          const queryResult = res.data;
          const queryResultData = Util.jsonToArray(queryResult.data);
          const checkBoxes = [];
          for (let i = 0; i < queryResultData.length; i++) {
            const values = Object.values(queryResultData[i]);
            for (const val of values) {
              checkBoxes.push({
                value: val,
                isChecked: false
              });
            }
          }
          const index = widgets.findIndex(w => w.id === queryResult.id);
          const newWidgets = [...widgets];
          newWidgets[index].queryResult = queryResult;
          newWidgets[index].checkBoxes = checkBoxes;
          this.setState({
            widgets: newWidgets
          });
        });
    } else if (filterType === Constants.SINGLE_VALUE) {
      /*
        const values = Object.values(queryResultData);
        let value = '';
        for (const val of values) {
          value = val;
          break;
        }
        newFilters[index].value = value;
      */
      const index = widgets.findIndex(w => w.id === widgetId);
      const newWidgets = [...widgets];
      newWidgets[index].value = '';
      this.setState({
        widgets: newWidgets
      });
    }
  }

  handleCheckBoxChange = (name, isChecked) => {
    this.setState({
      [name]: isChecked
    });
  }

  handleHeightChange = (event) => {
    this.props.onHeightChange(event.target.value);
  }

  onBackgroundColorChange = (color) => {
    this.props.onBackgroundColorChange(color);
  }

  saveWidgets = () => {
    const newWidgets = JSON.parse(JSON.stringify(this.state.widgets));
    const { gridWidth } = this.state;
    this.resizeWidgetsToBase(newWidgets, gridWidth);
    axios.post('/ws/widget/position', newWidgets)
      .then(res => {
      });
  }

  onWidgetMove = (widget) => {
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
  }

  confirmDelete = () => {
    const { 
      objectToDelete
    } = this.state;
    const widgetId = objectToDelete;
    axios.delete(`/ws/widget/${widgetId}`)
      .then(res => {
        const { widgets } = this.state;
        const index = widgets.findIndex(w => w.id === widgetId);
        const newWidgets = [...widgets];
        newWidgets.splice(index, 1);
        this.setState({
          widgets: newWidgets
        });
        this.closeConfirmDeletionPanel();
      });
  }

  openConfirmDeletionPanel = (widgetId) => {
    this.setState({
      objectToDelete: widgetId,
      showConfirmDeletionPanel: true
    });
  }

  closeConfirmDeletionPanel = () => {
    this.setState({
      objectToDelete: {},
      showConfirmDeletionPanel: false
    });
  }

  onWidgetFilterInputChange = (widgetId, data) => {
    const { 
      widgets = []
    } = this.state;
    const index = widgets.findIndex(w => w.id === widgetId);
    const newWidgets = [...widgets];
    const widget = widgets[index];
    if (widget.filterType === Constants.SLICER) {
      const {
        checkBoxes
      } = data;
      newWidgets[index].checkBoxes = checkBoxes;
    } else if (widget.filterType === Constants.SINGLE_VALUE) {
      const {
        value
      } = data;
      newWidgets[index].value = value;
    }

    this.setState({
      widgets: newWidgets
    });   
  }

  /**
   * FIXME: optimize it. No need to calculate this every time.
   */
  getFilterParams = () => {
    const { 
      widgets = []
    } = this.state;
    const filterParams = [];
    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i];
      if (widget.type === Constants.FILTER) {
        const { filterType } = widget;
        const filterParam = {};
        if (filterType === Constants.SLICER) {
          const { 
            checkBoxes = []
          } = widget;
          const paramValues = [];
          for (let j = 0; j < checkBoxes.length; j++) {
            const checkBox = checkBoxes[j];
            if (checkBox.isChecked) {
              paramValues.push(checkBox.value);
            }
          }
          filterParam.value = paramValues;
          if (paramValues.length === checkBoxes.length) {
            filterParam.remark = 'select all';
          }
        } else if (filterType === Constants.SINGLE_VALUE) {
          filterParam.value = widget.value;
        }
        filterParam.param = widget.data.queryParameter;
        filterParam.type = widget.filterType;
        filterParams.push(filterParam);
      }
    }
    return filterParams;
  }

  render() {
    const { widgetViewWidth } = this.props;
    const style = {
      width: widgetViewWidth + 'px'
    }

    return (
      <div className="dashboard-content-widget-panel" style={style}>

        {this.props.isEditMode ?
        (
          <div className="dashboard-attribute-edit-panel">
            <div className="inline-block">Height:</div>
            <input 
              type="text" 
              name="height" 
              value={this.props.height}
              onChange={this.handleHeightChange} 
              className="inline-block" 
              style={{width: '200px'}}
              />

            <div>
              Background Color
              <ColorPicker value={this.props.backgroundColor} onChange={this.onBackgroundColorChange} />
            </div>

            <Checkbox name="snapToGrid" value="Snap to grid" checked={this.state.snapToGrid} onChange={this.handleCheckBoxChange} />
            <Checkbox name="showGridlines" value="Show gridlines" checked={this.state.showGridlines} onChange={this.handleCheckBoxChange} />
  
          </div>
        ) : null}
        
        <GridLayout 
          width={this.state.gridWidth}
          height={this.props.height}
          backgroundColor={this.props.backgroundColor}
          snapToGrid={this.state.snapToGrid}
          showGridlines={this.state.showGridlines}
          widgets={this.state.widgets}
          isEditMode={this.props.isEditMode}
          onWidgetMove={this.onWidgetMove}
          onWidgetEdit={this.props.onWidgetEdit} 
          onWidgetRemove={this.openConfirmDeletionPanel} 
          onWidgetFilterInputChange={this.onWidgetFilterInputChange}
        />
        
        <Modal 
          show={this.state.showConfirmDeletionPanel}
          onClose={this.closeConfirmDeletionPanel}
          modalClass={'small-modal-panel'}
          title={'Confirm Deletion'} >
          <div className="confirm-deletion-panel">
            Are you sure you want to delete this widget?
          </div>
          <button className="button" onClick={this.confirmDelete}>Delete</button>
        </Modal>
      </div>
    )
  };
}

export default WidgetViewPanel;