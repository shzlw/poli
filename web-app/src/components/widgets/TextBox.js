import React from 'react';
import PropTypes from 'prop-types';
import './TextBox.css';

class TextBox extends React.Component {
  
  static propTypes = {
    fontSize: PropTypes.string.isRequired,
    fontColor: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  };

  render() {
    const {
      fontSize = 16,
      fontColor = '#000000',
      isLink = false,
      value, 
      linkUrl
    } = this.props;

    const style = {
      fontSize: fontSize + 'px',
      color: fontColor
    }

    return (
      <div className="text-box" style={style}>
        { isLink ?
          (
            <a href={linkUrl}>{value}</a>
          ) : 
          (
            value
          )
        }
      </div>
    );
  }
}

export default TextBox;