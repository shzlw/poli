import React from 'react';

class ImageBox extends React.Component {
  state = {}

  render() {
    return (
      <img 
        className="image-box" 
        src={this.props.url} 
        />
    );
  }
}

export default ImageBox;