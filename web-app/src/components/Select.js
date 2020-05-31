import React from 'react';
import PropTypes from 'prop-types';

class Select extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    optionDisplay: PropTypes.string,
    optionValue: PropTypes.string,
    preloadOneEmpty: PropTypes.bool
  };

  handleOptionChange = (event) => {
    const name = this.props.name;
    const value = event.target.value;
    this.props.onChange(name, value);
  }
  
  render() {
    const {
      value,
      options = [],
      optionValue,
      optionDisplay,
      preloadOneEmpty = true
    } = this.props;

    const optionList = [];
    if (preloadOneEmpty) {
      optionList.push(
        <option value="" key=""></option>
      );
    }
    
    options.forEach((option, index) => {
      let value;
      let display;
      if (optionValue && optionDisplay) {
        // The options contain objects.
        value = option[optionValue];
        display = option[optionDisplay];
      } else {
        // The options contain string or number.
        value = option;
        display = option;
      }
      
      optionList.push(
        <option value={value} key={value}>{display}</option>
      ) 
    });

    return (
      <select 
        className="form-input"
        value={value} 
        onChange={this.handleOptionChange}>
        {optionList}
      </select>
    )
  };
}

export default Select;