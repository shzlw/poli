import React from 'react';
import PropTypes from 'prop-types';
import './ImageBox.css';

class ImageBox extends React.Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
    isFull: PropTypes.bool
  };

  render() {
    const {
      isFull = false,
      src
    } = this.props;

    const imageClass = isFull ? 'image-full' : 'image-original-scale';

    return (
      <img 
        className={imageClass}
        src={src} 
        alt="not available"
      />
    );
  }
}

export default ImageBox;