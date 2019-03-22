
import React from 'react';
import { Link } from "react-router-dom";

class PageNotFound extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>PageNotFound</h1>
        <Link to="/login">Login</Link>
      </React.Fragment>
    )
  };
}

export default PageNotFound;