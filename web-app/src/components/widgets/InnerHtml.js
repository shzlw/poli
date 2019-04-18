import React from 'react';
import PropTypes from 'prop-types';

class InnerHtml extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    html: PropTypes.string.isRequired,
    style: PropTypes.object
  };

  render() {
    const {
      html,
      style
    } = this.props;

    const markup = {
      __html: html
    }

    return (
      <div dangerouslySetInnerHTML={markup} style={style} />
    );
  }
}

export default InnerHtml;