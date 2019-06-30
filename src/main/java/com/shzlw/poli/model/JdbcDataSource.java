package com.shzlw.poli.model;

import java.util.Objects;

public class JdbcDataSource {

    public static final String ID = "id";
    public static final String NAME = "name";
    public static final String USERNAME = "username";
    public static final String PASSWORD = "password";
    public static final String CONNECTION_URL = "connection_url";
    public static final String DRIVER_CLASS_NAME = "driver_class_name";
    public static final String PING = "ping";

    private long id;
    private String name;
    private String connectionUrl;
    private String driverClassName;
    private String username;
    private String password;
    private String ping;

    public JdbcDataSource() {}

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

    public String getConnectionUrl() {
        return connectionUrl;
    }

    public void setConnectionUrl(String connectionUrl) {
        this.connectionUrl = connectionUrl;
    }

    public String getDriverClassName() {
        return driverClassName;
    }

    public void setDriverClassName(String driverClassName) {
        this.driverClassName = driverClassName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPing() {
        return ping;
    }

    public void setPing(String ping) {
        this.ping = ping;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        JdbcDataSource that = (JdbcDataSource) o;
        return id == that.id &&
                Objects.equals(name, that.name) &&
                Objects.equals(connectionUrl, that.connectionUrl) &&
                Objects.equals(driverClassName, that.driverClassName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, connectionUrl, driverClassName);
    }
}
