import React from 'react';
import PropTypes from 'prop-types';
import './InputRange.css';

class InputRange extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    step: PropTypes.number.isRequired
  };

  handleInputChange = (event) => {
    const { name } = this.props;
    const value = Number(event.target.value);
    this.props.onChange(name, value);
  }

  render() {
    const {
      name,
      min,
      max,
      value,
      step
    } = this.props;

    return (
      <div className="input-range-container">
        <div style={{marginBottom: '6px'}}>
          <span className="input-range-value">{value}</span>
        </div>
        <input 
          type="range" 
          name={name} 
          min={min} 
          max={max} 
          value={value} 
          onChange={this.handleInputChange}
          step={step}
          className="input-range"
        />
      </div>
    );
  }
}

export default InputRange;