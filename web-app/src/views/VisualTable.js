import EditableTable from "./VisualTable/EditableTable";
import React from "react";
import "./VisualTable.css";

class VisualTable extends React.Component {
    render() {
    return (
        <div className="table-control-container">
            <div className="display-flex">
              <div style={{width:'100%'}}>
              <div className="margin1">
                <EditableTable />
            </div>
              </div>
            </div>            
        </div>
    );
    }
}

export default VisualTable;