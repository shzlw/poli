package com.shzlw.poli.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class User {

    public static final String ID = "id";
    public static final String USERNAME = "username";
    public static final String NAME = "name";
    public static final String PASSWORD = "password";
    public static final String TEMP_PASSWORD = "temp_password";
    public static final String SESSION_KEY = "session_key";
    public static final String SESSION_TIMEOUT = "session_timeout";
    public static final String SYS_ROLE = "sys_role";
    public static final String API_KEY = "api_key";

    private long id;
    private String username;
    private String name;
    private String password;
    private String tempPassword;
    private String sessionKey;
    private LocalDateTime sessionTimeout;
    private String sysRole;
    private String apiKey;

    private List<Long> userGroups = new ArrayList<>();

    private List<UserAttribute> userAttributes = new ArrayList<>();

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTempPassword() {
        return tempPassword;
    }

    public void setTempPassword(String tempPassword) {
        this.tempPassword = tempPassword;
    }

    public String getSessionKey() {
        return sessionKey;
    }

    public void setSessionKey(String sessionKey) {
        this.sessionKey = sessionKey;
    }

    public LocalDateTime getSessionTimeout() {
        return sessionTimeout;
    }

    public void setSessionTimeout(LocalDateTime sessionTimeout) {
        this.sessionTimeout = sessionTimeout;
    }

    public String getSysRole() {
        return sysRole;
    }

    public void setSysRole(String sysRole) {
        this.sysRole = sysRole;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public List<Long> getUserGroups() {
        return userGroups;
    }

    public void setUserGroups(List<Long> userGroups) {
        this.userGroups = userGroups;
    }

    public List<UserAttribute> getUserAttributes() {
        return userAttributes;
    }

    public void setUserAttributes(List<UserAttribute> userAttributes) {
        this.userAttributes = userAttributes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id == user.id &&
                username.equals(user.username) &&
                sysRole.equals(user.sysRole);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, sysRole);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", name='" + name + '\'' +
                ", password='" + password + '\'' +
                ", sessionTimeout=" + sessionTimeout +
                ", sysRole='" + sysRole + '\'' +
                ", apiKey='" + apiKey + '\'' +
                '}';
    }
}
