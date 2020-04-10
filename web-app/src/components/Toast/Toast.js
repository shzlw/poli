import React from 'react';
import './Toast.css';

const COLOR_RED = '#ef5350';
const COLOR_GREEN = '#66bb6a';

class Toast extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      message: '',
      backgroundColor: COLOR_RED,
      timeoutId: ''
    };

    Toast._toastRef = this;
  }

  componentWillUnmount() {
    const { timeoutId } = this.state;
    if (timeoutId) {
      clearInterval(timeoutId);
    }
  }

  show = (message, bgColor) => {
    const { timeoutId } = this.state;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    this.setState({ 
      showToast: true,
      message: message,
      backgroundColor: bgColor,
      timeoutId: ''
    }, () => {
      const timeoutId = setTimeout(() => {
        this.hide();
      }, 3000);
      this.setState({
        timeoutId: timeoutId
      });
    });
  }

  hide = () => {
    this.setState({ 
      showToast: false,
      message: ''
    });
  }

  static showSuccess = (message) => {
    Toast._toastRef.show(message, COLOR_GREEN);
  }

   static showError = (message) => {
    Toast._toastRef.show(message, COLOR_RED);
  }

  render() {
    const {
      showToast,
      message,
      backgroundColor
    } = this.state;

    const toastStatus = showToast ? 'display-block' : 'display-none';
    const style = {
      backgroundColor: backgroundColor
    }

    return (
      <div className={`toast-container ${toastStatus}`} style={style}>
        {message}
      </div>
    );
  }
}

export default Toast;