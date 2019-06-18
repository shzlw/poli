
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
import Toast from './Toast';


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
        this.buildViewPanel(result, viewWidth, true);
      });
  }

  buildViewPanel = (components, viewWidth, isAdhoc) => {
    // Reorganize the filter component to push the datepicker filters to the end of the array so
    // they will be rendered later. Among them, the one with larger Y value should be rendered first.
    let reorderedComponents = [];
    const datepickers = [];
    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      if (component.type === Constants.FILTER && component.subType === Constants.DATE_PICKER) {
        datepickers.push(component);
      } else {
        reorderedComponents.push(component);
      }
    }
    datepickers.sort((a, b) => b.y - a.y);
    reorderedComponents = reorderedComponents.concat(datepickers);

    this.setState({
      components: reorderedComponents
    }, () => {
      this.resizeGrid(viewWidth);
      if (isAdhoc) {
        this.queryFilters();
        this.queryCharts();
      }
    });
  }

  getComponentsSnapshot = () => {
    const {
      components = [],
      gridWidth
    } = this.state;
    const newComponents = JSON.parse(JSON.stringify(components));
    for (let i = 0; i < newComponents.length; i++) {
      this.resizeComponentToBase(newComponents[i], gridWidth);
    }
    return newComponents;
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
    } else if (component.subType === Constants.SINGLE_VALUE
      || component.subType === Constants.DATE_PICKER) {
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
          const { value } = component;
          filterParam.value = value;
        } else if (subType === Constants.DATE_PICKER) {
          const { value } = component;
          let dateStr = '';
          if (value) {
            const date = new Date(parseInt(value, 10) * 1000);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            dateStr = year + '-' + Util.leftPadZero(month) + '-' + Util.leftPadZero(day);
          }
          filterParam.value = dateStr;
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
      const {
        x,
        y,
        width,
        height
      } = selectedComponent;
      if (x < 0 || y < 0 || width < 30 || height < 30 || height > this.props.height) {
        Toast.showError('Invalid position value');
        return;
      }
      this.resizeComponentToBase(selectedComponent, gridWidth);
      // Save position information and style
      axios.put('/ws/component/style/', selectedComponent)
      .then(res => {
        this.setState({
          selectedComponentId: 0
        });
      });
    }
  }

  render() {
    const { 
      reportViewWidth,
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
      width: reportViewWidth + 'px'
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
          reportType={this.props.reportType}
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
          <button className="button button-red full-width" onClick={this.confirmDelete}>Delete</button>
        </Modal>

        {selectedComponent && (
          <div className="report-component-style-panel">
            <div className="side-panel-content" style={{margin: '3px 0px'}}>
              <button className="icon-button button-green" onClick={this.saveComponentStyle}>
                <FontAwesomeIcon icon="save" size="lg" />
              </button>
            </div>

            <div className="side-panel-title">Title</div>
            <div className="side-panel-content">
              <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                <div className="float-left">Show</div>
                <div className="float-right">
                  <Checkbox name="showTitle" value="" checked={selectedComponent.style.showTitle} onChange={this.onStyleValueChange} />
                </div>
              </div>

              { selectedComponent.style.showTitle && (
                <React.Fragment>
                  <div className="side-panel-content-row" style={{marginBottom: '5px'}}>
                    <input 
                      className="side-panel-input"
                      type="text" 
                      name="title" 
                      value={selectedComponent.title}
                      onChange={(event) => this.handleInputChange('title', event.target.value)} 
                    />
                  </div>

                  <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                    <div className="float-left">Font</div>
                    <div className="float-right" style={{paddingTop: '4px'}}>
                      <ColorPicker name={'titleFontColor'} value={selectedComponent.style.titleFontColor} onChange={this.onStyleValueChange} />
                    </div>
                  </div>

                  <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                    <div className="float-left">Background</div>
                    <div className="float-right" style={{paddingTop: '4px'}}>
                      <ColorPicker name={'titleBackgroundColor'} value={selectedComponent.style.titleBackgroundColor} onChange={this.onStyleValueChange} />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </div>
            
            <div className="side-panel-title">Border</div>
            <div className="side-panel-content">
              <div className="row side-panel-content-row">
                <div className="float-left">Show</div>
                <div className="float-right">
                  <Checkbox name="showBorder" value="" checked={selectedComponent.style.showBorder} onChange={this.onStyleValueChange} />
                </div>
              </div>

              { selectedComponent.style.showBorder && (
                <div className="row side-panel-content-row">
                  <div className="float-left">Color</div>
                  <div className="float-right" style={{paddingTop: '4px'}}>
                    <ColorPicker name={'borderColor'} value={selectedComponent.style.borderColor} onChange={this.onStyleValueChange} />
                  </div>
                </div>
              )}
            </div>

            <div className="side-panel-title">Content</div>
            <div className="side-panel-content">
              <div className="row side-panel-content-row">
                <div className="float-left">Background</div>
                <div className="float-right" style={{paddingTop: '4px'}}>
                  <ColorPicker name={'contentBackgroundColor'} value={selectedComponent.style.contentBackgroundColor} onChange={this.onStyleValueChange} />
                </div>
              </div>
            </div>
            
            <div className="side-panel-title">Z Index</div>
            <div className="side-panel-content">
              <InputRange
                name="zIndex" 
                value={selectedComponent.style.zIndex}
                onChange={this.onStyleValueChange} 
                min={1}
                max={50}
                step={1}
              />
            </div>

            <div className="side-panel-title">Position</div>
            <div className="side-panel-content">
              <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                <div className="float-left">X</div>
                <div className="float-right">
                  <input 
                    className="side-panel-input side-panel-number-input"
                    type="text" 
                    name="x" 
                    value={selectedComponent.x}
                    onChange={(event) => this.handleInputChange('x', event.target.value, true)}
                  />
                </div>
              </div>

              <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                <div className="float-left">Y</div>
                <div className="float-right">
                  <input 
                    className="side-panel-input side-panel-number-input"
                    type="text" 
                    name="y" 
                    value={selectedComponent.y}
                    onChange={(event) => this.handleInputChange('y', event.target.value, true)}
                  />
                </div>
              </div>

              <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                <div className="float-left">Width</div>
                <div className="float-right">
                  <input 
                    className="side-panel-input side-panel-number-input"
                    type="text" 
                    name="width" 
                    value={selectedComponent.width}
                    onChange={(event) => this.handleInputChange('width', event.target.value, true)}
                  />
                </div>
              </div>

              <div className="row side-panel-content-row">
                <div className="float-left">Height</div>
                <div className="float-right">
                  <input 
                    className="side-panel-input side-panel-number-input"
                    type="text" 
                    name="height" 
                    value={selectedComponent.height}
                    onChange={(event) => this.handleInputChange('height', event.target.value, true)}
                  />
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    )
  };
}

export default ComponentViewPanel;