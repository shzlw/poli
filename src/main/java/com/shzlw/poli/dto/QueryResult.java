package com.shzlw.poli.dto;

import java.util.List;

public class QueryResult {

    private long id;
    private List<Column> columns;
    private String data;

    public QueryResult() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public List<Column> getColumns() {
        return columns;
    }

    public void setColumns(List<Column> columns) {
        this.columns = columns;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
