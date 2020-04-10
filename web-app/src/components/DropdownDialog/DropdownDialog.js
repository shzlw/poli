import React from 'react';
import './DropdownDialog.css';

class DropdownDialog extends React.Component {

  render() {
    const {
      show = false,
      children
    } = this.props;

    const displayClass = show ? 'display-block' : 'display-none';
    return (
      <div className={`dropdown-overlay ${displayClass}`} onClick={() => this.props.onClose()}>
        <div className={`dropdown-panel ${displayClass}`}>
          <div className="dropdown-body">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default DropdownDialog;