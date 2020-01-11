import React from 'react';
import PropTypes from 'prop-types';
import './Processbar.css';

class Processbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  static propTypes = {
    value: PropTypes.number.isRequired,
    percentage: PropTypes.number.isRequired,
    fontColor: PropTypes.string,
    barColor: PropTypes.string,
    backgroundColor: PropTypes.string
  };

  componentDidMount() {
  }

  
  render() {
    const {
      value,
      percentage,
      fontColor = 'green',
      barColor = '#f80',
      backgroundColor = '#ddd'
    } = this.props;

    const containerStyle = {
      backgroundColor: backgroundColor
    };

    const progressBarStyle = {
      width: percentage + '%',
      backgroundColor: barColor
    };

    const valueStyle = {
      color: fontColor
    };

    return (
      <div class="progress-container" style={containerStyle}>
        <div class="progress-bar" style={progressBarStyle}></div>
        <div class="progress-value" style={valueStyle}>{value}</div>
      </div>
    );
  }
}

export default Processbar;
