import React from 'react';

class TextBox extends React.Component {
  state = {}

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