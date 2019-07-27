package com.shzlw.poli.model;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.shzlw.poli.util.RawStringDeserialzier;

public class Component {

    public static final String ID = "id";
    public static final String REPORT_ID = "report_id";
    public static final String DATASOURCE_ID = "datasource_id";
    public static final String TITLE = "title";
    public static final String X = "x";
    public static final String Y = "y";
    public static final String WIDTH = "width";
    public static final String HEIGHT = "height";
    public static final String TYPE = "type";
    public static final String SUB_TYPE = "sub_type";
    public static final String SQL_QUERY = "sql_query";
    public static final String DATA = "data";
    public static final String DRILL_THROUGH = "drill_through";
    public static final String STYLE = "style";

    private long id;
    private String title;
    private int x;
    private int y;
    private int width;
    private int height;
    private long jdbcDataSourceId;
    private long reportId;
    private String sqlQuery;

    private String type;

    private String subType;

    /**
     * Json column
     * Chart configuration
     */
    private String data;

    /**
     * Json column
     */
    private String drillThrough;

    /**
     * Json column
     */
    private String style;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
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

    public long getReportId() {
        return reportId;
    }

    public void setReportId(long reportId) {
        this.reportId = reportId;
    }

    public String getSqlQuery() {
        return sqlQuery;
    }

    public void setSqlQuery(String sqlQuery) {
        this.sqlQuery = sqlQuery;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSubType() {
        return subType;
    }

    public void setSubType(String subType) {
        this.subType = subType;
    }

    @JsonRawValue
    public String getData() {
        return data;
    }

    @JsonDeserialize(using = RawStringDeserialzier.class)
    public void setData(String data) {
        this.data = data;
    }

    @JsonRawValue
    public String getDrillThrough() {
        return drillThrough;
    }

    @JsonDeserialize(using = RawStringDeserialzier.class)
    public void setDrillThrough(String drillThrough) {
        this.drillThrough = drillThrough;
    }

    @JsonRawValue
    public String getStyle() {
        return style;
    }

    @JsonDeserialize(using = RawStringDeserialzier.class)
    public void setStyle(String style) {
        this.style = style;
    }
}
