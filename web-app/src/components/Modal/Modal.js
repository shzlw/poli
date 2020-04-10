import React from 'react';
import './Modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Modal extends React.Component {

  render() {
    const {
      show,
      modalClass = '',
      title,
      children
    } = this.props;

    const modalStatus = show ? 'display-block' : 'display-none';
    return (
      <div className={`modal-overlay ${modalStatus}`}>
        <div className={`modal-panel ${modalClass}`}>
          <div className="model-header row">
            <div className="model-title">{title}</div>
            <button className="model-close-button icon-button" onClick={() => this.props.onClose()}>
              <FontAwesomeIcon icon="times" size="lg" />
            </button>
          </div>
          <hr/>
          <div className='modal-body'>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;