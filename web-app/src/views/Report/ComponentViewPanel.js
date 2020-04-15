
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import * as Util from '../../api/Util';
import * as Constants from '../../api/Constants';

import './ComponentViewPanel.css';
import Checkbox from '../../components/Checkbox/Checkbox';
import ColorPicker from '../../components/ColorPicker/ColorPicker';
import InputRange from '../../components/filters/InputRange';
import Modal from '../../components/Modal/Modal';
import GridLayout from '../../components/GridLayout';

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
      selectedComponentId: 0,
      showExportCsvPanel: false,
      csvFilename: '',
      csvColumns: [],
      csvData: []
    };
  }

  componentDidMount() {
    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode) {
      const { ownerDocument } = thisNode;
      ownerDocument.addEventListener("keydown", this.onKeyDown);
    }
  }

  componentWillUnmount() {
    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode) {
      const { ownerDocument } = thisNode;
      ownerDocument.removeEventListener('keydown', this.onKeyDown);
    }
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleComponentInputChange = (name, value, isNumber = false) => {
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

  fetchComponents = (reportId, viewWidth, urlFilterParams) => {
    if (reportId === null) {
      return;
    }
    axios.get(`/ws/components/report/${reportId}`)
      .then(res => {
        const result = res.data;
        this.buildViewPanel(result, viewWidth, true, urlFilterParams);
      });
  }

  buildViewPanel = (components, viewWidth, isAdhoc, urlFilterParams) => {
    // Reorganize the filter component to push the datepicker filters to the end of the array so
    // they will be rendered later. Among them, the one with larger Y value should be rendered first.
    let reorderedComponents = [];
    const datepickers = [];
    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      const {
        type,
        subType,
        data = {}
      } = component;
      // Turn defaultParamValue into value to display default value for the filters.
      if (type === Constants.FILTER) {
        const {
          defaultParamValue
        } = data;
        if (defaultParamValue) {
          if (subType === Constants.DATE_PICKER) {
          // For example, defaultParamValue = 2019-01-01
            const dateArray = defaultParamValue.split('-');
            if (dateArray.length >= 3) {
              var date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]); 
              const epoch = Math.round((date).getTime());
              component.value = epoch;
            }
          } else if (subType === Constants.SINGLE_VALUE || subType === Constants.SLICER) {
            component.value = defaultParamValue;
          }
        }
      }

      if (type === Constants.FILTER && subType === Constants.DATE_PICKER) {
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
        const promises = this.queryFilters();
        // Wait for the filters to load all data. Then query charts.
        axios.all(promises).then(results => {
          this.queryCharts(urlFilterParams);
        });        
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
        this.queryChart(id, filterParams)
      }
    }
  }

  queryFilters() {
    const { components } = this.state;
    const promises = [];
    for (let i = 0; i < components.length; i++) {
      const {
        id,
        type,
        subType
      }  = components[i];
      if (type === Constants.FILTER) {
        promises.push(this._queryFilter(id, subType));
      }
    }
    return promises;
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

  _queryFilter(componentId, subType) {
    const { components } = this.state;
    if (subType === Constants.SLICER) {
      return axios.post(`/ws/jdbcquery/component/${componentId}`, [])
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
          const value = newComponents[index].value;
          if (value) {
            const defaultValues = value.split(',');
            for (let i = 0; i < defaultValues.length; i++) {
              for (let j = 0; j < checkBoxes.length; j++) {
                if (checkBoxes[j].value === defaultValues[i]) {
                  checkBoxes[j].isChecked = true;
                  break;
                }
              }
            }
          }

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

    } else if (subType === Constants.DATE_PICKER) {

    }
  }

  updateComponentPosition = (component) => {
    const newComponent = {...component};
    const { gridWidth } = this.state;
    this.resizeComponentToBase(newComponent, gridWidth);
    axios.put('/ws/components/position/', newComponent)
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
    axios.delete(`/ws/components/${componentId}`)
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
    }, () => {
      this.props.onComponentFilterInputChange();
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
        const { 
          subType,
          value,
          data = {} 
        } = component;
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
          filterParam.value = value;
        } else if (subType === Constants.DATE_PICKER) {
          let dateStr = '';
          if (value) {
            const date = new Date(parseInt(value, 10));
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            dateStr = year + '-' + Util.leftPadZero(month) + '-' + Util.leftPadZero(day);
          }
          filterParam.value = dateStr;
        }
        filterParam.param = data.queryParameter;
        filterParam.type = subType;
        filterParams.push(filterParam);
      }
    }
    return filterParams;
  }

  handleSavedComponent = (componentId) => {
    axios.get(`/ws/components/${componentId}`)
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
            this._queryFilter(id, subType);
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
        toast.error('Invalid position value');
        return;
      }
      this.resizeComponentToBase(selectedComponent, gridWidth);
      // Save position information and style
      axios.put('/ws/components/style/', selectedComponent)
      .then(res => {
        this.setState({
          selectedComponentId: 0
        });
      });
    }
  }

  onKeyDown = (event) => {
    const { keyCode } = event;
    if (!event.shiftKey) {
      return;
    }
    
    if (keyCode < 37 || keyCode > 40) {
      return;
    }

    const selectedComponent = this.getSelectedComponent();
    if (selectedComponent == null) {
      return;
    }

    let {
      x,
      y,
      width,
      height
    } = selectedComponent;

    const COMPONENT_BORDER = 2;

    switch (event.keyCode) {
      case 37:
        // Left
        if (x <= 0) {
          return;
        }
        x--;
        this.handleComponentInputChange('x', x, true);
        break;
      case 38:
        // Up
        if (y <= 0) {
          return;
        }
        y--;
        this.handleComponentInputChange('y', y, true);
        break;
      case 39:
        // Right
        if (x + width + COMPONENT_BORDER * 2 >= this.state.gridWidth) {
          return;
        }
        x++;
        this.handleComponentInputChange('x', x, true);
        break;
      case 40:
        // Down
        if (y + height + COMPONENT_BORDER * 2 >= this.props.height) {
          return;
        }
        y++;
        this.handleComponentInputChange('y', y, true);
        break;
      default:
        return;
    }
  }

  getSelectedComponent = () => {
    const {
      selectedComponentId,
      components = []
    } = this.state;
    if (selectedComponentId === 0) {
      return null;
    }
    const index = components.findIndex(w => w.id === selectedComponentId);
    const selectedComponent = index === -1 ? null : components[index];
    return selectedComponent;
  }

  onComponentCsvExport = (title = 'poli', columns = [], data = []) => {
    this.setState({
      csvFilename: title,
      showExportCsvPanel: true,
      csvColumns: columns,
      csvData: data
    });
  }

  downloadCsv = () => {
    const {
      csvFilename: title,
      csvColumns: columns,
      csvData: data
    } = this.state;

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

    this.setState({
      csvFilename: '',
      showExportCsvPanel: false,
      csvColumns: [],
      csvData: []
    });
  }

  render() {
    const { t } = this.props;

    const { 
      reportViewWidth
    } = this.props;

    const selectedComponent = this.getSelectedComponent();

    const top = '50px';
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
          onComponentCsvExport={this.onComponentCsvExport}
        />
        
        <Modal 
          show={this.state.showConfirmDeletionPanel}
          onClose={this.closeConfirmDeletionPanel}
          modalClass={'small-modal-panel'}
          title={t('Confirm Deletion')} >
          <div className="confirm-deletion-panel">
            {t('Are you sure you want to delete this component?')}
          </div>
          <button className="button button-red full-width" onClick={this.confirmDelete}>{t('Delete')}</button>
        </Modal>

        <Modal 
          show={this.state.showExportCsvPanel}
          onClose={() => this.setState({ showExportCsvPanel: false })}
          modalClass={'small-modal-panel'} 
          title={t('Export as CSV')} >
          <div className="form-panel">
            <label>{t('File Name')}</label>
            <input 
              className="form-input"
              type="text" 
              name="csvFilename" 
              value={this.state.csvFilename}
              onChange={this.handleInputChange} 
            />
            <button className="button button-green" onClick={this.downloadCsv}>
              <FontAwesomeIcon icon="file-download"  fixedWidth /> {t('Export')}
            </button>
          </div>
        </Modal>

        {selectedComponent && (
          <div className="report-component-style-panel">
            <div className="side-panel-content" style={{margin: '3px 0px'}}>
              <button className="icon-button button-green" onClick={this.saveComponentStyle}>
                <FontAwesomeIcon icon="save" size="lg" />
              </button>
            </div>

            <div className="side-panel-title">{t('Title')}</div>
            <div className="side-panel-content">
              <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                <div className="float-left">{t('Show')}</div>
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
                      onChange={(event) => this.handleComponentInputChange('title', event.target.value)} 
                    />
                  </div>

                  <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                    <div className="float-left">{t('Font')}</div>
                    <div className="float-right" style={{paddingTop: '4px'}}>
                      <ColorPicker name={'titleFontColor'} value={selectedComponent.style.titleFontColor} onChange={this.onStyleValueChange} />
                    </div>
                  </div>

                  <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                    <div className="float-left">{t('Background')}</div>
                    <div className="float-right" style={{paddingTop: '4px'}}>
                      <ColorPicker name={'titleBackgroundColor'} value={selectedComponent.style.titleBackgroundColor} onChange={this.onStyleValueChange} />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </div>
            
            <div className="side-panel-title">{t('Border')}</div>
            <div className="side-panel-content">
              <div className="row side-panel-content-row">
                <div className="float-left">{t('Show')}</div>
                <div className="float-right">
                  <Checkbox name="showBorder" value="" checked={selectedComponent.style.showBorder} onChange={this.onStyleValueChange} />
                </div>
              </div>

              { selectedComponent.style.showBorder && (
                <div className="row side-panel-content-row">
                  <div className="float-left">{t('Color')}</div>
                  <div className="float-right" style={{paddingTop: '4px'}}>
                    <ColorPicker name={'borderColor'} value={selectedComponent.style.borderColor} onChange={this.onStyleValueChange} />
                  </div>
                </div>
              )}
            </div>

            <div className="side-panel-title">{t('Content')}</div>
            <div className="side-panel-content">
              <div className="row side-panel-content-row">
                <div className="float-left">{t('Background')}</div>
                <div className="float-right" style={{paddingTop: '4px'}}>
                  <ColorPicker name={'contentBackgroundColor'} value={selectedComponent.style.contentBackgroundColor} onChange={this.onStyleValueChange} />
                </div>
              </div>
            </div>
            
            <div className="side-panel-title">{t('Z Index')}</div>
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

            <div className="side-panel-title">{t('Position')}</div>
            <div className="side-panel-content">
              <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                <div className="float-left">{t('X')}</div>
                <div className="float-right">
                  <input 
                    className="side-panel-input side-panel-number-input"
                    type="text" 
                    name="x" 
                    value={selectedComponent.x}
                    onChange={(event) => this.handleComponentInputChange('x', event.target.value, true)}
                  />
                </div>
              </div>

              <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                <div className="float-left">{t('Y')}</div>
                <div className="float-right">
                  <input 
                    className="side-panel-input side-panel-number-input"
                    type="text" 
                    name="y" 
                    value={selectedComponent.y}
                    onChange={(event) => this.handleComponentInputChange('y', event.target.value, true)}
                  />
                </div>
              </div>

              <div className="row side-panel-content-row" style={{marginBottom: '5px'}}>
                <div className="float-left">{t('Width')}</div>
                <div className="float-right">
                  <input 
                    className="side-panel-input side-panel-number-input"
                    type="text" 
                    name="width" 
                    value={selectedComponent.width}
                    onChange={(event) => this.handleComponentInputChange('width', event.target.value, true)}
                  />
                </div>
              </div>

              <div className="row side-panel-content-row">
                <div className="float-left">{t('Height')}</div>
                <div className="float-right">
                  <input 
                    className="side-panel-input side-panel-number-input"
                    type="text" 
                    name="height" 
                    value={selectedComponent.height}
                    onChange={(event) => this.handleComponentInputChange('height', event.target.value, true)}
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

export default (withTranslation('', { withRef: true })(ComponentViewPanel));
