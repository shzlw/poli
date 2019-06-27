package com.shzlw.poleo.dto;

public class Column {

    private String name;
    private String javaType;
    private String dbType;
    private int length;

    public Column(String name, String javaType, String dbType, int length) {
        this.name = name;
        this.javaType = javaType;
        this.dbType = dbType;
        this.length = length;
    }

    public String getName() {
        return name;
    }

    public String getJavaType() {
        return javaType;
    }

    public String getDbType() {
        return dbType;
    }

    public int getLength() {
        return length;
    }
}
