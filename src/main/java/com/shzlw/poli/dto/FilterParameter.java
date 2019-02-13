package com.shzlw.poli.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.shzlw.poli.util.RawStringDeserialzier;

public class FilterParameter {

    private String param;
    private String value;

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

    @Override
    public String toString() {
        return "FilterParameter{" +
                "param='" + param + '\'' +
                ", value='" + value + '\'' +
                '}';
    }
}
