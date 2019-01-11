package com.shzlw.poli.dto;

public class QueryResult {

    private long id;
    private String data;

    public QueryResult(long id, String data) {
        this.id = id;
        this.data = data;
    }

    public long getId() {
        return id;
    }

    public String getData() {
        return data;
    }
}
