import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './TableWidget.css';

class TableWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
    };
  }

  render() {   
    const {
      data = [],
      columns = [],
      drillThrough = [],
      error
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
          const dashboardId = drillThrough[index].dashboardId;
          header.Cell = (props => <a href={`/poli/workspace/dashboard/${dashboardId}?${columnName}=${props.value}`}>{props.value}</a>);
        }
      }

      columnHeaders.push(header);
    });

    if (error) {
      return (
        <div>
          {error}
        </div>
      )
    }

    return (
      <ReactTable
        data={data}
        columns={columnHeaders}
        defaultPageSize={10}
        previousText={'Prev'}
        nextText={'Next'}
      />
    );
  }
}

export default TableWidget;
