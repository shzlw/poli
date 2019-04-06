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
      drillThrough = []
    } = this.props;

    const columns = [];
    if (data.length > 0) {
      const obj = data[0];
      const keys = Object.keys(obj);
      for (const key of keys) {
        const header = {
          Header: key,
          accessor: key
        };
        
        if (drillThrough.length > 0) {
          const index = drillThrough.findIndex(d => d.columnName === key);
          if (index !== -1) {
            const dashboardId = drillThrough[index].dashboardId;
            header.Cell = (props => <a href={`/poli/workspace/dashboard/${dashboardId}?${key}=${props.value}`}>{props.value}</a>);
          }
        }

        columns.push(header);
      }
    }

    return (
      <ReactTable
        data={data}
        columns={columns}
        defaultPageSize={10}
        previousText={'Prev'}
        nextText={'Next'}
      />
    );
  }
}

export default TableWidget;
