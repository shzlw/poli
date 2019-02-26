import React from 'react';

class Slicer extends React.Component {

  state = {
    isSelectAll: false,
    searchValue: ''
  }

  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const isChecked = target.checked;

    const newCheckBoxes = [...this.props.checkBoxes];
    const index = newCheckBoxes.findIndex(x => x.value === name);
    newCheckBoxes[index].isChecked = isChecked;
    this.props.onChange(this.props.filterId, newCheckBoxes);
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
    // TODO: If value is too long, add.. to the end.
  }

  render() {
    const checkBoxes = this.props.checkBoxes;
    let checkBoxItems = [];
    if (checkBoxes !== undefined && checkBoxes.length !== 0) {
      checkBoxItems = this.props.checkBoxes.map((box, index) => 
        <div key={index}>
          <input 
            type="checkbox" 
            name={box.value} 
            value={box.value} 
            checked={box.isChecked} 
            onChange={this.handleChange}
            />
            {box.value}
          <br/>
        </div>
      );
    }

    return (
      <div>
        <button onClick={this.toggleSelectAll}>Toggle Select All {this.state.isSelectAll}</button>
        <input 
            type="text" 
            name="name" 
            value={this.state.searchValue}
            onChange={this.handleSearchValueChange} 
          />
        
        <div>
          {checkBoxItems}
        </div>
      </div>
    );
  }
}

export default Slicer;
