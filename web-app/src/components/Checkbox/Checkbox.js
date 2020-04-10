import React from 'react';
import PropTypes from 'prop-types';
import './Checkbox.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
    };
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
  };

  toggle = () => {
    const {
      name,
      checked,
      readOnly = false
    } = this.props;

    if (readOnly) {
      return;
    }

    this.props.onChange(name, !checked);
  }

  render() {
    const {
      value,
      checked
    } = this.props;

    return (
      <div className="checkbox-container">
        <div className="checkbox-checkmark" onClick={this.toggle}>
          { checked ? (
            <FontAwesomeIcon icon="check-square" />
          ) : (
            <FontAwesomeIcon icon={['far', 'square']} />
          )}
        </div>
        <div className="checkbox-label">{value}</div>
      </div>
    );
  }
}

export default Checkbox;
