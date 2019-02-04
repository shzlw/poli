
import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/mysql';
import 'brace/theme/xcode';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import GridLayout from '../components/GridLayout';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

const widgets = [
   {
    id: 1,
    name: 'title1',
    x: 0,
    y: 0,
    width: 100,
    height: 100
  },
  {
    id: 2,
    name: 'title2',
    x: 100,
    y: 100,
    width: 100,
    height: 100
  }
];

class Test extends React.PureComponent {

  state = {
    selectedOption: null,
    data: [
      {firstName: 'a1', lastName: 'b1'},
      {firstName: 'a2', lastName: 'b2'},
      {firstName: 'a3', lastName: 'b3'}
    ]
  }

  onChange = (newValue) => {
    console.log('change',newValue);
  }

  submit = () => {
    console.log('submit', );
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  }

  editWidget = (widgetId) => {
    console.log('editWidget', widgetId);
  }

  render() {
    return (
      <div>

          <GridLayout 
            width={800}
            height={600}
            snapToGrid={false}
            showGridlines={true}
            widgets={widgets} />
      </div>
    )
  }
}

export default Test;
