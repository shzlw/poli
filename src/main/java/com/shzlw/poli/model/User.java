package com.shzlw.poli.model;

public class User {

    public static final String ROLE_ADMIN = "admin";
    public static final String ROLE_DEVELOPER = "developer";
    public static final String ROLE_VIEWER = "viewer";

    private long id;
    private String username;
    private String password;
    private String sessionToken;
    private String role = ROLE_VIEWER;

    public User() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public String getSessionToken() {
        return sessionToken;
    }

    public void setSessionToken(String sessionToken) {
        this.sessionToken = sessionToken;
    }
}
