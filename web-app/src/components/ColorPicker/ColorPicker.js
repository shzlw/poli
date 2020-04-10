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

  handleChange = (color) => {
    const { name } = this.props;
    const rgb = color.rgb;
    const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
    this.props.onChange(name, rgba);
  };

  close = () => {
    this.setState({
      showPalette: false
    }); 
  }

  render() {

    const color = {
      background: this.props.value
    };

    return (
      <div>
        <div className="colorpicker-select" onClick={this.handleClick}>
          <div className="colorpicker-color" style={color}></div>
        </div>
        { this.state.showPalette && (
          <div>
            <div className="colorpicker-overlay" onClick={this.close}>
            </div>
            <div className="colorpicker-popover">
              <ChromePicker color={this.props.value} onChange={this.handleChange} />
            </div>
          </div>
        )}
      </div>
    )
  };
}

export default ColorPicker;