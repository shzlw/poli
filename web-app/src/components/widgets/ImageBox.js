import React from 'react';
import PropTypes from 'prop-types';

class ImageBox extends React.Component {

  static propTypes = {
    src: PropTypes.string.isRequired
  };

  render() {
    const style = {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      display: 'block'
    }

    return (
      <img 
        style={style}
        src={this.props.src} 
      />
    );
  }
}

export default ImageBox;