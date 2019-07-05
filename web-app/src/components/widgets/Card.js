import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

class Card extends React.Component {

  static propTypes = {
    value: PropTypes.string.isRequired,
    fontSize: PropTypes.string,
    fontColor: PropTypes.string
  };

  render() {
    const {
      value,
      fontSize = 16,    
      fontColor = '#000000'
    } = this.props;

    const valueStyle = {
      fontSize: fontSize + 'px',
      color: fontColor
    }

    return (
      <div className="card-container">
        <div className="card-value" style={valueStyle}>
          {value}
        </div>
      </div>
    );
  }
}

export default Card;