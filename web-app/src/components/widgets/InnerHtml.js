import React from 'react';
import PropTypes from 'prop-types';

class InnerHtml extends React.Component {

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