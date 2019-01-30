import React from 'react';

class FilterEditPanel extends React.Component {
  render() {
    const panelClass = this.props.show ? 'right-drawer display-block' : 'right-drawer display-none';

    return (
      <div className={panelClass}>
        <h3>FilterEditPanel</h3>
        <button onClick={() => this.props.onClose()}>Close</button>
      </div>
    )
  };
}

export default FilterEditPanel;