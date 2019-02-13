package com.shzlw.poli.model;

public class JdbcDataSource {

    public static final String ID = "id";
    public static final String NAME = "name";
    public static final String USERNAME = "username";
    public static final String PASSWORD = "password";
    public static final String CONNECTION_URL = "connection_url";
    public static final String TYPE = "type";
    public static final String PING = "ping";

    private long id;
    private String name;
    private String connectionUrl;
    private String username;
    private String password;
    private String type;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

        if (id != that.id) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;
        if (connectionUrl != null ? !connectionUrl.equals(that.connectionUrl) : that.connectionUrl != null)
            return false;
        if (username != null ? !username.equals(that.username) : that.username != null) return false;
        if (password != null ? !password.equals(that.password) : that.password != null) return false;
        if (type != null ? !type.equals(that.type) : that.type != null) return false;
        return ping != null ? ping.equals(that.ping) : that.ping == null;
    }

    @Override
    public int hashCode() {
        int result = (int) (id ^ (id >>> 32));
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (connectionUrl != null ? connectionUrl.hashCode() : 0);
        result = 31 * result + (username != null ? username.hashCode() : 0);
        result = 31 * result + (password != null ? password.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (ping != null ? ping.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "JdbcDataSource{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", connectionUrl='" + connectionUrl + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", type='" + type + '\'' +
                ", ping='" + ping + '\'' +
                '}';
    }
}
