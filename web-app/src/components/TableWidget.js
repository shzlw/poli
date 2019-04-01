import React from 'react';
import './TableWidget.css';

class TableWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
    };
  }

  render() {

    const headers = [];
    if (Util.isArrayEmpty(queryResultData)) {
    } else {
      const obj = queryResultData[0];
      const keys = Object.keys(obj);
      for (const key of keys) {
        headers.push({
          Header: key,
          accessor: key
        });
      }
    }

    return (
      <ReactTable
        data={queryResultData}
        columns={headers}
        minRows={0}
        showPagination={false}
      />
    );
  }
}

export default TableWidget;
