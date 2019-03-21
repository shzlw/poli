import React from 'react';
import './Modal.css';

class Modal extends React.Component {

  render() {
    const modalStatus = this.props.show ? 'display-block' : 'display-none';
    return (
      <div className={`modal-overlay ${modalStatus}`}>
        <div className={this.props.modalClass}>
          <div>
            {this.props.title}
          </div>
          <button onClick={() => this.props.onClose()}>Close</button>
          <div className='modal-body'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;