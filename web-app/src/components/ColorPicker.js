import React from 'react';
import { ChromePicker } from 'react-color';
import './ColorPicker.css'

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

    return (
      <div>
        <div className="colorpicker-select" onClick={this.handleClick}>
          <div style={color} />
        </div>
        { this.state.showPalette && (
          <div className="colorpicker-popover">
            <div className="colorpicker-cover" onClick={this.handleClose} />
            <ChromePicker color={this.props.value} onChange={this.handleChange} />
          </div>
        )}
      </div>
    )
  };
}

export default ColorPicker;