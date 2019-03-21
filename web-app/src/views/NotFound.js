
import React from 'react';
import { Route, Link, Switch } from "react-router-dom";

class NotFound extends React.Component {
  render() {
    return (
      <div>
        <h1>NotFound</h1>
        <Link to="/login">Login</Link>
      </div>
    )
  };
}

export default NotFound;