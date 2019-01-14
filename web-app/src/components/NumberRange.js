import React from 'react';

class NumberRange extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div>
        min
        <input type="number" name="min" />
        max
        <input type="number" name="max" />
      </div>
    );
  }
}

export default NumberRange;