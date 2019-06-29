import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SearchInput.css';

class SearchInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    inputWidth: PropTypes.number
  };

  handleInputChange = (event) => {
    const { name } = this.props;
    const value = event.target.value;
    this.props.onChange(name, value);
  }

  reset = () => {
    const { name } = this.props;
    this.props.onChange(name, '');
  }

  render() {
    const {
      name,
      value,
      inputWidth
    } = this.props;

    let inputStyle = {};
    if (inputWidth) {
      inputStyle.width = inputWidth + 'px';
    }

    return (
      <div className="search-input-container">
        <div className="row">
          <div className="search-input-icon float-left">
            <FontAwesomeIcon icon="search" style={{margin: '10px'}} />
          </div>
          <div className="float-left">
            <input
              type="text"
              name={name}
              value={value}
              onChange={this.handleInputChange}
              className="form-input search-input-input"
              style={inputStyle}
            />
          </div>
          <button className="button search-input-reset-button float-right" onClick={this.reset}>
            <FontAwesomeIcon icon="times" size="lg" />
          </button>
        </div>
      </div>
    );
  }
}

export default SearchInput;