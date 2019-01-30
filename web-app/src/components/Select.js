
import React from 'react';

class Select extends React.Component {

  handleOptionChange = () => {
    
  }
  
  render() {
    const options = ['A', 'B', 'C'];
    const optionList = options.map(o =>
      <option value={o} key={o}>{o}</option>
    );

    return (
      <select value={this.state.optionValue} onChange={this.handleOptionChange}>
        {optionList}
      </select>
    )
  };
}

export default Select;