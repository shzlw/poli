package com.shzlw.poli.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.shzlw.poli.util.RawStringDeserialzier;

public class FilterParameter {

    private String type;
    private String param;
    private String value;
    /**
     * If the type is: 'slicer' and remark is: 'select all', then no parameters should be applied to the query.
     */
    private String remark;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getParam() {
        return param;
    }

    public void setParam(String param) {
        this.param = param;
    }

    @JsonRawValue
    public String getValue() {
        return value;
    }

    @JsonDeserialize(using = RawStringDeserialzier.class)
    public void setValue(String value) {
        this.value = value;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    @Override
    public String toString() {
        return "FilterParameter{" +
                "type='" + type + '\'' +
                ", param='" + param + '\'' +
                ", value='" + value + '\'' +
                '}';
    }
}
