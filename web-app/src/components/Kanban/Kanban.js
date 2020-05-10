import React from 'react';
import PropTypes from 'prop-types';
import './Kanban.css';

class Kanban extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  static propTypes = {
    groupByField: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    blockTitleField: PropTypes.string
  };

  componentDidMount() {
  }
  
  render() {
    // TODO: allow to setup fixed width for column? 
    // If the width is defined, the panel should be scrollable.
    // TODO: sort the blocks based on orderByField?
    const {
      groupByField,
      blockTitleField,
      data = []
    } = this.props;

    const groupData = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const index = groupData.findIndex(g => g.groupBy === row[groupByField]);
      if (index === -1) {
        groupData.push({
          groupBy: row[groupByField],
          blocks: [row]
        });
      } else {
        groupData[index].blocks.push(row);
      }
    }

    const groupPanelItems = [];
    for (let i = 0; i < groupData.length; i++) {
      const {
        groupBy,
        blocks
      } = groupData[i];
      
      const blockItems = [];
      for (let j = 0; j < blocks.length; j++) {
        const blockRowItems = [];
        let blockTitleValue = null;
        for (let [key, value] of Object.entries(blocks[j])) {
          if (key === blockTitleField) {
            blockTitleValue = value;
          } else if (key !== groupByField) {
            blockRowItems.push(
              <div className="kanban-block-body-row">{value}</div>
            );
          }
        }

        blockItems.push(
          <div class="kanban-block">
            { blockTitleValue && (
              <div class="kanban-block-title">{blockTitleValue}</div>
            )}
            <div class="kanban-block-body">
              {blockRowItems}
            </div>
          </div>
        );
      }

      groupPanelItems.push(
        <div class="kanban-column">
          <div class="kanban-group-title">{groupBy}</div>
          <div class="kanban-group-panel">
            {blockItems}
          </div>
        </div>
      );
    } 

    return (
      <div class="kanban-container">
        {groupPanelItems}
      </div>
    );
  }
}

export default Kanban;