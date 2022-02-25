import EditableTable from "./EditableTable/EditableTable";
import React from "react";
import "./VisualTable.css";

class VisualTable extends React.Component {
    render() {
    return (
        <div className="table-control-container">
            <div className="display-flex">
              <div className="form-text">
              <div className="margin2">
                <EditableTable />
            </div>
              </div>
            </div>            
        </div>
    );
    }
}

export default VisualTable;