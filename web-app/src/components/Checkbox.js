import React from 'react';
import './Checkbox.css';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
    };
  }

  toggle = () => {
    const {
      name,
      checked
    } = this.props;

    this.props.onChange(name, !checked);
  }

  render() {
    const {
      value,
      checked
    } = this.props;

    const checkmarkBgColor = checked ? '#000000' : '#FFFFFF';
    const checkmarkStyle = {
      backgroundColor: checkmarkBgColor
    }

    return (
      <div className="checkbox-container" onClick={this.toggle}>
        <div className="checkbox-checkmark" style={checkmarkStyle}></div>
        <div className="checkbox-label">{value}</div>
      </div>
    );
  }
}


export default Checkbox;
