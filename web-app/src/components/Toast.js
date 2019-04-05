import React from 'react';
import './Toast.css';

class Toast extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      message: ''
    };

    Toast._toastRef = this;
  }

  show = (message) => {
    this.setState({ 
      showToast: true,
      message: message
    }, () => {
      setTimeout(() => {
        this.hide();
      }, 3000);
    });
  }

  hide = () => {
    this.setState({ 
      showToast: false,
      message: ''
    });
  }

  static show = () => {
    Toast._toastRef.show();
  }

  render() {
    const {
      showToast,
      message
    } = this.state;

    const toastStatus = showToast ? 'display-block' : 'display-none';

    return (
      <div className={`toast-container ${toastStatus}`}>
        <button onClick={this.hide}>X</button>
        <div>
          {message}
        </div>
      </div>
    );
  }
}

export default Toast;