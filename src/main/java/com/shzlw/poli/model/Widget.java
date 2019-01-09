package com.shzlw.poli.model;

import java.util.ArrayList;
import java.util.List;

public class Widget {

    private long id;
    private int width;
    private int height;
    private long jdbcDataSourceId;
    private long dashboardId;

    /**
     * Json column
     * name, type, display name
     */
    private String columns;

    /**
     * {
     *     sqlQuery,
     *
     * }
     *
     */
    private String data;


    /**
     * select * from a where col IN (:field)
     */
    private String sqlQuery;

    /**
     * {
     *  ":fields": "a,b,c",
     *  "valu2": "value2"
     * }
     */
    private String filterParams;

    /**
     * table
     * kpi
     */
    private String chartType;
    // json column
    private String chartOptions;

    /**
     * NON database field.
     */
    private String queryResult;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public long getJdbcDataSourceId() {
        return jdbcDataSourceId;
    }

    public void setJdbcDataSourceId(long jdbcDataSourceId) {
        this.jdbcDataSourceId = jdbcDataSourceId;
    }

    public long getDashboardId() {
        return dashboardId;
    }

    public void setDashboardId(long dashboardId) {
        this.dashboardId = dashboardId;
    }

    public String getColumns() {
        return columns;
    }

    public void setColumns(String columns) {
        this.columns = columns;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getSqlQuery() {
        return sqlQuery;
    }

    public void setSqlQuery(String sqlQuery) {
        this.sqlQuery = sqlQuery;
    }

    public String getFilterParams() {
        return filterParams;
    }

    public void setFilterParams(String filterParams) {
        this.filterParams = filterParams;
    }

    public String getChartType() {
        return chartType;
    }

    public void setChartType(String chartType) {
        this.chartType = chartType;
    }

    public String getChartOptions() {
        return chartOptions;
    }

    public void setChartOptions(String chartOptions) {
        this.chartOptions = chartOptions;
    }

    public String getQueryResult() {
        return queryResult;
    }

    public void setQueryResult(String queryResult) {
        this.queryResult = queryResult;
    }
}
