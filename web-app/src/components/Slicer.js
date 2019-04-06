import React from 'react';
import Checkbox from './Checkbox';
import './Slicer.css';

class Slicer extends React.Component {

  state = {
    isSelectAll: false,
    searchValue: ''
  }

  toggleSelectAll = () => {
    const newIsSelectAll = !this.state.isSelectAll;
    const newCheckBoxes = [...this.props.checkBoxes];
    for (let i = 0; i < newCheckBoxes.length; i++) {
      newCheckBoxes[i].isChecked = newIsSelectAll;
    }
    this.props.onChange(this.props.filterId, newCheckBoxes);

    this.setState(prevState => ({
      isSelectAll: !prevState.isSelectAll
    }));
  }

  handleSearchValueChange = (event) => {
    const searchValue = event.target.value;
    if (searchValue) {
      const result = [];
      const { checkBoxes } = this.props;
      for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].value.indexOf(searchValue) !== -1) {
          result.push(checkBoxes[i]);
        }
      }
    }

    this.setState({
      searchValue: searchValue
    });

    // TODO: add checkBoxes to states and add a function to setCheckBoxes
  }

  handleCheckBoxChange = (name, isChecked) => {
    const newCheckBoxes = [...this.props.checkBoxes];
    const index = newCheckBoxes.findIndex(x => x.value === name);
    newCheckBoxes[index].isChecked = isChecked;
    this.props.onChange(this.props.filterId, newCheckBoxes);
  }

  render() {
    const { 
      checkBoxes = []
    } = this.props;
    const checkBoxItems = checkBoxes.map((box, index) => 
      <Checkbox 
        key={index} 
        name={box.value} 
        value={box.value} 
        checked={box.isChecked} 
        onChange={this.handleCheckBoxChange} 
      />
    );

    return (
      <div>
        <button className="button" onClick={this.toggleSelectAll}>Toggle Select All {this.state.isSelectAll}</button>
        <input 
            type="text" 
            name="name" 
            value={this.state.searchValue}
            onChange={this.handleSearchValueChange} 
          />
        
        <div className="slicer-body">
          {checkBoxItems}
        </div>
      </div>
    );
  }
}

export default Slicer;
