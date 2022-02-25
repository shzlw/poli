import React from "react";
import { Form } from "antd";

export const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);


export const EditableFormRow = Form.create()(EditableRow);
