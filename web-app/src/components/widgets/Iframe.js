import React from 'react';
import PropTypes from 'prop-types';

class Iframe extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    src: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  };

  render() {
    const {
      src,
      title
    } = this.props;

    const style = {
      width: '100%',
      height: '100%',
      border: '0px'
    }

    return (
      <iframe src={src} title={title} style={style}></iframe>
    );
  }
}

export default Iframe;