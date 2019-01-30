
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

  render() {
    const { selectedOption } = this.state;
    const { data } = this.state;

    return (
      <div>
        <AceEditor
          mode="mysql"
          theme="xcode"
          name="blah2"
          onChange={this.onChange}
          height={'300px'}
          width={'300px'}
          fontSize={18}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
            }}
          />
          <button onClick={this.submit}>Submit</button>

          <ReactTable
            data={data}
            columns={[
              {
                Header: "First Name",
                accessor: "firstName"
              },
              {
                Header: "Last Name",
                accessor: "lastName"
              },
            ]}
            defaultPageSize={10}
          />

          <GridLayout />
      </div>
    )
  }
}

export default Test;
