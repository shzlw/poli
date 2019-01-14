import React from 'react';

class QuerySlicer extends React.Component {

  constructor(props) {
    super(props);

    const data = this.props.data;
    const checkBoxes = [];
    for (let i = 0; i < data.length; i++) {
      checkBoxes.push({
        value: data[i],
        isChecked: false
      });
    }

    this.state = {
      isSelectAll: false,
      checkBoxes: checkBoxes
    };
  }

  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const isChecked = target.checked;

    const newCheckBoxes = [...this.state.checkBoxes];
    const newCheckBox = newCheckBoxes.find(x => x.value === name);
    newCheckBox.isChecked = isChecked;

    this.setState({
      checkBoxes: newCheckBoxes
    });
  }

  toggleSelectAll = () => {
    const newIsSelectAll = !this.state.isSelectAll;
    const newCheckBoxes = [...this.state.checkBoxes];
    for (let i = 0; i < newCheckBoxes.length; i++) {
      newCheckBoxes[i].isChecked = newIsSelectAll;
    }

    this.setState({
      isSelectAll: newIsSelectAll,
      checkBoxes: newCheckBoxes
    });
  }

  applyFilter = () => {
    console.log(this.state.checkBoxes);
    const checkBoxes = this.state.checkBoxes;
    const checked = [];
    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].isChecked) {
        checked.push(checkBoxes[i]);
      }
    }

    const isSelectAll = checked.length === checkBoxes.length;
    this.props.onApply(checked, isSelectAll);
  }

  render() {

    const checkBoxes = this.state.checkBoxes.map((box, index) => 
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

    return (
      <div>
        <button onClick={this.toggleSelectAll}>Toggle Select All {this.state.isSelectAll}</button>
        <div>
          {checkBoxes}
        </div>
        <button onClick={this.applyFilter}>Apply</button>
      </div>
    );
  }
}

export default QuerySlicer;
