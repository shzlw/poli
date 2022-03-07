import React from "react";
import { Table, Popconfirm } from "antd";
import { EditableFormRow, EditableContext } from "./EditableFormRow";
import EditableCell from "./EditableCell";
import { cleanTheData, raw } from "../data/plCleanData";
import { plColumns } from "./plColumns";

export default class EditableTable extends React.Component {
  state = { data: cleanTheData(raw), editingKey: "" };
  columns = [
    ...plColumns,
    {
      title: "operation",
      dataIndex: "operation",
      render: (text, record) => {
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a
                      href="javascript:;"
                      onClick={() => this.save(form, record.key)}
                      style={{ marginRight: 8 }}
                    >
                      Save
                    </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm
                  title="Sure to cancel?"
                  onConfirm={() => this.cancel(record.key)}
                >
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <a onClick={() => this.edit(record.key)}>Edit</a>
            )}
          </div>
        );
      }
    }
  ];

  isEditing = record => {
    return record.key === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        // pick the proper record based on primary key
        const item = newData[index];
        // Bugfix: preprocess date,time,boolean values to render properly on save
        const dateFormatted = row.date.format("DD.MM.YYYY");
        const timeFormatted = row.time.format("HH:mm");
        const booleanToString = row.freeclick.toString();
        const campToEuro = `€ ${row.camp_cpc}`;
        row.date = dateFormatted;
        row.time = timeFormatted;
        row.freeclick = booleanToString;
        row.camp_cpc = campToEuro;

        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.setState({ data: newData, editingKey: "" });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }

  cancel = () => {
    this.setState({ editingKey: "" });
  };

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => {
          const checkInput = index => {
            switch (index) {
              case "camp_cpc":
                return "number";
              case "date":
                return "date";
              case "time":
                return "time";
              case "freeclick":
                return "checkbox";
              case "network":
                return "radio";
              case "PlistaProduct":
                return "select";
              default:
                return "text";
            }
          };
          return {
            record,
            // inputType: col.dataIndex === "age" ? "number" : "text",
            inputType: checkInput(col.dataIndex),
            dataIndex: col.dataIndex,
            title: col.title,
            editing: this.isEditing(record)
          };
        }
      };
    });

    console.log(this.state.data);
    return (
      <Table
        components={components}
        bordered
        dataSource={this.state.data}
        columns={columns}
        rowClassName="editable-row"
      />
    );
  }
}
