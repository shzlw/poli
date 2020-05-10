package com.shzlw.poli.model;

public class AuditLog {

    public static final String ID = "id";
    public static final String TYPE = "type";
    public static final String CREATED_AT = "created_at";
    public static final String DATA = "data";

    private long id;
    private String createdAt;
    private String type;
    private String data;

    public AuditLog() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
