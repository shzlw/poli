package com.shzlw.poli.model;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.shzlw.poli.util.RawStringDeserialzier;

/**
 * Single string => LIKE '%%'
 *
 * multiple Strings => IN (:fields)
 *
 * select name from table group by name;
 *
 *
 * two numbers range => :min, :max
 *
 * two dates range => :start, :max
 *
 */
public class Filter {

    private long id;
    private long dashboardId;

    /**
     * json column
     */
    private String data;

    public Filter() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getDashboardId() {
        return dashboardId;
    }

    public void setDashboardId(long dashboardId) {
        this.dashboardId = dashboardId;
    }

    @JsonRawValue
    public String getData() {
        return data;
    }

    @JsonDeserialize(using = RawStringDeserialzier.class)
    public void setData(String data) {
        this.data = data;
    }
}
