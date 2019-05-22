
import React from 'react';
import axios from 'axios';

import GridLayout from './GridLayout';
import * as Util from '../api/Util';
import Modal from './Modal';
import * as Constants from '../api/Constants';

import './ComponentViewPanel.css';

const BASE_WIDTH = 1200;

class ComponentViewPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      components: [],
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
    const { components } = this.state;
    const newComponents = [...components];
    let gridWidth = viewWidth - 10;

    const { 
      isFixedWidth,
      fixedWidth
    } = this.props;
    if (isFixedWidth) {
      gridWidth = fixedWidth;
    } 

    
    this.resizeComponentsToActual(newComponents, gridWidth);
    this.setState({
      components: newComponents,
      gridWidth: gridWidth
    });
  }

  resizeComponentsToBase = (components, gridWidth) => {
    for (let i = 0; i < components.length; i++) {
      const baseX = this.scaleToBase(components[i].x, gridWidth);
      const baseWidth = this.scaleToBase(components[i].width, gridWidth);
      components[i].x = baseX;
      components[i].width = baseWidth;
    }
  }

  resizeComponentsToActual = (components, gridWidth) => {
    for (let i = 0; i < components.length; i++) {
      const actualX = this.scaleToActual(components[i].x, gridWidth);
      const actualdWidth = this.scaleToActual(components[i].width, gridWidth);
      components[i].x = actualX;
      components[i].width = actualdWidth;
    }
  }

  scaleToActual = (num, gridWidth) => {
    return num * gridWidth / BASE_WIDTH / 100;
  }

  scaleToBase = (num, gridWidth) => {
    return Number.parseFloat(num * BASE_WIDTH / gridWidth).toFixed(2) * 100;
  }

  fetchComponents = (reportId, viewWidth) => {
    if (reportId === null) {
      return;
    }
    axios.get(`/ws/component/report/${reportId}`)
      .then(res => {
        const result = res.data;
        this.setState({
          components: result
        }, () => {
          this.resizeGrid(viewWidth);
          this.queryFilters();
          this.queryCharts();
        });
      });
  }
 
  queryCharts(urlFilterParams = []) {
    // Append the url filter params to the existing filer params if it exists.
    const filterParams = this.getFilterParams().concat(urlFilterParams);
    const { components } = this.state;
    for (let i = 0; i < components.length; i++) {
      const {
        id,
        type,
      } = components[i];
      if (type === Constants.CHART) {
        this.queryChart(id, filterParams);
      }
    }
  }

  queryFilters() {
    const { components } = this.state;
    for (let i = 0; i < components.length; i++) {
      const {
        id,
        type,
        subType
      }  = components[i];
      if (type === Constants.FILTER) {
        this.queryFilter(id, subType);
      }
    }
  }

  queryChart(componentId, filterParams) {
    const params = filterParams === null ? [] : filterParams;
    const { components } = this.state;
    axios.post(`/ws/jdbcquery/component/${componentId}`, params)
      .then(res => {
        const queryResult = res.data;
        const index = components.findIndex(w => w.id === queryResult.id);
        const newComponents = [...components];
        newComponents[index].queryResult = queryResult;
        this.setState({
          components: newComponents
        });
      });
  }

  queryFilter(componentId, subType) {
    const { components } = this.state;
    if (subType === Constants.SLICER) {
      axios.post(`/ws/jdbcquery/component/${componentId}`, [])
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
          const index = components.findIndex(w => w.id === queryResult.id);
          const newComponents = [...components];
          newComponents[index].queryResult = queryResult;
          newComponents[index].checkBoxes = checkBoxes;
          this.setState({
            components: newComponents
          });
        });
    } else if (subType === Constants.SINGLE_VALUE) {
      const index = components.findIndex(w => w.id === componentId);
      const newComponents = [...components];
      newComponents[index].value = '';
      this.setState({
        components: newComponents
      });
    }
  }

  saveComponents = () => {
    const newComponents = JSON.parse(JSON.stringify(this.state.components));
    const { gridWidth } = this.state;
    this.resizeComponentsToBase(newComponents, gridWidth);
    axios.post('/ws/component/position', newComponents)
      .then(res => {
      });
  }

  onComponentMove = (component) => {
    const { components } = this.state;
    const index = components.findIndex(w => w.id === component.id);
    const newComponents = [...components];
    newComponents[index].x = component.x;
    newComponents[index].y = component.y;
    newComponents[index].width = component.width;
    newComponents[index].height = component.height;
    this.setState({
      components: newComponents
    }, () => {
      // FIXME: only save this component. Not all.
      this.saveComponents();
    });
  }

  confirmDelete = () => {
    const { 
      objectToDelete
    } = this.state;
    const componentId = objectToDelete;
    axios.delete(`/ws/component/${componentId}`)
      .then(res => {
        const { components } = this.state;
        const index = components.findIndex(w => w.id === componentId);
        const newComponents = [...components];
        newComponents.splice(index, 1);
        this.setState({
          components: newComponents
        });
        this.closeConfirmDeletionPanel();
      });
  }

  openConfirmDeletionPanel = (componentId) => {
    this.setState({
      objectToDelete: componentId,
      showConfirmDeletionPanel: true
    });
  }

  closeConfirmDeletionPanel = () => {
    this.setState({
      objectToDelete: {},
      showConfirmDeletionPanel: false
    });
  }

  onComponentFilterInputChange = (componentId, data) => {
    const { 
      components = []
    } = this.state;
    const index = components.findIndex(w => w.id === componentId);
    const newComponents = [...components];
    const component = components[index];
    if (component.subType === Constants.SLICER) {
      const {
        checkBoxes
      } = data;
      newComponents[index].checkBoxes = checkBoxes;
    } else if (component.subType === Constants.SINGLE_VALUE) {
      const {
        value
      } = data;
      newComponents[index].value = value;
    }

    this.setState({
      components: newComponents
    });   
  }

  /**
   * FIXME: optimize it. No need to calculate this every time.
   */
  getFilterParams = () => {
    const { 
      components = []
    } = this.state;
    const filterParams = [];
    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      if (component.type === Constants.FILTER) {
        const { subType } = component;
        const filterParam = {};
        if (subType === Constants.SLICER) {
          const { 
            checkBoxes = []
          } = component;
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
        } else if (subType === Constants.SINGLE_VALUE) {
          filterParam.value = component.value;
        }
        filterParam.param = component.data.queryParameter;
        filterParam.type = component.subType;
        filterParams.push(filterParam);
      }
    }
    return filterParams;
  }

  handleSavedComponent = (componentId) => {
    axios.get(`/ws/component/${componentId}`)
      .then(res => {
        const component = res.data;
        const { 
          components, 
          gridWidth 
        } = this.state;
        const index = components.findIndex(w => w.id === component.id);
        const newComponents = [...components];
        // Resize the component.
        component.x = this.scaleToActual(component.x, gridWidth);
        component.width = this.scaleToActual(component.width, gridWidth);
        if (index === -1) {
          // New component.
          newComponents.push(component);
        } else {
          // Existing component.
          newComponents[index] = component;
        }
        this.setState({
          components: newComponents
        }, () => {
          // Query the component.
          const filterParams = this.getFilterParams();
          const {
            id,
            type,
          } = component;
          if (type === Constants.CHART) {
            this.queryChart(id, filterParams);
          }
        });
      });
  }

  render() {
    const { 
      componentViewWidth,
      showControl
    } = this.props;

    const top = showControl ? '50px' : '10px';
    const style = {
      top: top,
      width: componentViewWidth + 'px'
    }

    return (
      <div className="report-content-component-panel" style={style}>
        <GridLayout 
          width={this.state.gridWidth}
          height={this.props.height}
          backgroundColor={this.props.backgroundColor}
          snapToGrid={this.props.snapToGrid}
          showGridlines={this.props.showGridlines}
          components={this.state.components}
          isEditMode={this.props.isEditMode}
          onComponentMove={this.onComponentMove}
          onComponentEdit={this.props.onComponentEdit} 
          onComponentRemove={this.openConfirmDeletionPanel} 
          onComponentFilterInputChange={this.onComponentFilterInputChange}
          onComponentContentClick={this.props.onComponentContentClick}
        />
        
        <Modal 
          show={this.state.showConfirmDeletionPanel}
          onClose={this.closeConfirmDeletionPanel}
          modalClass={'small-modal-panel'}
          title={'Confirm Deletion'} >
          <div className="confirm-deletion-panel">
            Are you sure you want to delete this component?
          </div>
          <button className="button" onClick={this.confirmDelete}>Delete</button>
        </Modal>
      </div>
    )
  };
}

export default ComponentViewPanel;