import React from 'react';

class ImageBox extends React.Component {

  render() {
    const style = {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
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