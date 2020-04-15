package com.shzlw.poli.dto;

public class QueryRequest {

    private long jdbcDataSourceId;
    private String sqlQuery;
    private int resultLimit;

    public QueryRequest() {}

    public long getJdbcDataSourceId() {
        return jdbcDataSourceId;
    }

    public void setJdbcDataSourceId(long jdbcDataSourceId) {
        this.jdbcDataSourceId = jdbcDataSourceId;
    }

    public String getSqlQuery() {
        return sqlQuery;
    }

    public void setSqlQuery(String sqlQuery) {
        this.sqlQuery = sqlQuery;
    }

    public int getResultLimit() {
        return resultLimit;
    }

    public void setResultLimit(int resultLimit) {
        this.resultLimit = resultLimit;
    }
}
