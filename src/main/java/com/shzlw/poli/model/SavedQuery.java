package com.shzlw.poli.model;

public class SavedQuery {

    public static final String ID = "id";
    public static final String DATASOURCE_ID = "datasource_id";
    public static final String NAME = "name";
    public static final String SQL_QUERY = "sql_query";
    public static final String ENDPOINT_NAME = "endpoint_name";
    public static final String ENDPOINT_ACCESSCODE = "endpoint_accesscode";

    private long id;
    private String name;
    private String sqlQuery;
    private long jdbcDataSourceId;

    // Http endpoint
    private String endpointName;
    private String endpointAccessCode;

    public SavedQuery() {}

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

    public String getSqlQuery() {
        return sqlQuery;
    }

    public void setSqlQuery(String sqlQuery) {
        this.sqlQuery = sqlQuery;
    }

    public long getJdbcDataSourceId() {
        return jdbcDataSourceId;
    }

    public void setJdbcDataSourceId(long jdbcDataSourceId) {
        this.jdbcDataSourceId = jdbcDataSourceId;
    }

    public String getEndpointName() {
        return endpointName;
    }

    public void setEndpointName(String endpointName) {
        this.endpointName = endpointName;
    }

    public String getEndpointAccessCode() {
        return endpointAccessCode;
    }

    public void setEndpointAccessCode(String endpointAccessCode) {
        this.endpointAccessCode = endpointAccessCode;
    }
}
