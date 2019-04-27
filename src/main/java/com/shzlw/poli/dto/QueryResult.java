package com.shzlw.poli.dto;

import java.util.ArrayList;
import java.util.List;

public class QueryResult {

    private List<Column> columns = new ArrayList<>();

    /**
     * JSON array value
     */
    private String data;
    private String error;

    private QueryResult() {
    }

    public QueryResult(String error) {
        this.error = error;
    }

    public QueryResult(String data, List<Column> columns) {
        this.data = data;
        this.columns = columns;
    }

    public List<Column> getColumns() {
        return columns;
    }

    public String getData() {
        if (data == null || data == "") {
            return "[]";
        }
        return data;
    }

    public String getError() {
        return error;
    }
}
