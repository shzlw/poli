
import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import GridLayout from './GridLayout';
import * as Util from '../api/Util';
import Modal from './Modal';
import * as Constants from '../api/Constants';

import './ComponentViewPanel.css';
import Checkbox from './Checkbox';
import ColorPicker from './ColorPicker';
import InputRange from './filters/InputRange';

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
      objectToDelete: {},
      selectedComponentId: 0
    };
  }

  componentDidMount() {
  }

  handleInputChange = (name, value, isNumber = false) => {
    let val = isNumber ? (parseInt(value, 10) || 0) : value;
    const {
      selectedComponentId,
      components = []
    } = this.state;
    const index = components.findIndex(w => w.id === selectedComponentId);
    if (index !== -1) {
      const newComponents = [...components];
      newComponents[index][[name]] = val;
      this.setState({
        components: newComponents
      });
    }
  }

  onStyleValueChange = (name, value) => {
    const {
      selectedComponentId,
      components = []
    } = this.state;
    const index = components.findIndex(w => w.id === selectedComponentId);
    if (index !== -1) {
      const newComponents = [...components];
      newComponents[index].style[[name]] = value;
      this.setState({
        components: newComponents
      });
    }
  }

  resizeGrid = (viewWidth) => {
    let gridWidth = viewWidth - 10;
    const { 
      isFixedWidth,
      fixedWidth
    } = this.props;
    if (isFixedWidth) {
      gridWidth = fixedWidth;
    } 

    const { components } = this.state;
    const newComponents = [...components];

    this.resizeComponentsToActual(newComponents, gridWidth);
    this.setState({
      components: newComponents,
      gridWidth: gridWidth
    });
  }

  resizeComponentToBase = (component, gridWidth) => {
    component.x = this.scaleToBase(component.x, gridWidth);
    component.width = this.scaleToBase(component.width, gridWidth);
  }

  resizeComponentsToActual = (components, gridWidth) => {
    for (let i = 0; i < components.length; i++) {
      this.resizeComponentToActual(components[i], gridWidth);
    }
  }

  resizeComponentToActual = (component, gridWidth) => {
    component.x = this.scaleToActual(component.x, gridWidth);
    component.width = this.scaleToActual(component.width, gridWidth);
  }

  scaleToActual = (num, gridWidth) => {
    return Math.ceil(num * gridWidth / BASE_WIDTH);
  }

  scaleToBase = (num, gridWidth) => {
    return Math.floor(num * BASE_WIDTH / gridWidth);
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
        const index = components.findIndex(w => w.id === componentId);
        const newComponents = [...components];
        newComponents[index].queryResult = queryResult;
        this.setState({
          components: newComponents
        });
      })
      .catch(error => {
        const resData = error.response.data || {};
        const serverError = resData.error;
        const serverMsg = resData.message;
        const displayError = serverError + ": " + serverMsg;
        const index = components.findIndex(w => w.id === componentId);
        const newComponents = [...components];
        newComponents[index].queryResult = {
          error: displayError
        };
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
          const index = components.findIndex(w => w.id === componentId);
          const newComponents = [...components];
          newComponents[index].queryResult = queryResult;
          newComponents[index].checkBoxes = checkBoxes;
          this.setState({
            components: newComponents
          });
        })
        .catch(error => {
          const resData = error.response.data || {};
          const serverError = resData.error;
          const serverMsg = resData.message;
          const displayError = serverError + ": " + serverMsg;
          const index = components.findIndex(w => w.id === componentId);
          const newComponents = [...components];
          newComponents[index].queryResult = {
            error: displayError
          };
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

  updateComponentPosition = (component) => {
    const newComponent = {...component};
    const { gridWidth } = this.state;
    this.resizeComponentToBase(newComponent, gridWidth);
    axios.put('/ws/component/position/', newComponent)
      .then(res => {
      });
  }

  onComponentMove = (component) => {
    const { 
      components,
      selectedComponentId
    } = this.state;
    const {
      id,
      x,
      y,
      width,
      height
    } = component;
    const index = components.findIndex(w => w.id === id);
    const newComponents = [...components];
    newComponents[index].x = x;
    newComponents[index].y = y;
    newComponents[index].width = width;
    newComponents[index].height = height;

    let newSelectedComponentId = selectedComponentId === id ? 0 : id;
    this.setState({
      components: newComponents,
      selectedComponentId: newSelectedComponentId
    }, () => {
      this.updateComponentPosition(component);
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
        this.resizeComponentToActual(component, gridWidth);
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
            subType
          } = component;
          if (type === Constants.CHART) {
            this.queryChart(id, filterParams);
          } else if (type === Constants.FILTER) {
            this.queryFilter(id, subType);
          }
        });
      });
  }

  saveComponentStyle = () => {
    const {
      selectedComponentId,
      components = [],
      gridWidth
    } = this.state;
    const index = components.findIndex(w => w.id === selectedComponentId);
    if (index !== -1) {
      const selectedComponent = {...components[index]};
      this.resizeComponentToBase(selectedComponent, gridWidth);
      // Save position information and style
      axios.put('/ws/component/style/', selectedComponent)
      .then(res => {
      });
    }
  }

  render() {
    const { 
      componentViewWidth,
      showControl
    } = this.props;

    const {
      selectedComponentId,
      components = []
    } = this.state;
    const index = components.findIndex(w => w.id === selectedComponentId);
    const selectedComponent = index === -1 ? null : components[index];

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
          selectedComponentId={this.state.selectedComponentId}
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

        {selectedComponent && (
          <div className="report-component-style-panel">
            <div className="form-panel">
              <button className="button square-button button-green ml-4" onClick={this.saveComponentStyle}>
                <FontAwesomeIcon icon="save" size="lg" fixedWidth />
              </button>
              <div>
                <label>Title</label>
                <Checkbox name="showTitle" value="Show" checked={selectedComponent.style.showTitle} onChange={this.onStyleValueChange} />
                { selectedComponent.style.showTitle && (
                  <div style={{marginTop: '5px'}}>
                    <input 
                      type="text" 
                      name="title" 
                      value={selectedComponent.title}
                      onChange={(event) => this.handleInputChange('title', event.target.value)} 
                    />

                    <div>
                      <label>Font Color</label>
                      <ColorPicker name={'titleFontColor'} value={selectedComponent.style.titleFontColor} onChange={this.onStyleValueChange} />
                    </div>

                    <div style={{marginTop: '8px'}}>
                      <label>Background Color</label>
                      <ColorPicker name={'titleBackgroundColor'} value={selectedComponent.style.titleBackgroundColor} onChange={this.onStyleValueChange} />
                    </div>
                  </div>
                )}
              </div>

              <hr/>
              
              <div style={{marginTop: '8px'}}>
                <label>Border</label>
                <Checkbox name="showBorder" value="Show" checked={selectedComponent.style.showBorder} onChange={this.onStyleValueChange} />
                { selectedComponent.style.showBorder && (
                  <div style={{marginTop: '5px'}}>
                    <label>Color</label>
                    <ColorPicker name={'borderColor'} value={selectedComponent.style.borderColor} onChange={this.onStyleValueChange} />
                  </div>
                )}
              </div>

              <hr/>

              <div style={{marginTop: '8px'}}>
                <label>Content Background Color</label>
                <div style={{marginTop: '5px'}}>
                  <ColorPicker name={'contentBackgroundColor'} value={selectedComponent.style.contentBackgroundColor} onChange={this.onStyleValueChange} />
                </div>
              </div>

              <hr/>
              <div style={{marginTop: '8px'}}>
                <label>Z Index</label>
                <div style={{marginTop: '3px'}}>
                  <InputRange
                    name="zIndex" 
                    value={selectedComponent.style.zIndex}
                    onChange={this.onStyleValueChange} 
                    min={1}
                    max={50}
                    step={1}
                  />
                </div>
              </div>

              <label>X</label>
                <input 
                  type="text" 
                  name="x" 
                  value={selectedComponent.x}
                  onChange={(event) => this.handleInputChange('x', event.target.value, true)}
                />
                <label>Y</label>
                <input 
                  type="text" 
                  name="y" 
                  value={selectedComponent.y}
                  onChange={(event) => this.handleInputChange('y', event.target.value, true)}
                />
                <label>Width</label>
                <input 
                  type="text" 
                  name="width" 
                  value={selectedComponent.width}
                  onChange={(event) => this.handleInputChange('width', event.target.value, true)}
                />
                <label>Height</label>
                <input 
                  type="text" 
                  name="height" 
                  value={selectedComponent.height}
                  onChange={(event) => this.handleInputChange('height', event.target.value, true)}
                />

            </div>
          </div>
        )}

      </div>
    )
  };
}

export default ComponentViewPanel;