import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  TimePicker,
  Checkbox,
  Radio
} from "antd";
import { EditableContext } from "./EditableFormRow";
import moment from "moment";
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
export default class EditableCell extends React.Component {
  dateFormat = "DD.MM.YYYY";
  timeFormat = "HH:mm";
  getInput = (record, dataIndex, title, getFieldDecorator) => {
    switch (this.props.inputType) {
      case "number":
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(
              <InputNumber formatter={value => value} parser={value => value} />
            )}
          </FormItem>
        );
      case "date":
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              initialValue: moment(record[dataIndex], this.dateFormat)
            })(<DatePicker format={this.dateFormat} />)}
          </FormItem>
        );
      case "time":
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              initialValue: moment(record[dataIndex], this.timeFormat)
            })(<TimePicker format={this.timeFormat} />)}
          </FormItem>
        );
      case "checkbox":
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              initialValue: record[dataIndex] === "true",
              valuePropName: "checked"
            })(<Checkbox />)}
          </FormItem>
        );

      case "radio":
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              initialValue: record[dataIndex]
            })(
              <RadioGroup>
                <Radio value={"a"}>a</Radio>
                <Radio value={"b"}>b</Radio>
              </RadioGroup>
            )}
          </FormItem>
        );
      case "select":
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              initialValue: record[dataIndex]
            })(
              <Select style={{ width: 150 }}>
                {[...Array(11).keys()]
                  .filter(x => x > 0)
                  .map(c => `Product ${c}`)
                  .map((p, index) => (
                    <Option value={p} key={index}>
                      {p}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
        );

      default:
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(<Input />)}
          </FormItem>
        );
    }
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing
                ? // <FormItem style={{ margin: 0 }}>
                  //   {getFieldDecorator(dataIndex, {
                  //     rules: [
                  //       {
                  //         required: true,
                  //         message: `Please Input ${title}!`
                  //       }
                  //     ]
                  //     // initialValue: record[dataIndex]
                  //   })(this.getInput())}
                  // </FormItem>
                  this.getInput(record, dataIndex, title, getFieldDecorator)
                : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
