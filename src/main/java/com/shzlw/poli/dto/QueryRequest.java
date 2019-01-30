package com.shzlw.poli.dto;

public class QueryRequest {

    private long id;
    private String query;

    public QueryRequest() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}
