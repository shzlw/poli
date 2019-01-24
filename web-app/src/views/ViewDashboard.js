
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ViewDashboard extends Component {

  componentDidMount() {
    const url = this.props.location.search;
    const queryObj = this.getQueryStringParams(url);
    console.log(queryObj);

    // Pass the URL params to filters, then init the widgets.
  }

  getQueryStringParams = url => {
    let first = url.indexOf('?');
    const query = url.substring(first + 1);
    console.log('query', query);
    return query
      ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
          let [key, value] = param.split('=');
          params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
          return params;
        }, {}
        ) : {};
  }

  render() {
    return (
      <div>
        ViewDashboard
      </div>
    )
  };
}

export default withRouter(ViewDashboard);