import React from 'react';
import './Checkbox.css';

class Checkbox extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
    };
  }

  handleChange = (event) => {
    const name = event.target.name;
    const isChecked = event.target.checked;
    console.log(name, isChecked);
    this.props.onChange(name, isChecked);
  }

  render() {
    const {
      name,
      value,
      isChecked
    } = this.props;

    return (
      <div className="checkbox-container">
        <div className="truncate">
          {value}
        </div>
        <input 
          type="checkbox" 
          name={name}
          value={value}
          checked={isChecked}
          onChange={this.handleChange} />
        <span className="checkmark"></span>
      </div>
    );
  }
}

export default Checkbox;
