import React from 'react';
import { ChromePicker } from 'react-color';

class ColorPicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showPalette: false
    }
  }

  handleClick = () => {
    this.setState(prevState => ({
      showPalette: !prevState.showPalette
    })); 
  };

  handleClose = () => {
    this.setState({ 
      showPalette: false 
    });
  };

  handleChange = (color) => {
    const { name } = this.props;
    const rgb = color.rgb;
    const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
    this.props.onChange(name, rgba);
  };

  render() {

    const color = {
      width: '36px',
      height: '14px',
      borderRadius: '2px',
      background: this.props.value
    };

    const swatch = {
      padding: '5px',
      background: '#fff',
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: 'pointer'
    };

    const popover = {
      position: 'absolute',
      zIndex: 2
    };

    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    };

    return (
      <div>
        <div style={swatch} onClick={this.handleClick}>
          <div style={color} />
        </div>
        { this.state.showPalette && (
          <div style={popover}>
            <div style={cover} onClick={this.handleClose} />
            <ChromePicker color={this.props.value} onChange={this.handleChange} />
          </div>
        )}
      </div>
    )
  };
}

export default ColorPicker;