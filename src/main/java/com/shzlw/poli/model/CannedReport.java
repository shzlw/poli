package com.shzlw.poli.model;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.shzlw.poli.util.RawStringDeserialzier;

public class CannedReport {

    private long id;
    private String name;
    private String createdBy;
    private long createdAt;

    // Json column
    private String data;

    public CannedReport() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
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
