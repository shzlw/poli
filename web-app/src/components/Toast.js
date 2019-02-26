import React from 'react';

class Toast extends React.Component {

  state = {
    showToast: false,
    message: ''
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

  render() {
    return (
      <div>
        <button onClick={this.hide}>X</button>
        <dvi>
          {this.state.message}
        </dvi>
      </div>
    );
  }
}

export default Toast;