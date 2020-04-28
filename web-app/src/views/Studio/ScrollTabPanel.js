import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './ScrollTabPanel.css';


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: '3px 4px 3px 8px',
  marginRight: '3px',
  background: isDragging ? 'lightgreen' : '#ccc',
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  display: 'flex',
  overflow: 'hidden',
});


class ScrollTabPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() { 
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const tabs = reorder(
      this.state.tabs,
      result.source.index,
      result.destination.index
    );

    this.setState({
      tabs: tabs
    });
  }

  addNewTab = () => {
    
  }

  removeTab = (tab) => {
    const {
      tabs
    } = this.state;
    const index = tabs.findIndex(d => d.id === tab.id);
    if (index !== -1) {
      const newTabs = [...tabs];
      newTabs.splice(index, 1);
      this.setState({
        tabs: newTabs
      });
    } 
  }

  handleTabClick = (title) => {
    const { tabs } = this.state;
    let tabContent = '';
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      if (tab.id === title.id) {
        document.title = tab.id;
        break;
      }
    }

    this.setState({
      tabContent: tabContent
    });
  }

  scrollToLeftTabs = () => {
    const $container = document.getElementById('studio-tab-droppable-container');
    $container.scrollLeft -= 200;
  }

  scrollToRightTabs = () => {
    const $container = document.getElementById('studio-tab-droppable-container');
    $container.scrollLeft += 200;
  }

  render() {

    const {
      tabs = []
    } = this.props;

    const tabHeaders = [];
    for (let i = 0; i < tabs.length; i++) {
      const item = tabs[i];
      tabHeaders.push(
        <Draggable key={i} draggableId={item.id} index={i}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              <div className={`dynamic-tab-select-item`} key={i} onClick={() => this.props.onTabClick(item)}>
                <div className="dynamic-tab-select-value">{item.label}</div>
                <button className="button dynamic-tab-close-button" onClick={() => this.props.onRemoveTab(item)}>
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>
            </div>
          )}
        </Draggable>
        
      );
    }

    return (
      <div className="dynamic-tab-container"> 
        <div className="dynamic-tab-button-group">
          <button className="button square-button button-transparent" onClick={this.props.onAddTab} >
            <FontAwesomeIcon icon="plus"  fixedWidth />
          </button>
          <button className="button square-button button-transparent" onClick={this.scrollToLeftTabs} >
              <FontAwesomeIcon icon="chevron-left"  fixedWidth />
          </button>
          <button className="button square-button button-transparent" onClick={this.scrollToRightTabs} >
              <FontAwesomeIcon icon="chevron-right"  fixedWidth />
          </button>
        </div>
        <div className="dynamic-tab-droppable-container">

          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  id="studio-tab-droppable-container"
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {tabHeaders}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

        </div>
      </div>
    );
  }
  
}

export default ScrollTabPanel;