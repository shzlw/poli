import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './Table.css';

class Table extends React.Component {

  handleTdClick = (reportId, columnName, columnValue) => {
    this.props.onTableTdClick(reportId, columnName, columnValue);
  }

  render() {   
    const {
      data = [],
      columns = [],
      drillThrough = [],
      defaultPageSize = 10
    } = this.props;

    const columnHeaders = [];
    columns.forEach(column => {
      const columnName = column.name;
      const header = {
        Header: columnName,
        accessor: columnName
      };
      if (drillThrough.length > 0) {
        const index = drillThrough.findIndex(d => d.columnName === columnName);
        if (index !== -1) {
          const reportId = drillThrough[index].reportId;
          header.Cell = (props => 
            <span className="link-label" 
              onClick={() => this.handleTdClick(reportId, columnName, props.value)}>
              {props.value}
            </span>
          );
        }
      }

      columnHeaders.push(header);
    });

    if (data.length === 0 || columns.length === 0) {
      return (
        <div>No data</div>
      )
    }

    return (
      <ReactTable
        data={data}
        columns={columnHeaders}
        defaultPageSize={defaultPageSize}
        previousText={'Prev'}
        nextText={'Next'}
      />
    );
  }
}

export default Table;
