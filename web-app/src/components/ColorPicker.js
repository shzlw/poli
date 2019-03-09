import React, { Component } from 'react';
import { ChromePicker  } from 'react-color';

class ColorPicker extends Component {
   state = {
    displayColorPicker: false,
    color: {
      r: '241',
      g: '112',
      b: '19',
      a: '1',
    },
  };

  handleClick = () => {
    this.setState(prevState => ({
      displayColorPicker: !prevState.displayColorPicker
    })); 
  };

  handleClose = () => {
    this.setState({ 
      displayColorPicker: false 
    });
  };

  handleChange = (color) => {
    this.setState({ 
      color: color.rgb 
    });
  };

  render() {

    const color = {
      width: '36px',
      height: '14px',
      borderRadius: '2px',
      background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`
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
      zIndex: '2'
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
        { this.state.displayColorPicker ? <div style={popover}>
          <div style={cover} onClick={this.handleClose}/>
          <ChromePicker color={this.state.color} onChange={this.handleChange} />
        </div> : null }
      </div>
    )
  };
}

export default ColorPicker;