import React from 'react';
import PropTypes from 'prop-types';
import './Paginator.css';

class Paginator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    min: PropTypes.number,
    max: PropTypes.number
  };

  previous = () => {
    const { 
      name,
      value,
      min = 1
    } = this.props;
    const current = Number(value);
    let prev = current - 1;
    if (prev < min) {
      prev = current;
    }
    this.props.onChange(name, prev);
  }

  next = () => {
    const { 
      name,
      value,
      max = 100
    } = this.props;
    const current = Number(value);
    let next = current + 1;
    if (next > max) {
      next = current;
    }
    this.props.onChange(name, next);
  }

  clickNumber = (value) => {
    const { 
      name
    } = this.props;
    const current = Number(value);
    this.props.onChange(name, current);
  }

  render() {
    const {
      value,
      min = 1,
      max = 100
    } = this.props;

    if (max <= min) {
      return (<div>error: min >= max</div>);
    }

    if (value > max || value < min) {
      return (<div>error: value out of range</div>);
    }

    let showPrevious = true;
    let showNext = true;
    if (value === min) {
      showPrevious = false;
    } else if (value === max) {
      showNext = false;
    }

    return (
      <div>
        { showPrevious && (
          <button className="paginator-button" onClick={this.previous}>&#8249;</button>
        )}
        
        <button className="paginator-button" onClick={() => this.clickNumber(value)}>{value}</button>
        
        { showNext && (
          <button className="paginator-button" onClick={this.next}>&#8250;</button>
        )}
      </div>
    );
  }
}

export default Paginator;